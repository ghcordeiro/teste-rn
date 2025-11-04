import { Flex, TextBold } from '@globalStyle';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import api from 'src/services/api';
import { Header, Loading, ProgressBar } from 'src/shared';
import { CardLogistics } from '../../';
import { ILogistics, IPositionLogistics } from '../../types/logistics';

import { IFilterModalProps } from '@dtos/FilterModalProps';
import { FloatingButton } from 'src/shared';
import FilterModalLogistics, {
  IOutLogisticsFilters,
} from './FilterModalLogistics';
import { Container, ContainerLogisticsPosition } from './styles';

interface ILogisticsFilters {
  producer?: string;
  cropCulture?: string;
  buyerCode?: string;
  placeNameId?: string;
  showHistory?: string;
  nextRows?: boolean;
}
const Logistics = () => {
  const listRef = useRef(null);
  const modalRef = useRef<IFilterModalProps>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [data, setData] = useState<Array<ILogistics>>([] as Array<ILogistics>);
  const [position, setPosition] = useState<IPositionLogistics>(
    {} as IPositionLogistics,
  );
  const [limit] = useState(10);
  const [allRows, setAllRows] = useState(0);
  const [producerFilter, setProducerFilter] = useState<string>();
  const [cropCultureFilter, setCropCultureFilter] = useState<string>();
  const [buyerFilter, setBuyerFilter] = useState<string>();
  const [placeFilter, setPlaceFilter] = useState<string>();
  const [historyFilter, setHistoryFilter] = useState<string>();

  /* Monta os filtros da consulta, consiedrando que todas as consultas tenham os mesmos parametros */
  const getFilters = (filters: ILogisticsFilters): string[] => {
    const { producer, cropCulture, buyerCode, placeNameId, showHistory } =
      filters;
    const filter: string[] = [];
    // if (producer && producer.length > 0) {
    filter.push(`producer=${producer || 'ALL'}`);
    // }
    if (cropCulture && cropCulture.length > 0) {
      if (cropCulture.split('-')[0] !== 'ALL') {
        filter.push(`culture=${cropCulture.split('-')[0]}`);
      }
      if (cropCulture.split('-')[1] !== 'ALL') {
        filter.push(`crop=${cropCulture.split('-')[1]}`);
      }
    }
    if (buyerCode && buyerCode.length > 0) {
      filter.push(`buyerCode=${buyerCode || 'ALL'}`);
    }
    if (placeNameId) {
      filter.push(`placeNameId=${placeNameId || 'ALL'}`);
    }
    filter.push(`showHistoryDelivery=${showHistory || 'false'}`);

    return filter;
  };

  const loadLogisticsData = useCallback(
    async (filters: ILogisticsFilters) => {
      try {
        const { nextRows = false } = filters;
        let currentData = data;
        if (!nextRows) {
          currentData = [];
          setData([]);
        }
        if (currentData.length >= allRows && allRows > 0) {
          // setLoading(false);
          // setReload(false);
          return;
        }
        /** Consultar os filtros e adicinonad os parametros de paginação. */
        const query: string[] = getFilters(filters) || [];
        if (currentData && currentData.length > 0) {
          query.push(`skip=${currentData.length}`);
        }
        if (limit) {
          query.push(`limit=${limit}`);
        }
        try {
          const response = await api.get(
            //`salescontract-delivery/list${query.length > 0 ? `?${query.join('&')}` : ''}`
            `salescontract-delivery/list${
              query.length > 0 ? `?${query.join('&')}` : ''
            }`,
          );
          setData([...currentData, ...response.data.rows]);
          //console.log(response.data);
          setAllRows(response.data.allRows);
        } catch (error) {
          console.error('Request salescontract-delivery/list.Error: ', error);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        setReload(false);
      }
    },
    [allRows, data, limit],
  );
  const loadLogisticsPosition = useCallback(
    async (filters: ILogisticsFilters) => {
      try {
        /** Pega os filtros */
        const query: string[] = getFilters(filters) || [];
        const response = await api.get(
          `salescontract-delivery/deliverypositionbalance${
            query.length > 0 ? `?${query.join('&')}` : ''
          }`,
        );
        setPosition(response.data);
      } catch (e) {
        console.error(
          'Request salescontract-delivery/deliverypositionbalance.Error: ',
          e,
        );
      }
    },
    [],
  );

  const onRefreshData = useCallback(
    async (filters: ILogisticsFilters) => {
      const { nextRows = false } = filters;
      if (!nextRows) {
        setLoading(true);
      }
      await loadLogisticsPosition(filters);
      await loadLogisticsData(filters);
      setProducerFilter(filters.producer);
      setCropCultureFilter(filters.cropCulture);
      setBuyerFilter(filters.buyerCode);
      setPlaceFilter(filters.placeNameId);
      setHistoryFilter(filters.showHistory);
      setLoading(false);
      setReload(false);
    },
    [loadLogisticsData, loadLogisticsPosition],
  );

  const onRefresh = async () => {
    setReload(true);
    onRefreshData({
      producer: producerFilter,
      cropCulture: cropCultureFilter,
      buyerCode: buyerFilter,
      placeNameId: placeFilter,
      showHistory: historyFilter,
    });
  };
  const initilization = async () => {
    await onRefreshData({
      producer: producerFilter,
      cropCulture: cropCultureFilter,
      buyerCode: buyerFilter,
      placeNameId: placeFilter,
      showHistory: historyFilter,
    });
  };

  const handleFilter = useCallback(
    async (filters: IOutLogisticsFilters) => {
      console.log('handleFilters ', filters.showHistory);
      await onRefreshData({
        producer: filters.producer,
        cropCulture: filters.cropCulture,
        buyerCode: filters.buyerCode,
        placeNameId: filters.placeNameId,
        showHistory: filters.showHistory,
      });
    },
    [onRefreshData],
  );

  useEffect(() => {
    initilization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = (item: ILogistics, index: number) => (
    <>
      <Container>
        <CardLogistics key={item._id} data={item} />
        {index === data.length - 1 ? (
          <View style={{ height: 32, width: '100%' }} />
        ) : null}
      </Container>
    </>
  );

  const renderFooter = () => {
    if (!loading) return <></>;
    return (
      <Flex marginTop={-64} alignItems="center" justifyContent="center">
        <Loading />
      </Flex>
    );
  };

  return (
    <>
      <Header showBackButton />
      {loading ? (
        <Loading />
      ) : (
        <>
          {data && data.length > 0 ? (
            <>
              <ContainerLogisticsPosition>
                <TextBold size={13} marginBottom={4}>
                  Posição dos Embarques
                </TextBold>
                <ProgressBar
                  value={position?.percentDelivered || 100}
                  isCard={false}
                />
              </ContainerLogisticsPosition>
              <FlatList
                data={data}
                ref={listRef}
                renderItem={({ item, index }) => renderItem(item, index)}
                showsVerticalScrollIndicator={false}
                keyExtractor={item =>
                  item._id.toString() + String(Date.now() * Math.random())
                }
                refreshControl={
                  <RefreshControl
                    refreshing={reload}
                    onRefresh={() => onRefresh()}
                  />
                }
                refreshing={reload}
                onEndReached={() =>
                  loadLogisticsData({
                    nextRows: true,
                    producer: producerFilter,
                    cropCulture: cropCultureFilter,
                    buyerCode: buyerFilter,
                    showHistory: historyFilter,
                  })
                }
                onEndReachedThreshold={0.3}
                ListFooterComponent={renderFooter}
                style={{ paddingTop: 16 }}
              />
            </>
          ) : (
            <TextBold width="100%" textAlign="center" marginTop={8}>
              Nenhum embarque encontrado!
            </TextBold>
          )}
        </>
      )}
      <FilterModalLogistics ref={modalRef} onHandleFilters={handleFilter} />
      <FloatingButton
        filterCount={modalRef.current?.filterCount || 0}
        open={modalRef.current?.openModal}
      />
    </>
  );
};

export default Logistics;
