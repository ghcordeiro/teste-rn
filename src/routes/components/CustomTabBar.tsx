import React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { View, TouchableOpacity } from 'react-native';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import Colors from '@colors';
import { normalize, normalizeHeight } from '@size';
import { getBottomSpace } from '@utils/iPhoneXHelper';

/**
 * Configuração das tabs que devem ser excluídas do bottom tab bar
 */
export const HIDDEN_TABS = [
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
] as const;

/**
 * Custom TabBar component extraído do Tabs.tsx
 * 
 * Renderiza a barra de navegação inferior customizada com ícones
 * e tratamento especial para Home e Configuration
 */
export const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
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
        // Pula rotas que estão na lista de exclusão
        if (HIDDEN_TABS.includes(route.name as any)) {
          return null;
        }

        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const handlePress = () => {
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

        const handleLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Renderização especial para Home (botão circular destacado)
        if (route.name === 'Home') {
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={handlePress}
              onLongPress={handleLongPress}
              style={{ flex: 1, alignItems: 'center' }}>
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
                  color={Colors.dark}
                />
              </View>
            </TouchableOpacity>
          );
        }

        // Renderização padrão para outras tabs
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={handlePress}
            onLongPress={handleLongPress}
            style={{ flex: 1, alignItems: 'center' }}>
            <FontAwesome
              name={route.name === 'Configuration' ? 'navicon' : 'bell'}
              size={normalize(isFocused ? 22 : 20)}
              color={isFocused ? '#FFF' : '#cccccc'}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

