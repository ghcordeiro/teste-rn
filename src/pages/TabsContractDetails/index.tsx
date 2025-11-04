import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import TabContractNF from '@components/TabContractNF';
import TabContractPayment from '@components/TabContractPayment';
import TabContractAdvance from '@components/TabContractAdvance';

// import { Container } from './styles';

const Tab = createMaterialTopTabNavigator();

interface ITabsContractDetails {
  id: string;
}

export const TabsContractDetails = ({ id }: ITabsContractDetails) => {
  const PageTabContractNF = () => {
    return <TabContractNF id={id} />;
  };

  const PageTabContractPayment = () => {
    return <TabContractPayment id={id} />;
  };

  const PageTabContractAdvance = () => {
    return <TabContractAdvance id={id} />;
  };

  return (
    <Tab.Navigator>
      <Tab.Screen name="TabContractNF" component={PageTabContractNF} />
      <Tab.Screen
        name="TabContractPayment"
        component={PageTabContractPayment}
      />
      <Tab.Screen
        name="TabContractAdvance"
        component={PageTabContractAdvance}
      />
    </Tab.Navigator>
  );
};
