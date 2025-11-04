import Colors from '@colors';
import { Version } from '@components/Version';
import { EFirebaseNotificationType } from '@enum/EFirebaseNotificationType';
import {
  DrawerContentComponentProps,
  DrawerItem,
} from '@react-navigation/drawer';
import { useTranslation } from '@translate/hooks';
import React from 'react';
import { Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import { useServer } from 'src/hooks/ServerContext';
import { useAuth } from 'src/hooks/UserContext';
import {
  Container,
  DrawerContentView,
  DrawerContentViewBottom,
} from './styles';

const DrawerContent = (props: DrawerContentComponentProps) => {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const { clearServers } = useServer();

  return (
    <Container>
      <DrawerContentView>
        <DrawerItem
          icon={({ size }) => (
            <Icon name="file-text" color={Colors.white} size={size} />
          )}
          label="Resultados de pesquisa"
          onPress={() => {
            // Navegar através da hierarquia: Drawer → Stack → Tabs → Screen
            // 'App' é o nome do Tab Navigator no Stack Navigator
            props.navigation.navigate('App', {
              screen: 'PageNotificationAssayResult',
              params: {
                key: `Notificações-${
                  EFirebaseNotificationType.ASSAYRESULT
                }-${Date.now()}`,
                type: EFirebaseNotificationType.ASSAYRESULT,
              },
            });
          }}
          labelStyle={{ color: Colors.white }}
        />
        <DrawerItem
          icon={({ size }) => (
            <Icon name="file-text" color={Colors.white} size={size} />
          )}
          label="Solicitação de retirada"
          onPress={() => {
            // Navegar através da hierarquia: Drawer → Stack → Tabs → Screen
            // 'App' é o nome do Tab Navigator no Stack Navigator
            props.navigation.navigate('App', {
              screen: 'PageNotificationWithdrawal',
              params: {
                key: `Notificações-${
                  EFirebaseNotificationType.WITHDRAWALSTATUS
                }-${Date.now()}`,
                type: EFirebaseNotificationType.WITHDRAWALSTATUS,
              },
            });
          }}
          labelStyle={{ color: Colors.white }}
        />
        <DrawerItem
          icon={({ size }) => (
            <Icon name="file-text" color={Colors.white} size={size} />
          )}
          label="Avisos"
          onPress={() => {
            // Navegar através da hierarquia: Drawer → Stack → Tabs → Screen
            // 'App' é o nome do Tab Navigator no Stack Navigator
            props.navigation.navigate('App', {
              screen: 'PageNotificationNotification',
              params: {
                key: `Notificações-${
                  EFirebaseNotificationType.NOTIFICATION
                }-${Date.now()}`,
                type: EFirebaseNotificationType.NOTIFICATION,
              },
            });
          }}
          labelStyle={{ color: Colors.white }}
        />
        <DrawerItem
          icon={({ size }) => (
            <Icon name="file-text" color={Colors.white} size={size} />
          )}
          label="Notícias"
          onPress={() => {
            // Navegar através da hierarquia: Drawer → Stack → Tabs → Screen
            // 'App' é o nome do Tab Navigator no Stack Navigator
            props.navigation.navigate('App', {
              screen: 'PageNotificationNews',
              params: {
                key: `Notificações-${
                  EFirebaseNotificationType.NEWS
                }-${Date.now()}`,
                type: EFirebaseNotificationType.NEWS,
              },
            });
          }}
          labelStyle={{ color: Colors.white }}
        />
        <DrawerItem
          icon={({ size }) => (
            <Icon name="user" color={Colors.white} size={size} />
          )}
          label={`${t('ChangePassword')}`}
          onPress={() => {
            props.navigation.navigate('ChangePassword', {
              firstLogin: false,
            });
          }}
          labelStyle={{ color: Colors.white }}
        />
      </DrawerContentView>
      <DrawerContentViewBottom>
        <DrawerItem
          icon={({ size }) => (
            <IconMaterial name="logout" color={Colors.white} size={size} />
          )}
          label={`${t('logout')}`}
          onPress={() => {
            Alert.alert(
              t('logout'),
              t('confirmLogout'),
              [
                {
                  text: t('cancel'),
                  onPress: () => null,
                  style: 'cancel',
                },
                {
                  text: t('logout'),
                  onPress: async () => {
                    await signOut();
                    await clearServers();
                    props.navigation.reset({
                      index: 0,
                      routes: [{ name: 'LoginCPF' }],
                    });
                  },
                  style: 'default',
                },
              ],
              { cancelable: false },
            );
          }}
          labelStyle={{ color: Colors.white }}
        />
      </DrawerContentViewBottom>
      <Version />
    </Container>
  );
};

export default DrawerContent;
