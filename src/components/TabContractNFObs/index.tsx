import { TextBold } from '@globalStyle';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { INote } from 'src/dtos/contract';
import api from 'src/services/api';
import CardDetailsNFObs from '../CardDetailsNFObs';
import Loading from '../Loading';

// import { Container } from './styles';

interface ITabContractPaymentProps {
  id: string;
}

const TabContractNFObs = ({ id }: ITabContractPaymentProps) => {
  const [data, setData] = useState<INote>({} as INote);
  const [loadingNF, setLoadingNF] = useState(false);

  const handleLoad = useCallback(async () => {
    try {
      setLoadingNF(true);
      const response = await api.get(`salescontract/get/${id}/note`);
      setData({ ...data, ...response.data });
    } catch (e) {
      console.log(e);
    } finally {
      setLoadingNF(false);
    }
  }, [data, id]);

  useEffect(() => {
    handleLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (data && !data.note) {
    return (
      <TextBold width="100%" textAlign="center" marginTop={8}>
        Não há itens para serem exibidos
      </TextBold>
    );
  }

  return (
    <>
      {loadingNF ? (
        <Loading />
      ) : (
        <View
          style={{
            marginBottom: Platform.OS === 'android' ? 64 : 16,
            marginTop: Platform.OS === 'android' ? 16 : 8,
            paddingHorizontal: 8
          }}>
          <CardDetailsNFObs data={data} />
        </View>
      )}
    </>
  );
};

export default TabContractNFObs;
