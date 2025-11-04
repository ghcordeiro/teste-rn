import {EFirebaseNotificationType} from '@enum/EFirebaseNotificationType';
import messaging, {firebase} from '@react-native-firebase/messaging';
import ToastError from '@utils/ToastError';
import {firebaseRouteNotification} from '@utils/firebaseRouteNotification';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {AppState, Platform} from 'react-native';
import Toast from 'src/utils/toast';
import StorageStore from '../services/storage';

interface INavigationProps {
  name: string;
  params?: {
    notificationId?: string;
    notificationOriginId?: string;
  };
}
interface FirebaseContextData {
  token: string;
  returnToken: () => Promise<string>;
  initialize: () => void;
  nextPage: INavigationProps | null;
}

const Firebase = createContext<FirebaseContextData>({} as FirebaseContextData);

const FirebaseProvider = ({children}: PropsWithChildren) => {
  const [token, setToken] = useState<string>('');
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [nextPage, setNextPage] = useState<INavigationProps | null>(null);

  useEffect(() => {
    if (firebase.apps.length === 0) {
      firebase.initializeApp(
        {
          appId:
            Platform.OS === 'android'
              ? '1:322598641926:android:911a5f1f3ec90821073e87'
              : '1:322598641926:ios:3b1c0430cb026b53073e87',
          projectId: 'e-cooperativa',
          apiKey: 'AIzaSyAeUav6YFVAC2JSO2ndlRehJ2765cQs8hY',
          messagingSenderId: '322598641926',
          databaseURL: '',
          storageBucket: '',
        },
        {name: 'e-cooperativa'},
      );
    }
  }, []);

  const _handleAppStateChange = async (nextAppState: any) => {
    appState.current = nextAppState;
    setAppStateVisible(appState.current);

    const notificationOpen = await messaging().getInitialNotification();
    if (notificationOpen) {
      const route = firebaseRouteNotification({
        data: {
          type: notificationOpen.data?.type as EFirebaseNotificationType,
          notificationId: notificationOpen.data?.notificationId as string,
          notificationOriginId: notificationOpen.data
            ?.notificationOriginId as string,
        },
      });
      if (route) {
        setNextPage(route);
      }
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await firebase.messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', _handleAppStateChange);
  }, []);

  const getToken = async () => {
    try {
      const firebaseToken = await messaging().getToken();
      if (firebaseToken) {
        setToken(firebaseToken);
        await StorageStore.setStorage('firebaseToken', firebaseToken);
        console.log(firebaseToken);
      } else {
        ToastError(-1, 'Failed. No token received');
      }
    } catch (error: any) {
      // Em desenvolvimento iOS, o APNS token pode não estar disponível
      if (error?.code === 'messaging/unknown' && error?.message?.includes('APNS token')) {
        console.warn('[Firebase] APNS token not available yet. This is normal in development.');
        // Não mostrar erro para o usuário em desenvolvimento
      } else {
        console.error('[Firebase] Error getting token:', error);
        ToastError(-1, 'Failed to get Firebase token');
      }
    }
  };

  const registerAppWithFCM = async () => {
    if (Platform.OS === 'ios') {
      messaging()
        .registerDeviceForRemoteMessages()
        .then(register => {
          getToken();
        });
      await messaging().setAutoInitEnabled(true);
    } else {
      getToken();
    }
  };

  const checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    if (enabled === firebase.messaging.AuthorizationStatus.AUTHORIZED) {
      if (messaging().isDeviceRegisteredForRemoteMessages) {
        getToken();
      } else {
        await registerAppWithFCM();
      }
    } else {
      requestUserPermission();
    }
  };

  const returnToken = async (): Promise<string> => {
    const fbToken = await StorageStore.getStorage('firebaseToken');
    setToken(fbToken);
    return fbToken;
  };

  const saveTokenToDatabase = async (fbToken: string) => {
    setToken(fbToken);
    await StorageStore.setStorage('firebaseToken', fbToken);
  };

  const messageListener = async () => {
    messaging().onMessage(async message => {
      if (appStateVisible !== 'background') {
        Toast.show('Você possui uma nova analise', {
          duration: 3500,
        });
      }
    });
  };

  const backgroundMessageHandler = async () => {
    messaging().setBackgroundMessageHandler(async message => {
      if (appStateVisible === 'background') {
        console.log('Background listner = ', message);
      }
    });
  };

  const initialize = async () => {
    await checkPermission();
    backgroundMessageHandler();
    await messageListener();
    await returnToken();
  };

  useEffect(() => {
    async function init() {
      await initialize();
    }

    init();

    // escuta mudanças no token
    return firebase
      .app()
      .messaging()
      .onTokenRefresh(fbToken => {
        saveTokenToDatabase(fbToken);
      });
  });

  return (
    <Firebase.Provider value={{token, returnToken, nextPage, initialize}}>
      {children}
    </Firebase.Provider>
  );
};

function useFirebase() {
  const context = useContext(Firebase);

  if (!context) {
    throw new Error('useAuth must be used within an FirebaseProvider');
  }

  return context;
}

export {FirebaseProvider, useFirebase};
