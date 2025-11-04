import Colors from '@colors';
import DrawerContent from '@components/DrawerContent';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';

import StackNavigation from './Stack';

const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <>
      <Drawer.Navigator
        screenOptions={{
          headerShown: false
        }}
        detachInactiveScreens
        initialRouteName='Initial'
        //drawerContent={() => DrawerContent({ color: Colors.white })}
        drawerContent={DrawerContent}
      >
        <Drawer.Screen
          name="Initial"
          component={StackNavigation}
          options={{
            drawerLabelStyle: {
              color: Colors.white
            }
          }} />
      </Drawer.Navigator>
    </>
  );
};

export default DrawerNavigation;
