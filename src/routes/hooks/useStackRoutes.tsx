import React, { useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { STACK_ROUTES } from '../config/stackRoutes';
import { StackScreenConfig } from '../types';

const Stack = createStackNavigator();

/**
 * Hook para gerar as rotas do Stack Navigator baseado na configuração
 * 
 * Converte a configuração declarativa em componentes Stack.Screen
 * Retorna um array de elementos Stack.Screen para serem renderizados dentro do Stack.Navigator
 */
export const useStackRoutes = () => {
  return useMemo(() => {
    return STACK_ROUTES.map((route: StackScreenConfig) => {
      const { name, component, initialParams, options } = route;

      return (
        <Stack.Screen
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

