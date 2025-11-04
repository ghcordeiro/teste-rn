import CardContract from '@components/CardContract';
import Header from '@components/Header';
import Loading from '@components/Loading';
import ProgressBar from '@components/ProgressBar';
import { Flex, TextBold } from '@globalStyle';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { IContract, IPositionContract } from 'src/dtos/contract';
import api from 'src/services/api';

import FloatingButton from '@components/Filters/FloatingButton';
import { IFilterModalProps } from '@dtos/FilterModalProps';
import FilterModalContract, {
  IOutContractFilters
} from './FilterModalContract';
import { Container, ContainerContractPosition } from './styles';

interface IContractFilters {
  producer?: string;
  cropCulture?: string;
  status?: string[];
  nextRows?: boolean;
}
const Contracts = () => {
  const listRef = useRef(null);
  const modalRef = useRef<IFilterModalProps>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [data, setData] = useState<Array<IContract>>([] as Array<IContract>);
  const [position, setPosition] = useState<IPositionContract>(
    {} as IPositionContract
  );
  const [limit] = useState(10);
  const [allRows, setAllRows] = useState(0);
  const [producerFilter, setProducerFilter] = useState<string>();
  const [cropCultureFilter, setCropCultureFilter] = useState<string>();
  const [statusFilter, setStatusFilter] = useState<string[]>();

  /* Monta os filtros da consulta, consiedrando que todas as consultas tenham os mesmos parametros */
  const getFilters = (filters: IContractFilters): string[] => {
    const { producer, cropCulture, status } = filters;
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
    if (status && status.length > 0) {
      filter.push(`status=${status}`);
    }

    return filter;
  };

  const loadContractData = useCallback(
    async (filters: IContractFilters) => {
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
            `salescontract/list${query.length > 0 ? `?${query.join('&')}` : ''}`
          );
          setData([...currentData, ...response.data.rows]);
          setAllRows(response.data.allRows);
        } catch (error) {
          console.error('Request salescontract/list.Error: ', error);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        setReload(false);
      }
    },
    [allRows, data, limit]
  );
  const loadContractPosition = useCallback(
    async (filters: IContractFilters) => {
      try {
        /** Pega os filtros */
        const query: string[] = getFilters(filters) || [];
        const response = await api.get(
          `salescontract/contractpositionbalance${
            query.length > 0 ? `?${query.join('&')}` : ''
          }`
        );
        setPosition(response.data);
      } catch (e) {
        console.error(
          'Request salescontract/contractpositionbalance.Error: ',
          e
        );
      }
    },
    []
  );

  const onRefreshData = useCallback(
    async (filters: IContractFilters) => {
      const { nextRows = false } = filters;
      if (!nextRows) {
        setLoading(true);
      }
      await loadContractPosition(filters);
      await loadContractData(filters);
      setProducerFilter(filters?.producer);
      setCropCultureFilter(filters?.cropCulture);
      setStatusFilter(filters?.status);
      setLoading(false);
      setReload(false);
    },
    [loadContractData, loadContractPosition]
  );

  const onRefresh = async () => {
    setReload(true);
    onRefreshData({
      producer: producerFilter,
      cropCulture: cropCultureFilter,
      status: statusFilter
    });
  };
  const initilization = async () => {
    await onRefreshData({
      producer: producerFilter,
      cropCulture: cropCultureFilter,
      status: statusFilter
    });
  };

  const handleFilter = useCallback(
    async (filters?: IOutContractFilters) => {
      await onRefreshData({
        producer: filters?.producer,
        cropCulture: filters?.cropCulture,
        status: filters?.status
      });
    },
    [onRefreshData]
  );

  useEffect(() => {
    initilization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = (item: IContract, index: number) => (
    <>
      <Container>
        <CardContract
          key={item._id.toString() + String(Date.now() * Math.random())}
          data={item}
        />
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
              <ContainerContractPosition>
                <TextBold size={13} marginBottom={4}>
                  Posição de contratos
                </TextBold>
                <ProgressBar
                  value={position?.percentDelivered || 100}
                  isCard={false}
                />
              </ContainerContractPosition>
              <FlatList
                data={data}
                ref={listRef}
                renderItem={({ item, index }) => renderItem(item, index)}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) =>
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
                  loadContractData({
                    nextRows: true,
                    producer: producerFilter,
                    cropCulture: cropCultureFilter
                  })
                }
                onEndReachedThreshold={0.3}
                ListFooterComponent={renderFooter}
                style={{ paddingTop: 16 }}
              />
            </>
          ) : (
            <TextBold width="100%" textAlign="center" marginTop={8}>
              Nenhum contrato encontrato!
            </TextBold>
          )}
        </>
      )}
      <FilterModalContract
        ref={modalRef}
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

export default Contracts;
