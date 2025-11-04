import { Flex, Row, TextBold, TextRegular } from '@globalStyle';
import { useRoute } from '@react-navigation/core';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import convertAfterDot from '@utils/convertAfterDot';
import convertCurrency from '@utils/convertCurrency';
import convertData from '@utils/convertData';
import React, { useCallback, useEffect, useState } from 'react';
import { getMaterialTopTabScreenOptions } from 'src/routes/config/materialTopTabOptions';
import api from 'src/services/api';
import { Header, Loading, ProgressBar } from 'src/shared';
import {
  TabContractAdvance,
  TabContractNF,
  TabContractNFObs,
  TabContractPayment,
} from '../../';
import { IContract } from '../../types/contract';
import { Container, ContainerContractPosition, SectionGeneral } from './styles';

interface IRouteProps {
  params?: {
    id?: string;
  };
}

const Tab = createMaterialTopTabNavigator();

// Componentes nomeados para evitar warnings de componentes inline
const TabContractNFWrapper = ({ route }: any) => {
  const { id } = route.params || {};
  return <TabContractNF id={id} />;
};

const TabContractPaymentWrapper = ({ route }: any) => {
  const { id } = route.params || {};
  return <TabContractPayment id={id} />;
};

const TabContractAdvanceWrapper = ({ route }: any) => {
  const { id } = route.params || {};
  return <TabContractAdvance id={id} />;
};

const TabContractNFObsWrapper = ({ route }: any) => {
  const { id } = route.params || {};
  return <TabContractNFObs id={id} />;
};

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
                    marginTop={4}
                  >{`Contrato ${dataGeneral.contract} - ${dataGeneral.crop}`}</TextRegular>
                  <TextRegular
                    size={13}
                    marginTop={4}
                  >{`${dataGeneral.modalType} - ${dataGeneral.culture}`}</TextRegular>
                </Row>
                <Row marginTop={4}>
                  <TextRegular size={13} numberOfLines={1}>
                    {dataGeneral.buyer}
                  </TextRegular>
                </Row>
                <Row justifyContent="space-between" marginTop={4}>
                  <TextRegular size={13} skipTranslation>
                    <TextRegular translationKey="contracted" size={13} />:{' '}
                    {convertAfterDot(dataGeneral.quantity, 2)}{' '}
                    {dataGeneral.measurementUnit}
                  </TextRegular>
                  <TextRegular size={13} skipTranslation>
                    <TextRegular translationKey="delivered" size={13} />:{' '}
                    {convertAfterDot(dataGeneral.quantityDelivered, 2)}{' '}
                    {dataGeneral.measurementUnit}
                  </TextRegular>
                </Row>
                <Row justifyContent="space-between" marginTop={4}>
                  <TextRegular size={13} skipTranslation>
                    <TextRegular translationKey="price" size={13} />:{' '}
                    {convertCurrency(
                      dataGeneral.contractPrice,
                      dataGeneral.currency,
                    )}
                  </TextRegular>
                  <TextRegular size={13} skipTranslation>
                    <TextRegular translationKey="totalValue" size={13} />:{' '}
                    {convertCurrency(dataGeneral.amount, dataGeneral.currency)}
                  </TextRegular>
                </Row>
                <Row justifyContent="space-between" marginTop={4}>
                  <TextRegular size={13}>{`Dt. Emissão: ${
                    dataGeneral.issueDate
                      ? convertData(
                          new Date(dataGeneral.issueDate).getTime(),
                          '/',
                          false,
                          'full',
                        )
                      : ` `
                  }`}</TextRegular>
                  <TextRegular size={13}>
                    {dataGeneral.expirationDate
                      ? `Dt. Vencimento: ${convertData(
                          new Date(dataGeneral.expirationDate).getTime(),
                          '/',
                          false,
                          'full',
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
                          'full',
                        )
                      : ` `
                  }`}</TextRegular>
                </Row>
              </>
            )}
          </ContainerContractPosition>
        </SectionGeneral>
        <Flex>
          <Tab.Navigator
            screenOptions={getMaterialTopTabScreenOptions({
              scrollEnabled: true,
            })}
            initialRouteName="Notas Fiscais"
          >
            <Tab.Screen
              name="Notas Fiscais"
              component={TabContractNFWrapper}
              initialParams={{ id }}
            />
            <Tab.Screen
              name="Pagamentos"
              component={TabContractPaymentWrapper}
              initialParams={{ id }}
            />
            <Tab.Screen
              name="Adiantamentos"
              component={TabContractAdvanceWrapper}
              initialParams={{ id }}
            />
            <Tab.Screen
              name="Observações"
              component={TabContractNFObsWrapper}
              initialParams={{ id }}
            />
          </Tab.Navigator>
        </Flex>
      </Container>
    </>
  );
};

export default ContractDetails;
