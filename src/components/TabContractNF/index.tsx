import { TextBold } from '@globalStyle';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { IInvoice } from 'src/dtos/contract';
import api from 'src/services/api';
import CardDetailsNF from '../CardDetailsNF';
import Loading from '../Loading';

// import { Container } from './styles';

interface ITabContractNFProps {
  id: string;
}

const TabContractNF = ({ id }: ITabContractNFProps) => {
  const listRef = useRef(null);

  const [limit] = useState(20);
  const [allRows, setAllRows] = useState(-1);
  const [data, setData] = useState<Array<IInvoice>>([] as Array<IInvoice>);
  const [loadingNF, setLoadingNF] = useState(false);

  const renderItem = (item: IInvoice, index: number) => (
    <View style={{ paddingTop: 8 }}>
      <CardDetailsNF data={item} index={index} contractId={id} />
      {data.length - 1 === index ? <View style={{ height: 64 }} /> : null}
    </View>
  );

  const handleLoad = useCallback(async () => {
    try {
      setLoadingNF(true);

      if (data.length >= allRows && allRows > 0) {
        setLoadingNF(false);
        return;
      }
      const response = await api.get(
        `salescontract/get/${id}/invoice?skip=${data.length}&limit=${limit}`
      );
      setAllRows(response.data.allRows);
      setData([...data, ...response.data.rows]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingNF(false);
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
      {loadingNF ? (
        <Loading />
      ) : (
        <FlatList
          ref={listRef}
          data={data}
          keyExtractor={(item, index) => `${item.contractId}-${index}`}
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

export default TabContractNF;
