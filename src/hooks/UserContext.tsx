import Base64 from '@utils/Base64';
import { AxiosHeaderValue, HeadersDefaults } from 'axios';
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import api from 'src/services/api';
import StorageService from 'src/services/storage';
import { Loading } from 'src/shared';
import { useFirebase } from './FirebaseContext';

export interface SignInCredentials {
  login?: string;
  password?: string;
  token?: string;
}

export interface User {
  user: {
    id: string;
    login: string;
    name: string;
    newPassword: boolean;
  };
  producer: {
    id: string;
    name: string;
  };
  producers: [
    {
      id: string;
      name: string;
    },
  ];
  permissions: Array<string>;
  token: string | undefined;
}

interface UserContextData {
  user: User | undefined;
  loading: boolean;
  credentials: SignInCredentials | undefined;
  cooperado: string | undefined;
  signIn(credentials: SignInCredentials, idProducer?: string): Promise<User>;
  signOut(): Promise<void>;
  setProducer: (id: string) => Promise<void>;
  changePassword(newPass: string): Promise<void>;
  removerProducer(): Promise<void>;
  refreshSession(): Promise<void>;
}

const User = createContext<UserContextData>({} as UserContextData);

const AuthContext = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User>();
  const [cooperado, setCooperado] = useState<string>();
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState<SignInCredentials>();

  const { token } = useFirebase();

  const refreshSession = async () => {
    const r = await api.get('session/refresh');
    api.defaults.headers.Authorization = `Bearer ${r.data.token}`;
    api.defaults.headers.messagingToken = token;
    setUser(r.data);
    await StorageService.setStorage('user', r.data);
  };

  useEffect(() => {
    setLoading(true);
    StorageService.multiGet(['user', 'credentials', 'producer'])
      .then(([_user, _credentials, _producer]) => {
        if (_user[1] !== null) {
          const u = JSON.parse(_user[1]);
          if (u && u.token && u.producers[0].id) {
            setUser(u);
            api.defaults.headers.Authorization = `Bearer ${u.token}`;
            api.defaults.headers.messagingToken = token;
          }
        }

        if (_credentials[1] !== null) {
          const c = JSON.parse(_credentials[1]);
          setCredentials(c);
        }

        if (_producer[1] !== null) {
          const u = JSON.parse(_producer[1]);
          setCooperado(u);
          api.defaults.headers.producer = u;
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (
    _credentials: SignInCredentials,
    idProducer?: string,
  ): Promise<User> => {
    try {
      api.defaults.headers.Authorization = `Basic ${Base64.encode(
        `${_credentials.login}:${_credentials.password}`,
      )}`;
      api.defaults.headers.messagingToken = token;

      if (idProducer) {
        api.defaults.headers.producer = idProducer;
      }

      const response = await api.post('session/authentication');

      if (response.data.token === null || response.data.token === undefined) {
        setUser(response.data);
        setCredentials(_credentials);
        await StorageService.setStorage('credentials', _credentials);
        await StorageService.setStorage('user', response.data);
        return response.data;
      }

      api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
      setCredentials(_credentials);
      setUser(response.data);
      await StorageService.setStorage('credentials', _credentials);
      await StorageService.setStorage('user', response.data);
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  const signOut = async () => {
    await StorageService.removeStorage('producer');
    await StorageService.removeStorage('credentials');
    await StorageService.removeStorage('user');
    await StorageService.removeStorage('credentials');
    await StorageService.removeStorage('producer');
    api.defaults.headers = {} as HeadersDefaults & {
      [key: string]: AxiosHeaderValue;
    };
    setCredentials(undefined);
    setCooperado(undefined);
    setUser(undefined);
    setCredentials(undefined);
    setCooperado(undefined);
  };

  const changePassword = async (newPass: string) => {
    try {
      await api.put('session/password', {
        password: newPass,
      });
      refreshSession();
    } catch (e) {
      console.log(e);
    }
  };
  const setProducer = async (id: string) => {
    setCooperado(id);
    await StorageService.setStorage('producer', id);
  };

  const removerProducer = async () => {
    setCooperado(undefined);
    api.defaults.headers = {} as HeadersDefaults & {
      [key: string]: AxiosHeaderValue;
    };
    const _usr: User = { ...user } as User;
    _usr.token = undefined;
    setUser(_usr);
    await StorageService.removeStorage('producer');
  };

  return (
    <User.Provider
      value={{
        user,
        loading,
        credentials,
        signIn,
        signOut,
        setProducer,
        cooperado,
        removerProducer,
        changePassword,
        refreshSession,
      }}
    >
      {loading ? <Loading /> : children}
    </User.Provider>
  );
};

function useAuth(): UserContextData {
  const context = useContext(User);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthContext, useAuth };
