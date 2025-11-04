import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import DrawerContent from './components/DrawerContent';
import { useDrawerRoutes } from './hooks/useDrawerRoutes';

const Drawer = createDrawerNavigator();

/**
 * Drawer Navigator refatorado
 *
 * Simplificado seguindo as recomendações do relatório de arquitetura:
 * - Rotas configuradas em arquivo separado
 * - Lógica de renderização simplificada
 * - Mantém consistência com Stack e Tabs
 */
const DrawerNavigation = () => {
  const routes = useDrawerRoutes();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      detachInactiveScreens
      initialRouteName="Initial"
      drawerContent={DrawerContent}
    >
      {routes}
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
