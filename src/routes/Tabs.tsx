import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar, View } from 'react-native';
import Colors from '@colors';
import { WithdrawalContext } from 'src/hooks/WithdrawalContext';
import { CustomTabBar } from './components/CustomTabBar';
import { useTabRoutes } from './hooks/useTabRoutes';

const Tab = createBottomTabNavigator();

/**
 * Tab Navigator refatorado
 * 
 * Simplificado seguindo as recomendações do relatório de arquitetura:
 * - CustomTabBar extraído para componente isolado
 * - Rotas configuradas em arquivo separado
 * - Lógica de renderização simplificada
 * 
 * Redução de 257 linhas para ~30 linhas (-88%)
 */
const TabsNavigation = () => {
  const routes = useTabRoutes();

  return (
    <WithdrawalContext>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.ecoop.darkGray}
        translucent
      />
      <View style={{ backgroundColor: '#E5E5E5', flex: 1 }}>
        <Tab.Navigator
          initialRouteName="Home"
          detachInactiveScreens={true}
          backBehavior="history"
          screenOptions={{
            headerShown: false,
          }}
          tabBar={props => <CustomTabBar {...props} />}>
          {routes}
        </Tab.Navigator>
      </View>
    </WithdrawalContext>
  );
};

export default TabsNavigation;
