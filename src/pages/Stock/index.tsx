import Colors from '@colors';
import CardStock from '@components/CardStock';
import Header from '@components/Header';
import Loading from '@components/Loading';
import { IFilterModalProps } from '@dtos/FilterModalProps';
import IStock from '@dtos/stock';
import { CenteredFlex, TextRegular } from '@globalStyle';
import { translate } from '@translate';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View
} from 'react-native';
import FloatingButton from 'src/components/Filters/FloatingButton';
import api from 'src/services/api';
import FilterModalStock, { IOutStockFilters } from './FilterModalStock';
import { Container } from './styles';

interface ILoadRepositoriesProps {
  textFilter?: string;
  cropFilter?: string;
  cultureFilter?: string;
  nextRows?: boolean;
}

const Stock = () => {
  const modalRef = useRef<IFilterModalProps>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false);
  const [data, setData] = useState<Array<IStock>>([] as Array<IStock>);
  const [text, setText] = useState<string>();
  const [crop, setCrop] = useState<string>();
  const [culture, setCulture] = useState<string>();
  const [limit] = useState(10);
  const [allRows, setAllRows] = useState(0);

  const loadRepositories = useCallback(
    async ({
      textFilter,
      cropFilter,
      cultureFilter,
      nextRows = false
    }: ILoadRepositoriesProps) => {
      try {
        let currentData = data;
        if (!nextRows) {
          currentData = [];
          setLoading(true);
          setData([]);
        }
        if (currentData.length >= allRows && allRows > 0) {
          setLoading(false);
          setReload(false);
          return;
        }
        let filter = '';
        if (textFilter) {
          filter = `${filter}&q=${textFilter}`;
        }
        if (cropFilter && cropFilter !== 'ALL') {
          filter = `${filter}&crop=${cropFilter}`;
        }
        if (cultureFilter && cultureFilter !== 'ALL') {
          filter = `${filter}&culture=${cultureFilter}`;
        }
        setText(textFilter);
        setCrop(cropFilter);
        setCulture(cultureFilter);
        try {
          const response = await api.get(
            `orderstock/balance?limit=${limit}&skip=${currentData.length}${
              filter ? `${filter}` : ''
            }`
          );
          setAllRows(response.data.allRows);
          setData([...currentData, ...response.data.rows]);
        } catch (error) {
          console.error('Request orderstock/balance.Error: ', error);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
        setReload(false);
      }
    },
    [data, allRows, limit]
  );

  const renderItem = (item: IStock, index: number) => (
    <>
      <Container>
        <CardStock
          key={item.productId.toString() + String(Date.now() * Math.random())}
          data={item}
        />
        {index === data.length - 1 ? (
          <View style={{ height: 32, width: '100%' }} />
        ) : null}
      </Container>
    </>
  );

  useEffect(() => {
    loadRepositories({
      cropFilter: crop,
      cultureFilter: culture,
      textFilter: text
    });

    return () => {
      setData([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color={Colors.primary.blue} />;
  };

  const onRefresh = () => {
    setReload(true);
    loadRepositories({
      cropFilter: crop,
      cultureFilter: culture,
      textFilter: text
    });
  };

  const listEmptyComponent = () => {
    return (
      <CenteredFlex>
        <TextRegular size={32}>{translate('noItems')}</TextRegular>
      </CenteredFlex>
    );
  };

  const handleFilter = useCallback(
    (filters?: IOutStockFilters) => {
      loadRepositories({
        cropFilter: filters?.crop,
        cultureFilter: filters?.culture,
        textFilter: filters?.text
      });
    },
    [loadRepositories]
  );

  return (
    <>
      <Header showBackButton />
      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 8
        }}
      />
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item, index }) => renderItem(item, index)}
          showsVerticalScrollIndicator={false}
          keyExtractor={() => String(Date.now() * Math.random())}
          refreshControl={
            <RefreshControl refreshing={reload} onRefresh={() => onRefresh()} />
          }
          refreshing={reload}
          onEndReached={async () =>
            await loadRepositories({
              cropFilter: crop,
              cultureFilter: culture,
              textFilter: text,
              nextRows: true
            })
          }
          onEndReachedThreshold={0.3}
          ListEmptyComponent={listEmptyComponent}
          ListFooterComponent={renderFooter}
          style={{ paddingTop: 16 }}
        />
      )}
      <FilterModalStock
        ref={modalRef}
        // text={text}
        // crop={crop}
        // culture={culture}
        onHandleFilters={handleFilter}
        useExport
      />
      <FloatingButton
        filterCount={modalRef.current?.filterCount || 0}
        open={modalRef.current?.openModal}
      />
    </>
  );
};

export default Stock;
