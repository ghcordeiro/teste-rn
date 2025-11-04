import React, { useMemo } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DRAWER_ROUTES } from '../config/drawerRoutes';
import { DrawerScreenConfig } from '../types';

const Drawer = createDrawerNavigator();

/**
 * Hook para gerar as rotas do Drawer Navigator baseado na configuração
 *
 * Converte a configuração declarativa em componentes Drawer.Screen
 * Retorna um array de elementos Drawer.Screen para serem renderizados dentro do Drawer.Navigator
 */
export const useDrawerRoutes = () => {
  return useMemo(() => {
    return DRAWER_ROUTES.map((route: DrawerScreenConfig) => {
      const { name, component, initialParams, options } = route;

      return (
        <Drawer.Screen
          key={name}
          name={name}
          component={component}
          initialParams={initialParams}
          options={() => options || {}}
        />
      );
    });
  }, []) as React.ReactElement[];
};

