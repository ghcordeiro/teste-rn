import Colors from '@colors';
import { CardDetailsCashFlow } from 'src/features/financial';
import { ICashFlowResume, ICashFlowFilters } from 'src/features/financial';
import { Flex, Row, TextBold } from '@globalStyle';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { Platform, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

interface ITabCashFlowProps {
  currency: string;
  data: ICashFlowResume[];
  filters: ICashFlowFilters; // Adicionando os filtros como prop
}

const TabCashFlow = forwardRef(({ currency, data, filters }: ITabCashFlowProps, ref) => {
  const listRef = useRef<FlatList<ICashFlowResume>>(null);

  useImperativeHandle(ref, () => ({
    scrollToTop: () => {
      if (listRef.current) {
        listRef.current.scrollToOffset({ offset: 0, animated: true });
      }
    },
  }));

  const renderItem = (item: ICashFlowResume, index: number) => (
    <View style={{ paddingTop: 8 }}>
      <CardDetailsCashFlow 
        data={item} 
        index={index} 
        filters={filters} // Passando os filtros para o CardCashFlow
      />
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
      <Row
        paddingLeft={18}
        paddingRight={18}
        paddingTop={8}
        paddingBottom={8}
        backgroundColor={Colors.ecoop.darkGray}>
        <Flex flex={1}>
          <TextBold size={12} textAlign="left" color="white">
            Data
          </TextBold>
        </Flex>
        <Flex flex={2}>
          <TextBold size={12} textAlign="right" color="white">
            Recebimento
          </TextBold>
        </Flex>
        <Flex flex={2}>
          <TextBold size={12} textAlign="right" color="white">
            Pagamento
          </TextBold>
        </Flex>
        <Flex flex={2}>
          <TextBold size={12} textAlign="right" color="white">
            Saldo
          </TextBold>
        </Flex>
      </Row>
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item, index) => `${item.key}-${index}`}
        style={{
          marginBottom: Platform.OS === 'android' ? 64 : 16,
          marginTop: Platform.OS === 'android' ? 16 : 8,
          paddingHorizontal: 8,
        }}
        renderItem={({ item, index }) => renderItem(item, index)}
        ListEmptyComponent={() => <View />}
      />
    </>
  );
});

export default TabCashFlow;
