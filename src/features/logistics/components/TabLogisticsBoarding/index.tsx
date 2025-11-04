import { TextBold } from '@globalStyle';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import api from 'src/services/api';
import { Loading } from 'src/shared';
import { CardDetailsLogistics } from '../../';
import { ITicket } from '../../types/logistics';

interface ITabLogisticsBoardingProps {
  id: string;
}

const TabLogisticsBoarding = ({ id }: ITabLogisticsBoardingProps) => {
  const listRef = useRef(null);

  const [limit] = useState(20);
  const [allRows, setAllRows] = useState(-1);
  const [data, setData] = useState<Array<ITicket>>([] as Array<ITicket>);
  const [loadingTicket, setLoadingTicket] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const renderItem = (item: ITicket, index: number) => (
    <View style={{ paddingTop: 8 }}>
      <CardDetailsLogistics data={item} index={index} contractId={id} />
      {data.length - 1 === index ? <View style={{ height: 64 }} /> : null}
    </View>
  );

  const handleLoad = useCallback(async () => {
    try {
      setLoadingTicket(true);
      const response = await api.get(
        `salescontract-delivery/get/${id}/ticket?skip=${data.length}&limit=${limit}`,
      );
      setAllRows(response.data.allRows);
      setData(prevData => [...prevData, ...response.data.rows]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingTicket(false);
    }
  }, [data, id, limit]);

  const handleLoadMore = async () => {
    if (loadingMore || data.length >= allRows) return;

    setLoadingMore(true);
    try {
      const response = await api.get(
        `salescontract-delivery/get/${id}/ticket?skip=${data.length}&limit=${limit}`,
      );
      setData(prevData => [...prevData, ...response.data.rows]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    handleLoad();
  }, [id]);

  if (data && data.length === 0 && !loadingTicket) {
    return (
      <TextBold width="100%" textAlign="center" marginTop={8}>
        Não há itens para serem exibidos
      </TextBold>
    );
  }

  if (!id) {
    return <Loading />;
  }

  return (
    <>
      {loadingTicket && data.length === 0 ? (
        <Loading />
      ) : (
        <FlatList
          ref={listRef}
          data={data}
          keyExtractor={(item, index) => `${item.contractDeliveryId}-${index}`}
          style={{
            marginBottom: Platform.OS === 'android' ? 64 : 16,
            marginTop: Platform.OS === 'android' ? 16 : 8,
            paddingHorizontal: 8,
          }}
          renderItem={({ item, index }) => renderItem(item, index)}
          ListFooterComponent={loadingMore ? <Loading /> : null}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.1} // Gatilho para carregar mais quando chegar a 10% do fim da lista
        />
      )}
    </>
  );
};

export default TabLogisticsBoarding;
