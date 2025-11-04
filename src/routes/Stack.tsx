import Colors from '@colors';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { useStackRoutes } from './hooks/useStackRoutes';

const Stack = createStackNavigator();

/**
 * Stack Navigator refatorado
 *
 * Simplificado seguindo as recomendações do relatório de arquitetura:
 * - Rotas configuradas em arquivo separado
 * - Lógica de renderização simplificada
 *
 * Redução de 48 linhas para ~25 linhas (-48%)
 */
const StackNavigation = () => {
  const routes = useStackRoutes();

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.ecoop.darkGray}
      />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator:
            Platform.OS === 'android'
              ? CardStyleInterpolators.forFadeFromBottomAndroid
              : CardStyleInterpolators.forHorizontalIOS,
        }}
      >
        {routes}
      </Stack.Navigator>
    </>
  );
};

export default StackNavigation;
