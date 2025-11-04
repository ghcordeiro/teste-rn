import React, { PropsWithChildren } from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator
} from '@react-navigation/stack';
import { Platform, StatusBar } from 'react-native';
import SelectProducer from 'src/pages/SelectProducer';
import ChangePassword from 'src/pages/ChangePassword';
import PDF from 'src/pages/PDF';
import Colors from '@colors';
import Dashboard from 'src/pages/Dashboard';
import LoginPassword from '../pages/LoginPassword';
import Splash from '../pages/Splash';
import TabsNavigation from './Tabs';
import LoginCPF from 'src/pages/LoginCPF';

const Stack = createStackNavigator();

const StackNavigation = ({ children }: PropsWithChildren) => (
  <>
    <StatusBar
      barStyle="light-content"
      backgroundColor={Colors.ecoop.darkGray}
    />
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        gestureEnabled: true,
        cardStyleInterpolator:
          Platform.OS === 'android'
            ? CardStyleInterpolators.forFadeFromBottomAndroid
            : CardStyleInterpolators.forHorizontalIOS
      }}
      >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="LoginCPF" component={LoginCPF} />
      <Stack.Screen name="LoginPassword" component={LoginPassword} />
      <Stack.Screen name="SelectProducer" component={SelectProducer} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="App" component={TabsNavigation} />
      <Stack.Screen name="PDF" component={PDF} />
    </Stack.Navigator>
  </>
);

export default StackNavigation;
