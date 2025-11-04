// ⚠️ IMPORTANTE: react-native-gesture-handler DEVE ser importado PRIMEIRO
import 'react-native-gesture-handler';

import { firebase } from '@react-native-firebase/messaging';
import codePush, { CodePushOptions } from '@revopush/react-native-code-push';
import { translate } from '@translate';
import React from 'react';
import { LogBox } from 'react-native';
import Routes from './routes';

const App = () => <Routes />;

const codePushOptions: CodePushOptions = {
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.IMMEDIATE,
  mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
  updateDialog: {
    appendReleaseDescription: true,
    title: translate('newVersion'),
    optionalUpdateMessage: translate('newVersionDescription'),
    optionalIgnoreButtonLabel: 'Ignorar',
    optionalInstallButtonLabel: 'Instalar',
  },
};

// Firebase Messaging: Configuração com tratamento de erros
// Em desenvolvimento iOS, o APNS token pode não estar disponível
try {
  firebase.messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });
} catch (error) {
  console.warn('[Firebase] Background message handler setup failed:', error);
  // Em desenvolvimento, isso é normal se o APNS não estiver configurado
}

LogBox.ignoreLogs([
  'Node of type rule not supported as an inline style',
  'Looks like you',
]); // Ignore log notification by message

// 🧪 TESTE: Desabilitar CodePush temporariamente para verificar se está causando o crash do Reanimated
const toExport = __DEV__ ? App : codePush(codePushOptions)(App);

export default toExport;
