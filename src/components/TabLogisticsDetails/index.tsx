import { TextBold } from '@globalStyle';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ITicket } from 'src/dtos/logistics';
import api from 'src/services/api';
import CardDetailsLogistics from '../CardDetailsLogistics';
import Loading from '../Loading';

// import { Container } from './styles';

interface ITabLogisticsDetailsProps {
  id: string;
  contractDeliveryId: string;
}

const TabLogisticsDetails = ({ id, contractDeliveryId }: ITabLogisticsDetailsProps) => {
  const listRef = useRef(null);

  const [limit] = useState(20);
  const [allRows, setAllRows] = useState(-1);
  const [data, setData] = useState<Array<ITicket>>([] as Array<ITicket>);
  const [loadingTicket, setLoadingTicket] = useState(false);

  const renderItem = (item: ITicket, index: number) => (
    <View style={{ paddingTop: 8 }}>
      <CardDetailsLogistics data={item} index={index} contractId={id} />
      {data.length - 1 === index ? <View style={{ height: 64 }} /> : null}
    </View>
  );

  const handleLoad = useCallback(async () => {
    try {
      setLoadingTicket(true);

      if (data.length >= allRows && allRows > 0) {
        setLoadingTicket(false);
        return;
      }
      const response = await api.get(
        `salescontract-delivery/get/${id}/ticket?skip=${data.length}&limit=${limit}`
      );
      setAllRows(response.data.allRows);
      setData([...data, ...response.data.rows]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingTicket(false);
    }
  }, [data, allRows, id, limit]);

  useEffect(() => {
    handleLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (data && data.length === 0) {
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
      {loadingTicket ? (
        <Loading />
      ) : (
        <FlatList
          ref={listRef}
          data={data}
          keyExtractor={(item, index) => `${item.contractDeliveryId}-${index}`}
          style={{
            marginBottom: Platform.OS === 'android' ? 64 : 16,
            marginTop: Platform.OS === 'android' ? 16 : 8,
            paddingHorizontal: 8
          }}
          renderItem={({ item, index }) => renderItem(item, index)}
          ListEmptyComponent={() => <View />}
        />
      )}
    </>
  );
};

export default TabLogisticsDetails;
