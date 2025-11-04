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
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { useServer } from 'src/hooks/ServerContext';
import { useAuth } from 'src/hooks/UserContext';
import { navigationRef } from 'src/services/navigation';
import {
  Container,
  DrawerContentView,
  DrawerContentViewBottom,
} from './styles';

/**
 * Configuração dos itens do menu do Drawer
 */
interface DrawerMenuItem {
  label: string;
  icon: string;
  iconLibrary?: 'FontAwesome';
  notificationType?: EFirebaseNotificationType;
  screen?: string;
  onPress?: () => void;
}

/**
 * Helper para navegar para telas de notificação através da hierarquia
 * Drawer → Stack (Initial) → Stack (App) → Tabs → Screen
 * 
 * Usa navigationRef global para acessar a hierarquia completa de navegação
 */
const navigateToNotificationScreen = (
  navigation: DrawerContentComponentProps['navigation'],
  screen: string,
  type: EFirebaseNotificationType,
) => {
  // Fecha o drawer primeiro
  navigation.closeDrawer();
  
  // Usa navigationRef para navegar através da hierarquia completa
  if (navigationRef.isReady()) {
    navigationRef.navigate('App' as never, {
      screen,
      params: {
        key: `Notificações-${type}-${Date.now()}`,
        type,
      },
    } as never);
  }
};

const DrawerContent = (props: DrawerContentComponentProps) => {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const { clearServers } = useServer();

  // Configuração dos itens do menu principal
  const menuItems: DrawerMenuItem[] = [
    {
      label: t('assayResults'),
      icon: 'file-text',
      screen: 'PageNotificationAssayResult',
      notificationType: EFirebaseNotificationType.ASSAYRESULT,
    },
    {
      label: t('withdrawalRequest'),
      icon: 'file-text',
      screen: 'PageNotificationWithdrawal',
      notificationType: EFirebaseNotificationType.WITHDRAWALSTATUS,
    },
    {
      label: t('notices'),
      icon: 'file-text',
      screen: 'PageNotificationNotification',
      notificationType: EFirebaseNotificationType.NOTIFICATION,
    },
    {
      label: t('news'),
      icon: 'file-text',
      screen: 'PageNotificationNews',
      notificationType: EFirebaseNotificationType.NEWS,
    },
    {
      label: t('ChangePassword'),
      icon: 'user',
      onPress: () => {
        props.navigation.navigate('ChangePassword', {
          firstLogin: false,
        });
      },
    },
  ];

  const handleLogout = async () => {
    await signOut();
    await clearServers();
    props.navigation.reset({
      index: 0,
      routes: [{ name: 'LoginCPF' }],
    });
  };

  const renderMenuItem = (item: DrawerMenuItem, index: number) => {
    const IconComponent = FontAwesome;

    const handlePress = () => {
      if (item.onPress) {
        item.onPress();
      } else if (item.screen && item.notificationType) {
        navigateToNotificationScreen(
          props.navigation,
          item.screen,
          item.notificationType,
        );
      }
    };

    return (
      <DrawerItem
        key={index}
        icon={({ size }) => (
          <IconComponent name={item.icon} color={Colors.white} size={size} />
        )}
        label={item.label.includes(' ') ? item.label : t(item.label)}
        onPress={handlePress}
        labelStyle={{ color: Colors.white }}
      />
    );
  };

  return (
    <Container>
      <DrawerContentView>
        {menuItems.map((item, index) => renderMenuItem(item, index))}
      </DrawerContentView>
      <DrawerContentViewBottom>
        <DrawerItem
          icon={({ size }) => (
            <FontAwesome name="sign-out" color={Colors.white} size={size} />
          )}
          label={t('logout')}
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
                  onPress: handleLogout,
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

