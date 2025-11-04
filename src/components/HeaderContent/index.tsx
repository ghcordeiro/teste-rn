import React from 'react';

import Colors from '@colors';
import CardHeader from '@components/CardHeader';
import { Flex, Row, TextBold, TextRegular } from '@globalStyle';
import { CommonActions, useNavigation } from '@react-navigation/core';
import { height, normalize, normalizeHeight } from '@size';
import { translate } from '@translate';
import convertCurrency from '@utils/convertCurrency';
import { Alert, ScrollView, View } from 'react-native';
import { useAuth } from 'src/hooks/UserContext';
import { ButtonChangeUser, Container, InternalContainer } from './styles';

interface IHeaderContentProps {
  balance: any;
}

const HeaderContent = ({balance}: IHeaderContentProps) => {
  const mt = normalizeHeight(8);
  const auth = useAuth();
  const navigation = useNavigation();

  const changeUser = async () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{name: 'Dashboard'}],
      }),
    );
  };

  const handleChangeUser = () => {
    Alert.alert(translate('changeUser'), undefined, [
      {
        text: translate('cancel'),
      },
      {
        text: translate('confirm'),
        onPress: changeUser,
      },
    ]);
  };

  return (
    <Container mt={mt}>
      <InternalContainer>
        <Flex flex={5}>
          {auth &&
          auth.user?.permissions &&
          auth.user?.permissions.length > 0 &&
          auth.user?.permissions.findIndex(
            d => d === 'APP:FINANCIAL-STATEMENT',
          ) === -1 ? (
            <Flex flex={1} marginTop={normalize(15)} justifyContent="center">
              <ButtonChangeUser onPress={handleChangeUser}>
                <Row>
                  <TextRegular
                    size={18}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    textDecoration="underline"
                    color={Colors.white}>
                    {(auth && auth.user?.producer && auth.user.producer.name) ||
                      ''}
                  </TextRegular>
                </Row>
              </ButtonChangeUser>
            </Flex>
          ) : (
            <>
              <ButtonChangeUser onPress={handleChangeUser}>
                <Row>
                  <TextRegular
                    size={18}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    textDecoration="underline"
                    color={Colors.white}>
                    {(auth && auth.user?.producer && auth.user.producer.name) ||
                      ''}
                  </TextRegular>
                </Row>
              </ButtonChangeUser>
              <Row marginTop={normalize(10)}>
                <TextRegular color={Colors.white}>
                  {translate('accountBalance')}
                </TextRegular>
              </Row>
              <Row>
                <TextBold
                  size={28}
                  color={
                    balance.balance
                      ? balance.balance >= 0
                        ? Colors.success.success_1
                        : Colors.danger.danger_1
                      : Colors.success.success_1
                  }>
                  {balance.balance
                    ? `${convertCurrency(balance.balance, balance.currency)}`
                    : convertCurrency(0)}
                </TextBold>
              </Row>
            </>
          )}
        </Flex>
        <Flex flex={4} marginTop={mt * (height / 320)}>
          <Row
            alignItems="flex-end"
            justifyContent="space-between"
            marginTop={mt * (height / 320)}>
            <ScrollView
              style={{
                marginTop: mt * (height / 320),
                zIndex: 1,
                height: '100%',
              }}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                alignItems: 'center',
              }}>
              {auth.user?.permissions.find(f => f === 'APP:FINANCIAL-CASHFLOW') && (
                <View style={{flex: 1, alignItems: 'center', marginRight: 8}}>
                  <CardHeader title="Fluxo Caixa" route="CashFlow" />
                </View>
              )}
              {auth.user?.permissions.find(f => f === 'APP:STOCK') ? (
                <View style={{flex: 1, alignItems: 'center', marginRight: 8}}>
                  <CardHeader title="Estoque" route="Stock" />
                </View>
              ) : (
                <></>
              )}
              {auth.user?.permissions.find(f => f === 'APP:CONTRACT') ? (
                <View style={{flex: 1, alignItems: 'center', marginRight: 8}}>
                  <CardHeader title="Contratos" route="Contracts" />
                </View>
              ) : (
                <></>
              )}
              {auth.user?.permissions.find(f => f === 'APP:FINANCIAL') ? (
                <View style={{flex: 1, alignItems: 'center', marginRight: 8}}>
                  <CardHeader title="Financeiro" route="Financial" />
                </View>
              ) : (
                <></>
              )}
              {auth.user?.permissions.find(
                f => f === 'APP:SALESCONTRACTDELIVERY',
              ) ? (
                <View style={{flex: 1, alignItems: 'center', marginRight: 8}}>
                  <CardHeader title="Logistica" route="Logistics" />
                </View>
              ) : (
                <></>
              )}
            </ScrollView>
          </Row>
        </Flex>
      </InternalContainer>
    </Container>
  );
};

export default HeaderContent;
