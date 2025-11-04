import Colors from '@colors';
import CardTrackWithdrawal from '@components/CardTrackWithdrawal';
import {
  CenteredFlex,
  ContainerCard,
  EndFlatListSpacing,
  StartFlatListSpacing,
  TextRegular,
} from '@globalStyle';
import { useRoute } from '@react-navigation/core';
import { translate } from '@translate';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl } from 'react-native';
import api from 'src/services/api';
import { Header, Loading } from 'src/shared';
import { IDeliveryOrder } from '../../types/delivery-order';

interface ILoadRepositoriesProps {
  nextRows?: boolean;
}

export const TrackWithdrawal = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(false);
  const [data, setData] = useState<Array<IDeliveryOrder>>(
    [] as Array<IDeliveryOrder>,
  );
  const [limit] = useState(10);
  const [allRows, setAllRows] = useState(0);
  const { params } = useRoute();

  console.log(params);

  const loadRepositories = useCallback(
    async ({ nextRows = false }: ILoadRepositoriesProps) => {
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
        const filter = '';
        // if (textFilter) {
        //   filter = `${filter}&q=${textFilter}`;
        // }
        // if (cropFilter && cropFilter !== 'ALL') {
        //   filter = `${filter}&crop=${cropFilter}`;
        // }
        // if (cultureFilter && cultureFilter !== 'ALL') {
        //   filter = `${filter}&culture=${cultureFilter}`;
        // }
        // setText(textFilter);
        // setCrop(cropFilter);
        // setCulture(cultureFilter);
        try {
          const response = await api.get(
            `delivery-order/list?limit=${limit}&skip=${currentData.length}${
              filter ? `${filter}` : ''
            }`,
          );
          setAllRows(response.data.allRows);
          setData([...currentData, ...response.data.rows]);
        } catch (error) {
          console.error('Request delivery-order/list.Error: ', error);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
        setReload(false);
      }
    },
    [data, allRows, limit],
  );

  const renderItem = (item: IDeliveryOrder, index: number) => (
    <>
      <ContainerCard>
        <CardTrackWithdrawal key={item.key || `track-${index}`} data={item} />
        {index === data.length - 1 ? <EndFlatListSpacing /> : null}
      </ContainerCard>
    </>
  );

  useEffect(() => {
    loadRepositories({});

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
    loadRepositories({});
  };

  const listEmptyComponent = () => {
    return (
      <CenteredFlex>
        <TextRegular size={32}>{translate('commonNoItems')}</TextRegular>
      </CenteredFlex>
    );
  };

  return (
    <>
      <Header showBackButton showRightButton />
      <StartFlatListSpacing />
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
          onEndReached={async () => await loadRepositories({ nextRows: true })}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={listEmptyComponent}
          ListFooterComponent={renderFooter}
          style={{ paddingTop: 16 }}
        />
      )}
    </>
  );
};
