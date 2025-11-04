/* eslint-disable no-underscore-dangle */
import Colors from '@colors';
import Loading from '@components/Loading';
import { Flex, Divider, Row, TextBold, TextLight, TextRegular } from '@globalStyle';
import { normalize } from '@size';
import {useRoute} from '@react-navigation/core';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { ITicket, IInvoiceItem, ITimelineItemDTO } from 'src/dtos/logistics';
import api from 'src/services/api';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import convertCurrency from '@utils/convertCurrency';
import convertData from '@utils/convertData';
import returnContractType, { ITypeDefinition } from '@utils/returnContractType';
import { ContainerTimelineCard, Header, ModalContainer } from './styles';
import {IDataDTO} from 'src/dtos/logistics';
import { NavigationContainer } from '@react-navigation/native';
import convertHours from '@utils/convertHours';

export interface IModalCardDetailsLogsticsProps {
  openModal: () => void;
  closeModal: () => void;
}

export interface ReciveProps {
  ticket: ITicket;
}

interface DetailsTabProps {
  dataGeneral: IDataDTO;
}

interface TimelineTabProps {
  dataGeneral: IDataDTO;
}

const Tab = createMaterialTopTabNavigator();
//const [dataGeneral, setDataGeneral] = useState<IDataDTO>({} as IDataDTO);


const DetailsTab = ({ dataGeneral }: DetailsTabProps) => {
  return (
    <View style={styles.tabContent}>
      <Text>{dataGeneral.plate}</Text>
      <Text>{convertData(
                new Date(dataGeneral.startDate).getTime(),
                '/',
                false,
                'full'
              )}</Text>
      <Text>{dataGeneral.document}</Text>
      <Text>{`${dataGeneral.quantity} ${dataGeneral.measurementUnit}`}</Text>
      <Text>{dataGeneral.carrier}</Text>     
      <Text>{dataGeneral.driver}</Text> 
      <Text>{`Tempo Atual: ${convertHours(dataGeneral.timeStep)} Hr`}</Text> 
      <Text>{`Tempo Total: ${convertHours(dataGeneral.timeAll)} Hr`}</Text>
    </View>
  );
};

const TimelineTab = ({ dataGeneral }: TimelineTabProps) => {
  const renderTimelineItem = ({ item }: { item: ITimelineItemDTO }) => (
    <ContainerTimelineCard>
      <Row justifyContent='space-between'>
        <TextRegular>{convertData(new Date(item.dateOf).getTime(), '/', true, 'full')}</TextRegular>
        <TextRegular marginTop={8}>{`${convertHours(item.time)}`}</TextRegular>
      </Row>
      <TextRegular style={styles.itemText}>{item.timelineText}</TextRegular>
    </ContainerTimelineCard>
  );

  return (
    <FlatList
      data={dataGeneral.timeline}
      keyExtractor={(item) => item.sequence.toString()}
      renderItem={renderTimelineItem}
      style={{
        marginBottom: Platform.OS === 'android' ? 64 : 16,
        marginTop: Platform.OS === 'android' ? 16 : 8,
        paddingHorizontal: 8,
        paddingVertical: 16
      }}
    />
  );
};

interface IRouteProps {
  params?: {
    id?: string;
  };
}

const ModalCardDetailsLogistics: React.ForwardRefRenderFunction<
IModalCardDetailsLogsticsProps,
  ReciveProps
> = ({ ticket }, ref) => {
  const route: IRouteProps = useRoute();

  const [dataGeneral, setDataGeneral] = useState<IDataDTO | null>(null);  
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>({} as any);
  const [typeContract, setTypeContract] = useState<
    ITypeDefinition | undefined
  >();

  const handleLoadGeneral = useCallback(async (ticket: ITicket) => {
    try {
      const response = await api.get(`salescontract-delivery/get/${ticket.contractDeliveryId}/ticket/${ticket._id}`);
      setDataGeneral(response.data);
      setLoadingProgress(false);
    } catch (e: any) {
      console.log(e.message);
      setLoadingProgress(false);
    }
  }, []);

  useEffect(() => {
    handleLoadGeneral(ticket);
    return () => {
      setDataGeneral({} as IDataDTO);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  const openModal = useCallback(async () => {
    setLoading(true);
    setVisible(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeModal = useCallback(() => {
    setVisible(false);
  }, []);

  useImperativeHandle(ref, () => {
    return {
      openModal,
      closeModal
    };
  });

  useEffect(() => {
    setTypeContract(returnContractType(data.type));
  }, [data.type]);

  if (!dataGeneral) {
    return <Text>Carregando...</Text>;
  }

  return (
    <Modal
      isVisible={visible}
      backdropColor="#3b3b3b"
      backdropOpacity={0.9}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      onBackButtonPress={() => setVisible(false)}
      onBackdropPress={() => setVisible(false)}
      shouldRasterizeIOS>
      <ModalContainer>
        <Header>
          <FAIcon
            name="truck"
            color={Colors.white}
            size={normalize(18)}
            style={{ transform: [{ rotateY: '180deg' }] }}
          />
          <TextLight
            numberOfLines={1}
            adjustsFontSizeToFit
            size={18}
            color={Colors.white}
            marginLeft={8}>
            {ticket.plate}
          </TextLight>
        </Header>
        <Flex>
        <NavigationContainer independent>
          <Tab.Navigator tabBarOptions={{
                style: {
                  backgroundColor: Colors.ecoop.darkGray,
                },
                labelStyle: {
                  fontWeight: 'bold',
                  width: '100%',
                  textAlign: 'center',
                  margin: 0,
                  padding: 0,
                  fontSize: normalize(12),
                },
                activeTintColor: '#FFF',
                inactiveTintColor: '#ADADAD',
                indicatorStyle: {
                  marginBottom: 4,
                  backgroundColor: '#FFF',
                },
              }}
              initialRouteName="Detalhes">
            <Tab.Screen 
              name="Detalhes"
              component={
                () => <DetailsTab dataGeneral={dataGeneral} />
              }
            />
            <Tab.Screen
              name="Timeline"
              component={
                () => <TimelineTab dataGeneral={dataGeneral} />
              }
            />
          </Tab.Navigator>
        </NavigationContainer>
        </Flex>
      </ModalContainer>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  openButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 14,
    color: "#666",
  },
});

export default forwardRef(ModalCardDetailsLogistics);
