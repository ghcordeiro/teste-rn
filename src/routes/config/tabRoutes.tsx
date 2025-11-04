import React from 'react';
import { TouchableOpacity } from 'react-native';
import { TabScreenConfig } from '../types';
import Configuration from '../../pages/Configuration';
import { ContractDetails, Contracts } from 'src/features/contracts';
import { CashFlow, FinancialMoviment, FinancialStatement } from 'src/features/financial';
import { Logistics, LogisticsDetails } from 'src/features/logistics';
import { Notificacoes, PageNotificationAssayResult, PageNotificationNews, PageNotificationNotification, PageNotificationWithdrawal } from 'src/features/notifications';
import { NewWithdrawal, TrackWithdrawal, WithdrawalCart } from 'src/features/withdrawals';
import Home from '../../pages/Home';
import Informativos from '../../pages/Informativos';
import { Stock } from 'src/features/stock';

/**
 * Configuração centralizada de todas as rotas do Tab Navigator
 * 
 * Organiza as rotas de forma declarativa e facilita manutenção
 */
export const TAB_ROUTES: TabScreenConfig[] = [
  // Tabs visíveis no bottom bar
  {
    name: 'Configuration',
    component: Configuration,
  },
  {
    name: 'Home',
    component: Home,
  },
  {
    name: 'Notificações',
    component: Notificacoes,
    initialParams: {
      type: null,
    },
    options: ({ navigation }) => ({
      tabBarButton: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: 'Notificações',
                  params: { key: `Notificações-${Date.now()}` },
                },
              ],
            });
          }}
        />
      ),
    }),
  },
  // Rotas ocultas (não aparecem no bottom tab)
  // Estas rotas são acessíveis via navegação programática mas não têm ícone no bottom bar
  {
    name: 'Informativos',
    component: Informativos,
  },
  {
    name: 'Contracts',
    component: Contracts,
  },
  {
    name: 'Logistics',
    component: Logistics,
  },
  {
    name: 'CashFlow',
    component: CashFlow,
  },
  {
    name: 'Stock',
    component: Stock,
  },
  {
    name: 'Financial',
    component: FinancialMoviment,
  },
  {
    name: 'FinancialStatement',
    component: FinancialStatement,
  },
  {
    name: 'ContractDetails',
    component: ContractDetails,
  },
  {
    name: 'LogisticsDetails',
    component: LogisticsDetails,
  },
  {
    name: 'NewWithdrawal',
    component: NewWithdrawal,
  },
  {
    name: 'TrackWithdrawal',
    component: TrackWithdrawal,
  },
  {
    name: 'WithdrawalCart',
    component: WithdrawalCart,
  },
  // Rotas de notificação com unmountOnBlur para melhor performance
  {
    name: 'PageNotificationAssayResult',
    component: PageNotificationAssayResult,
    options: {
      unmountOnBlur: true,
    },
  },
  {
    name: 'PageNotificationNews',
    component: PageNotificationNews,
    options: {
      unmountOnBlur: true,
    },
  },
  {
    name: 'PageNotificationNotification',
    component: PageNotificationNotification,
    options: {
      unmountOnBlur: true,
    },
  },
  {
    name: 'PageNotificationWithdrawal',
    component: PageNotificationWithdrawal,
    options: {
      unmountOnBlur: true,
    },
  },
];

