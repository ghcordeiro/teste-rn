import { CardWithdrawalItem } from '@components/CardWithdrawalItem';
import { TextBold } from '@globalStyle';
import React, { useRef } from 'react';
import { Platform, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { IProductDeliveryOrder } from '../../dtos/delivery-order';

interface ITabContractAdvanceProps {
  data: IProductDeliveryOrder[];
}

const TabItemsTrackWithdrawal = ({ data }: ITabContractAdvanceProps) => {
  const listRef = useRef(null);

  console.log('TabItemsTrackWithdrawal => ', data);

  const renderItem = (item: IProductDeliveryOrder, index: number) => (
    <View style={{ paddingTop: 8 }}>
      <CardWithdrawalItem data={item} />
      {data.length - 1 === index ? <View style={{ height: 64 }} /> : null}
    </View>
  );

  if (!data || data.length === 0) {
    return (
      <TextBold width="100%" textAlign="center" marginTop={8}>
        Não há itens para serem exibidos
      </TextBold>
    );
  }

  return (
    <>
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
    </>
  );
};

export default TabItemsTrackWithdrawal;
