import Colors from '@colors';
import {Flex} from '@globalStyle';
import AppProvider from '@provider';
import {NavigationContainer} from '@react-navigation/native';
import {PropsWithChildren, useEffect} from 'react';
import {PermissionsAndroid, Platform, SafeAreaView} from 'react-native';
import Toast from 'react-native-toast-message';
import {navigationRef} from 'src/services/navigation';
import DrawerNavigation from './Drawer';

const Routes = ({children}: PropsWithChildren) => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
    }
  }, []);
  return (
    <>
      <AppProvider>
        <NavigationContainer independent ref={navigationRef}>
          <Flex flex={1}>
            <SafeAreaView style={{backgroundColor: Colors.ecoop.darkGray}} />
            <DrawerNavigation />
          </Flex>
        </NavigationContainer>
        <Toast />
      </AppProvider>
    </>
  );
};

export default Routes;
