import React, { useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TAB_ROUTES } from '../config/tabRoutes';
import { TabScreenConfig } from '../types';

const Tab = createBottomTabNavigator();

/**
 * Hook para gerar as rotas do Tab Navigator baseado na configuração
 * 
 * Converte a configuração declarativa em componentes Tab.Screen
 * Retorna um array de elementos Tab.Screen para serem renderizados dentro do Tab.Navigator
 */
export const useTabRoutes = () => {
  return useMemo(() => {
    return TAB_ROUTES.map((route: TabScreenConfig) => {
      const { name, component, initialParams, options } = route;

      return (
        <Tab.Screen
          key={name}
          name={name}
          component={component}
          initialParams={initialParams}
          options={
            typeof options === 'function' ? options : () => options || {}
          }
        />
      );
    });
  }, []) as React.ReactElement[];
};

