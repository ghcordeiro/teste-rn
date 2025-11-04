/* eslint-disable no-underscore-dangle */
import Colors from '@colors';
import { Flex, Row, TextLight, TextRegular } from '@globalStyle';
import { useRoute } from '@react-navigation/core';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { normalize } from '@size';
import convertData from '@utils/convertData';
import convertHours from '@utils/convertHours';
import returnContractType, { ITypeDefinition } from '@utils/returnContractType';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import { IDataDTO } from 'src/dtos/logistics';
import { ITicket, ITimelineItemDTO } from 'src/features/logistics';
import { getMaterialTopTabScreenOptions } from 'src/routes/config/materialTopTabOptions';
import api from 'src/services/api';
import { ContainerTimelineCard, Header, ModalContainer } from './styles';

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

// Componentes nomeados para evitar warnings de componentes inline
const DetailsTabWrapper = ({ route }: any) => {
  const { dataGeneral } = route.params || {};
  return <DetailsTab dataGeneral={dataGeneral} />;
};

const TimelineTabWrapper = ({ route }: any) => {
  const { dataGeneral } = route.params || {};
  return <TimelineTab dataGeneral={dataGeneral} />;
};

const DetailsTab = ({ dataGeneral }: DetailsTabProps) => {
  return (
    <View style={styles.tabContent}>
      <Text>{dataGeneral.plate}</Text>
      <Text>
        {convertData(
          new Date(dataGeneral.startDate).getTime(),
          '/',
          false,
          'full',
        )}
      </Text>
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
      <Row justifyContent="space-between">
        <TextRegular>
          {convertData(new Date(item.dateOf).getTime(), '/', true, 'full')}
        </TextRegular>
        <TextRegular marginTop={8}>{`${convertHours(item.time)}`}</TextRegular>
      </Row>
      <TextRegular style={styles.itemText}>{item.timelineText}</TextRegular>
    </ContainerTimelineCard>
  );

  return (
    <FlatList
      data={dataGeneral.timeline}
      keyExtractor={item => item.sequence.toString()}
      renderItem={renderTimelineItem}
      style={{
        marginBottom: Platform.OS === 'android' ? 64 : 16,
        marginTop: Platform.OS === 'android' ? 16 : 8,
        paddingHorizontal: 8,
        paddingVertical: 16,
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
      const response = await api.get(
        `salescontract-delivery/get/${ticket.contractDeliveryId}/ticket/${ticket._id}`,
      );
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
      closeModal,
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
      shouldRasterizeIOS
    >
      <ModalContainer>
        <Header>
          <FontAwesome
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
            marginLeft={8}
          >
            {ticket.plate}
          </TextLight>
        </Header>
        <Flex>
          <Tab.Navigator
            screenOptions={getMaterialTopTabScreenOptions()}
            initialRouteName="Detalhes"
          >
            <Tab.Screen
              name="Detalhes"
              component={DetailsTabWrapper}
              initialParams={{ dataGeneral }}
            />
            <Tab.Screen
              name="Timeline"
              component={TimelineTabWrapper}
              initialParams={{ dataGeneral }}
            />
          </Tab.Navigator>
        </Flex>
      </ModalContainer>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  openButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
});

export default forwardRef(ModalCardDetailsLogistics);
