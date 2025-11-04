import Colors from '@colors';
import Header from '@components/Header';
import Loading from '@components/Loading';
import ProgressBar from '@components/ProgressBar';
import TabContractAdvance from '@components/TabContractAdvance';
import TabContractNF from '@components/TabContractNF';
import TabContractNFObs from '@components/TabContractNFObs';
import TabContractPayment from '@components/TabContractPayment';
import { Flex, Row, TextBold, TextRegular } from '@globalStyle';
import { useRoute } from '@react-navigation/core';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { normalize } from '@size';
import convertAfterDot from '@utils/convertAfterDot';
import convertCurrency from '@utils/convertCurrency';
import convertData from '@utils/convertData';
import React, { useCallback, useEffect, useState } from 'react';
import { IContract } from 'src/dtos/contract';
import api from 'src/services/api';
import { Container, ContainerContractPosition, SectionGeneral } from './styles';

interface IRouteProps {
  params?: {
    id?: string;
  };
}

const Tab = createMaterialTopTabNavigator();

const ContractDetails = () => {
  const route: IRouteProps = useRoute();

  const [dataGeneral, setDataGeneral] = useState<IContract>({} as IContract);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [id, setId] = useState('');

  const handleLoadGeneral = useCallback(async (_id: string) => {
    try {
      const response = await api.get(`salescontract/get/${_id}`);
      setDataGeneral(response.data);
      setLoadingProgress(false);
    } catch (e: any) {
      console.log(e.message);
      setLoadingProgress(false);
    }
  }, []);

  useEffect(() => {
    if (route && route.params && route.params.id) {
      handleLoadGeneral(route.params.id);
      setId(route.params.id);
    }

    return () => {
      setDataGeneral({} as IContract);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  return (
    <>
      <Header showBackButton />
      <Container>
        <SectionGeneral>
          <ContainerContractPosition>
            {loadingProgress ? (
              <Loading />
            ) : (
              <>
                <TextBold size={13} marginBottom={4}>
                  Posição do contrato
                </TextBold>
                <ProgressBar
                  value={dataGeneral.percentDelivered || 0}
                  isCard={false}
                />
                <Row justifyContent="space-between">
                  <TextRegular size={13} marginTop={4}>
                    {dataGeneral.producerName}
                  </TextRegular>
                </Row>
                <Row justifyContent="space-between">
                  <TextRegular
                    size={13}
                    marginTop={
                      4
                    }>{`Contrato ${dataGeneral.contract} - ${dataGeneral.crop}`}</TextRegular>
                  <TextRegular
                    size={13}
                    marginTop={
                      4
                    }>{`${dataGeneral.modalType} - ${dataGeneral.culture}`}</TextRegular>
                </Row>
                <Row marginTop={4}>
                  <TextRegular size={13} numberOfLines={1}>
                    {dataGeneral.buyer}
                  </TextRegular>
                </Row>
                <Row justifyContent="space-between" marginTop={4}>
                  <TextRegular size={13}>{`Contratado: ${convertAfterDot(
                    dataGeneral.quantity,
                    2
                  )} ${dataGeneral.measurementUnit}`}</TextRegular>
                  <TextRegular size={13}>{`Entregue: ${convertAfterDot(
                    dataGeneral.quantityDelivered,
                    2
                  )} ${dataGeneral.measurementUnit}`}</TextRegular>
                </Row>
                <Row justifyContent="space-between" marginTop={4}>
                  <TextRegular size={13}>{`Preço: ${convertCurrency(
                    dataGeneral.contractPrice,
                    dataGeneral.currency
                  )}`}</TextRegular>
                  <TextRegular size={13}>{`Valor Total: ${convertCurrency(
                    dataGeneral.amount,
                    dataGeneral.currency
                  )}`}</TextRegular>
                </Row>
                <Row justifyContent="space-between" marginTop={4}>
                  <TextRegular size={13}>{`Dt. Emissão: ${
                    dataGeneral.issueDate
                      ? convertData(
                          new Date(dataGeneral.issueDate).getTime(),
                          '/',
                          false,
                          'full'
                        )
                      : ` `
                  }`}</TextRegular>
                  <TextRegular size={13}>
                    {dataGeneral.expirationDate
                      ? `Dt. Vencimento: ${convertData(
                          new Date(dataGeneral.expirationDate).getTime(),
                          '/',
                          false,
                          'full'
                        )}`
                      : ` `}
                  </TextRegular>
                </Row>
                <Row justifyContent="space-between" marginTop={4}>
                  <TextRegular size={13}>{`Dt. Pagamento: ${
                    dataGeneral.paymentDate
                      ? convertData(
                          new Date(dataGeneral.paymentDate).getTime(),
                          '/',
                          false,
                          'full'
                        )
                      : ` `
                  }`}</TextRegular>
                </Row>
              </>
            )}
          </ContainerContractPosition>
        </SectionGeneral>
        <Flex>
          <NavigationContainer independent>
            <Tab.Navigator
              tabBarOptions={{
                style: {
                  backgroundColor: Colors.ecoop.darkGray
                },
                labelStyle: {
                  fontWeight: 'bold',
                  width: '100%',
                  textAlign: 'center',
                  margin: 0,
                  padding: 0,
                  fontSize: normalize(12)
                },
                activeTintColor: '#FFF',
                inactiveTintColor: '#ADADAD',
                indicatorStyle: {
                  marginBottom: 4,
                  backgroundColor: '#FFF'
                },
                scrollEnabled: true
              }}
              initialRouteName="TabContractNF">
              <Tab.Screen
                name="Notas Fiscais"
                component={() => <TabContractNF id={id} />}
              />
              <Tab.Screen
                name="Pagamentos"
                component={() => <TabContractPayment id={id} />}
              />
              <Tab.Screen
                name="Adiantamentos"
                component={() => <TabContractAdvance id={id} />}
              />
              <Tab.Screen
                name="Observações"
                component={() => <TabContractNFObs id={id} />}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </Flex>
      </Container>
    </>
  );
};

export default ContractDetails;
