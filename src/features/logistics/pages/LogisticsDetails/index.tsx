import { Flex, Row, TextBold, TextRegular } from '@globalStyle';
import { useRoute } from '@react-navigation/core';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useCallback, useEffect, useState } from 'react';
import { getMaterialTopTabScreenOptions } from 'src/routes/config/materialTopTabOptions';
import api from 'src/services/api';
import { Header, Loading, ProgressBar } from 'src/shared';
import { TabLogisticsBoarding } from '../../';
import { ILogistics } from '../../types/logistics';
import { Container, ContainerContractPosition, SectionGeneral } from './styles';
//import { Container, ContainerContractPosition, SectionGeneral } from './styles';

interface IRouteProps {
  params?: {
    id?: string;
  };
}

const Tab = createMaterialTopTabNavigator();

// Componente nomeado para evitar warning de componente inline
const TabLogisticsBoardingWrapper = ({ route }: any) => {
  const { id } = route.params || {};
  return <TabLogisticsBoarding id={id} />;
};

const LogisticsDetails = () => {
  const route: IRouteProps = useRoute();

  const [dataGeneral, setDataGeneral] = useState<ILogistics>({} as ILogistics);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [id, setId] = useState('');

  const handleLoadGeneral = useCallback(async (_id: string) => {
    try {
      const response = await api.get(`salescontract-delivery/get/${_id}`);
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
      setDataGeneral({} as ILogistics);
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
                  Posição dos contratos
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
                  >{`${dataGeneral.culture} - ${dataGeneral.placeName}`}</TextRegular>
                </Row>
                <Row marginTop={4}>
                  <TextRegular
                    size={13}
                    marginTop={4}
                  >{`${dataGeneral.contract} - ${dataGeneral.crop}`}</TextRegular>
                </Row>
                <Row marginTop={4}>
                  <TextRegular size={13} numberOfLines={1}>
                    {dataGeneral.buyer || ''}
                  </TextRegular>
                </Row>
                <Row justifyContent="space-between" marginTop={4}>
                  <TextRegular size={13}>
                    {`Local Embarque: ${dataGeneral.boardingPlace || ''}`}
                  </TextRegular>
                </Row>
                <Row justifyContent="space-between" marginTop={4}>
                  <TextRegular size={13}>
                    {`Responsável: ${dataGeneral.userResponsible || ''}`}
                  </TextRegular>
                </Row>
                {/*<Row justifyContent="space-between" marginTop={4}>
                  <TextRegular size={13}>{`Tempo Total: ${0}`}</TextRegular>
                </Row>*/}
                <Row justifyContent="space-between" marginTop={4}>
                  <TextRegular size={13}>{`Embarcados: ${
                    dataGeneral.ticketBoarding || 0
                  }`}</TextRegular>
                  <TextRegular size={13}>{`Finalizados: ${
                    dataGeneral.ticketBoardingFinish || 0
                  }`}</TextRegular>
                </Row>
                <Row justifyContent="space-between" marginTop={4}>
                  <TextRegular size={13}>{`Embarcados Hoje: ${
                    dataGeneral.dayTicketBoarding || 0
                  }`}</TextRegular>
                  <TextRegular size={13}>{`Finalizados Hoje: ${
                    dataGeneral.dayTicketBoardingFinish || 0
                  }`}</TextRegular>
                </Row>
              </>
            )}
          </ContainerContractPosition>
        </SectionGeneral>
        <Flex>
          <Tab.Navigator
            screenOptions={getMaterialTopTabScreenOptions()}
            initialRouteName="Embarques"
          >
            <Tab.Screen
              name="Embarques"
              component={TabLogisticsBoardingWrapper}
              initialParams={{ id }}
            />
          </Tab.Navigator>
        </Flex>
      </Container>
    </>
  );
};

export default LogisticsDetails;
