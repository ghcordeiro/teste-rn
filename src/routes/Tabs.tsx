import Colors from '@colors';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import { normalize, normalizeHeight } from '@size';
import { getBottomSpace } from '@utils/iPhoneXHelper';
import React from 'react';
import { StatusBar, TouchableOpacity, View } from 'react-native';
import 'react-native-gesture-handler';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { WithdrawalContext } from 'src/hooks/WithdrawalContext';
import CashFlow from 'src/pages/CashFlow';
import Logistics from 'src/pages/Logistics';
import LogisticsDetails from 'src/pages/LogisticsDetails';
import PageNotificationAssayResult from 'src/pages/PageNotificationAssayResult';
import PageNotificationNews from 'src/pages/PageNotificationNews';
import PageNotificationNotification from 'src/pages/PageNotificationNotification';
import PageNotificationWithdrawal from 'src/pages/PageNotificationWithdrawal';
import { WithdrawalCart } from 'src/pages/WithdrawalCart';
import Configuration from '../pages/Configuration';
import ContractDetails from '../pages/ContractDetails';
import Contracts from '../pages/Contracts';
import FinancialMoviment from '../pages/FinancialMoviment';
import FinancialStatement from '../pages/FinancialStatement';
import Home from '../pages/Home';
import Informativos from '../pages/Informativos';
import NewWithdrawal from '../pages/NewWithdrawal';
import Notificacoes from '../pages/Notificacoes';
import Stock from '../pages/Stock';
import { TrackWithdrawal } from '../pages/TrackWithdrawal/index';

const Tab = createBottomTabNavigator();

const TabsNavigation = () => {
  const excludeTabs = [
    'Contracts',
    'Logistics',
    'Stock',
    'FinancialStatement',
    'Financial',
    'ContractDetails',
    'LogisticsDetails',
    'Informativos',
    'NewWithdrawal',
    'TrackWithdrawal',
    'WithdrawalCart',
    'VideoPlayer',
    'PageNotificationNotification',
    'PageNotificationAssayResult',
    'PageNotificationNews',
    'PageNotificationWithdrawal',
    'CashFlow',
  ];

  const MyTabBar = ({state, descriptors, navigation}: BottomTabBarProps) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: Colors.dark,
          height: normalizeHeight(50) + getBottomSpace(),
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: getBottomSpace(),
        }}>
        {state.routes.map((route, index) => {
          if (excludeTabs.includes(route.name)) {
            return;
          }
          const {options} = descriptors[route.key];
          // const label =
          //   options.tabBarLabel !== undefined
          //     ? options.tabBarLabel
          //     : options.title !== undefined
          //     ? options.title
          //     : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            if (route.name === 'Configuration') {
              navigation.openDrawer();
            } else {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={String(new Date().getTime() + Math.random())}
              accessibilityRole="button"
              // accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{flex: 1, alignItems: 'center'}}>
              {route.name === 'Home' ? (
                <View
                  style={{
                    height: normalizeHeight(55),
                    width: normalizeHeight(55),
                    borderRadius: normalizeHeight(55),
                    marginBottom: 18,
                    elevation: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isFocused ? '#FaFaFa' : '#cccccc',
                  }}>
                  <FontAwesome
                    name="home"
                    size={normalize(isFocused ? 26 : 24)}
                    // size={isFocused ? 22 : 20}
                    color={Colors.dark}
                  />
                  {/* <TextBold size={14} color={Colors.dark}>
                    {translate(label)}
                  </TextBold> */}
                </View>
              ) : (
                <>
                  <FontAwesome
                    name={route.name === 'Configuration' ? 'navicon' : 'bell'}
                    size={normalize(isFocused ? 22 : 20)}
                    // size={normalize(isFocused ? 16 : 14)}
                    color={isFocused ? '#FFF' : '#cccccc'}
                  />
                  {/* <Text
                    style={{
                      color: isFocused ? '#FFF' : '#cccccc',
                      fontWeight: isFocused ? 'bold' : 'normal',
                      fontSize: normalize(14)
                    }}>
                    {translate(label)}
                  </Text> */}
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <>
      <WithdrawalContext>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.ecoop.darkGray}
          translucent
        />
        <View style={{backgroundColor: '#E5E5E5', flex: 1}}>
          <Tab.Navigator
            initialRouteName="Home"
            detachInactiveScreens={true}
            backBehavior="history"
            screenOptions={{
              headerShown: false,
            }}
            tabBar={props => <MyTabBar {...props} />}>
            <Tab.Screen name="Configuration" component={Configuration} />
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen
              name="Notificações"
              component={Notificacoes}
              initialParams={{
                type: null,
              }}
              options={({navigation}) => ({
                tabBarButton: () => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.reset({
                        index: 0,
                        routes: [
                          {
                            name: 'Notificações',
                            params: {key: `Notificações-${Date.now()}`},
                          },
                        ],
                      });
                    }}
                  />
                ),
              })}
            />
            {/* TODO: Rotas que não são exibidas no bottom
              OBS: Adicionar o campo name no array excludeTabs
            */}
            <Tab.Screen name="Informativos" component={Informativos} />
            <Tab.Screen name="Contracts" component={Contracts} />
            <Tab.Screen name="Logistics" component={Logistics} />
            <Tab.Screen name="CashFlow" component={CashFlow} />
            <Tab.Screen name="Stock" component={Stock} />
            <Tab.Screen name="Financial" component={FinancialMoviment} />
            <Tab.Screen
              name="FinancialStatement"
              component={FinancialStatement}
            />
            <Tab.Screen name="ContractDetails" component={ContractDetails} />
            <Tab.Screen name="LogisticsDetails" component={LogisticsDetails} />
            <Tab.Screen name="NewWithdrawal" component={NewWithdrawal} />
            <Tab.Screen name="TrackWithdrawal" component={TrackWithdrawal} />
            <Tab.Screen name="WithdrawalCart" component={WithdrawalCart} />
            <Tab.Screen
              name="PageNotificationAssayResult"
              options={{
                unmountOnBlur: true,
              }}
              component={PageNotificationAssayResult}
            />
            <Tab.Screen
              name="PageNotificationNews"
              options={{
                unmountOnBlur: true,
              }}
              component={PageNotificationNews}
            />
            <Tab.Screen
              name="PageNotificationNotification"
              options={{
                unmountOnBlur: true,
              }}
              component={PageNotificationNotification}
            />
            <Tab.Screen
              name="PageNotificationWithdrawal"
              options={{
                unmountOnBlur: true,
              }}
              component={PageNotificationWithdrawal}
            />
            {/* Rotas que não são exibidas no bottom */}
          </Tab.Navigator>
        </View>
      </WithdrawalContext>
    </>
  );
};

export default TabsNavigation;
