/* eslint-disable no-underscore-dangle */
import Colors from '@colors';
import TabAttachmentsTrackWithdrawal from '@components/TabAttachmentsTrackWithdrawal';
import { IDeliveryOrder } from '@dtos/delivery-order';
import { EDeliveryOrderStatus } from '@enum/EDeliveryOrderStatus';
import { Flex, Row, TextBold, TextLight, TextRegular } from '@globalStyle';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { normalize } from '@size';
import convertData from '@utils/convertData';
import DiffData from '@utils/DiffData';
import { AxiosResponse } from 'axios';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';
import Modal from 'react-native-modal';
import api from 'src/services/api';
import TabItemsTrackWithdrawal from '../TabItemsTrackWithdrawal/index';
import { Body, BodyGroupText, BodyGroupTextRow, Header, ModalContainer } from './styles';

export interface IModalTrackWithdrawalProps {
  openModal: (key: string) => void;
  closeModal: () => void;
}

const Tab = createMaterialTopTabNavigator();

const ModalTrackWithdrawal: React.ForwardRefRenderFunction<
  IModalTrackWithdrawalProps,
  any
> = (_, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [item, setItem] = useState<IDeliveryOrder>({} as IDeliveryOrder);
  const [key, setKey] = useState<string>()

  const openModal = useCallback(async (value: string) => {
    setVisible(true);
    setKey(value);
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
    async function load() {
      if (key) {
        const response: AxiosResponse<IDeliveryOrder> = await api.get(
          `delivery-order/detail/${key}`
        );

        setItem(response.data);
      }
    }

    load();
  }, [key]);

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
          <TextLight
            numberOfLines={1}
            adjustsFontSizeToFit
            size={18}
            color={Colors.white}>
            Solicitação {item?.code}
          </TextLight>
        </Header>
        <Body>
          <Row>
            <BodyGroupText>
              <TextBold size={16} numberOfLines={1}>
                {EDeliveryOrderStatus[item?.status]}
              </TextBold>
            </BodyGroupText>
          </Row>
          <Row>
            <BodyGroupTextRow>
              <TextBold size={15}>Data abertura: </TextBold>
              <TextRegular size={15} numberOfLines={1}>
                {`${convertData(
                  new Date(item?.dateOf).getTime(),
                  '/',
                  true
                )}`}
              </TextRegular>
            </BodyGroupTextRow>
          </Row>
          <Row>
            <BodyGroupTextRow>
              <TextBold size={15}>Tempo em aberto: </TextBold>
              <TextRegular size={15} numberOfLines={1}>
                {`${DiffData(
                  new Date(item?.dateOf).getTime()
                )}`}
              </TextRegular>
            </BodyGroupTextRow>
          </Row>
          { item?.vehiclePlate &&
            <Row>
              <BodyGroupTextRow>
                <TextBold size={15}>Veículo: </TextBold>
                <TextRegular size={15} numberOfLines={1}>
                  {`${item?.vehiclePlate}`}
                </TextRegular>
              </BodyGroupTextRow>
            </Row>
          }
          { item?.addressDeliveryPlaceName &&
            <Row>
              <BodyGroupTextRow>
                <TextBold size={15}>Fazenda: </TextBold>
                <TextRegular size={15} numberOfLines={1}>
                  {`${item?.addressDeliveryPlaceName}`}
                </TextRegular>
              </BodyGroupTextRow>
            </Row>
          }
          { item?.addressDelivery &&
            <Row>
              <BodyGroupTextRow>
                <TextBold size={15}>Endereço: </TextBold>
                <TextRegular size={15} numberOfLines={1}>
                  {`${item?.addressDelivery}`}
                </TextRegular>
              </BodyGroupTextRow>
            </Row>
          }
          <Row justifyContent="space-between">
            {item?.orderCode?.length > 0 && (
              <BodyGroupTextRow>
                <TextBold size={12}>Ordens: </TextBold>
                <TextRegular size={12}>
                  {`${item?.orderCode.join(', ')}`}
                </TextRegular>
              </BodyGroupTextRow>
            )}
          </Row>
          <Row>
            {item?.invoiceCode?.length > 0 && (
              <BodyGroupTextRow>
                <TextBold size={12}>Notas: </TextBold>
                <TextRegular size={12}>
                  {`${item?.invoiceCode.join(', ')}`}
                </TextRegular>
              </BodyGroupTextRow>
            )}
          </Row>
        </Body>
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
                scrollEnabled: false
              }}
              initialRouteName="Itens">
              <Tab.Screen
                name="Itens"
                component={() => (
                  <TabItemsTrackWithdrawal data={item?.products} />
                )}
              />
              <Tab.Screen
                name="Anexos"
                component={() => (
                  <TabAttachmentsTrackWithdrawal
                    data={item?.attachments}
                    closeModal={closeModal}
                  />
                )}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </Flex>
      </ModalContainer>
    </Modal>
  );
};

export default forwardRef(ModalTrackWithdrawal);
