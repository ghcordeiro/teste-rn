/* eslint-disable no-underscore-dangle */
import Colors from '@colors';
import CardOrder from '@components/CardOrder';
import Loading from '@components/Loading';
import { TextLight } from '@globalStyle';
import { normalize, normalizeHeight } from '@size';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState
} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View
} from 'react-native';
import Modal from 'react-native-modal';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import api from 'src/services/api';
import { IOrder } from '../../dtos/order';
import IStockProps from '../../dtos/stock';

import { Container, Header, ModalContainer } from './styles';

export interface IModalCardStockProps {
  openModal: () => void;
  closeModal: () => void;
}

export interface ReciveProps {
  stock: IStockProps;
}

const ModalCardStock: React.ForwardRefRenderFunction<
  IModalCardStockProps,
  ReciveProps
> = ({ stock }, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [data, setData] = useState<Array<IOrder>>([] as Array<IOrder>);
  const [limit] = useState(20);
  const [allRows, setAllRows] = useState(0);

  const loadRepositories =
    async (/* routeParams: IRouteProps | undefined */) => {
      try {
        setLoading(true);
        if (data.length >= allRows && allRows > 0) {
          setLoading(false);
          setReload(false);
          return;
        }

        // const filtersStr = builderFilters(
        //   {
        //     dateStart: routeParams?.params?.dateStart,
        //     dateEnd: routeParams?.params?.dateEnd
        //   } || {}
        // ).join('&')

        const response = await api.get(
          `orderstock/product/${
            stock.productId
          }/orders?limit=${limit}&skip=${Math.ceil(data.length / limit)}`
        );
        setAllRows(response.data.allRows);
        setData([...data, ...response.data.rows]);
        setLoading(false);
        setReload(false);
      } catch (e) {
        // if(e.statusCode === 401) {
        //   navigation.dispatch(
        //     CommonActions.reset({
        //       index: 0,
        //       routes: [{ name: 'Login' }]
        //     })
        //   )
        // }
        // ToastError(e.statusCode, e.message)

        setLoading(false);
        setReload(false);
        console.log(e);
      }
    };

  const openModal = useCallback(async () => {
    await loadRepositories();
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

  const renderFooter = () => {
    if (!loading) return null;

    return (
      <ActivityIndicator
        size="large"
        color={Colors.primary.blue}
        style={{ marginTop: 32 }}
      />
    );
  };

  const onRefresh = () => {
    setReload(true);
    setData([]);
    loadRepositories();
  };

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
            {stock.activePrinciple}
          </TextLight>
        </Header>
        {loading ? (
          <Loading />
        ) : (
          <FlatList
            data={data}
            renderItem={({ item, index }) => (
              <Container>
                <CardOrder
                  key={item._id + String(Date.now() * Math.random())}
                  data={item}
                />
                {index === data.length - 1 ? (
                  <View style={{ height: 32, width: '100%' }} />
                ) : null}
              </Container>
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={() => String(Date.now() * Math.random())}
            refreshControl={
              <RefreshControl
                refreshing={reload}
                onRefresh={() => onRefresh()}
              />
            }
            refreshing={reload}
            onEndReached={() => loadRepositories()}
            onEndReachedThreshold={0.1}
            ListFooterComponent={() => renderFooter()}
            style={{ paddingTop: normalizeHeight(16) }}
          />
        )}
      </ModalContainer>
    </Modal>
  );
};

export default forwardRef(ModalCardStock);
