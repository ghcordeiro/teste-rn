import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, View} from 'react-native';
import Colors from '@colors';
import CardFinancialMoviment from '@components/CardFinancialMoviment';
import Header from '@components/Header';
import Loading from '@components/Loading';
import {IFilterModalProps} from '@dtos/FilterModalProps';
import EFinancialMovementStatus from '@enum/EFinancialMovementStatus';
import EFinancialStatementOperation from '@enum/EFinancialStatementOperation';
import {CenteredFlex, TextRegular} from '@globalStyle';
import {translate} from '@translate';
import FloatingButton from 'src/components/Filters/FloatingButton';
import api from 'src/services/api';
import IFinancialMoviment from '../../dtos/financialMoviment';
import {Container} from './styles';
import FilterModalFinancialMoviment, { IOutFinancialMovimentFilters } from './FilterModalFinancialMoviment';

interface ILoadRepositoriesProps {
  startDate?: Date;
  endDate?: Date;
  operation?: EFinancialStatementOperation;
  status?: EFinancialMovementStatus[];
  documentType?: string;
  producer?: string;
  nextRows?: boolean;
}

const FinancialMoviment = () => {
  const listRef = useRef(null);
  const modalRef = useRef<IFilterModalProps>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [data, setData] = useState<Array<IFinancialMoviment>>([]);
  const [limit] = useState(20);
  const [allRows, setAllRows] = useState(0);
  const [startDateFilter, setStartDateFilter] = useState<Date>();
  const [endDateFilter, setEndDateFilter] = useState<Date>();
  const [operationFilter, setOperationFilter] =
    useState<EFinancialStatementOperation>();
  const [statusFilter, setStatusFilter] =
    useState<EFinancialMovementStatus[]>();
  const [documentTypeFilter, setDocumentTypeFilter] = useState<string>();
  const [producerFilter, setProducerFilter] = useState<string>();
  const [initialLoad, setInitialLoad] = useState(false); // Flag para controle de carga inicial
  const [noResults, setNoResults] = useState(false); // Flag para controle de resultado vazio

  const loadRepositories = useCallback(
    async ({
      startDate,
      endDate,
      status,
      operation,
      documentType,
      producer,
      nextRows = false,
    }: ILoadRepositoriesProps) => {
      console.log('loadRepositories', {
        startDate,
        endDate,
        status,
        operation,
        documentType,
        producer,
        nextRows,
      });
      try {
        setLoading(true);
        setNoResults(false); // Reseta noResults ao fazer uma nova chamada
        setStartDateFilter(startDate);
        setEndDateFilter(endDate);
        setOperationFilter(operation);
        setStatusFilter(status);
        setDocumentTypeFilter(documentType);
        setProducerFilter(producer);

        let filter = `&producer=${producer || 'ALL'}`;
        if (startDate) {
          filter = `${filter}&expirationdatestart=${new Date(
            startDate.setHours(0, 0, 0, 0),
          ).toJSON()}`;
        }
        if (endDate) {
          filter = `${filter}&expirationdateend=${new Date(
            endDate.setHours(23, 59, 59, 999),
          ).toJSON()}`;
        }
        if (operation) {
          filter = `${filter}&operation=${operation}`;
        }
        if (status && status.length > 0) {
          filter = `${filter}&status=${status.join(',')}`;
        }
        if (documentType) {
          filter = `${filter}&documentType=${documentType}`;
        }

        const skip = nextRows ? data.length : 0;
        const response = await api.get(
          `financialmovement/list?skip=${skip}&limit=${limit}&sort=-expirationDate${filter}`,
        );
        //console.log(`financialmovement/list?skip=${skip}&limit=${limit}&sort=-expirationDate${filter}`);
        const newRows = response.data.rows;
        const allRowsCount = response.data.allRows;

        setAllRows(allRowsCount);
        if (nextRows) {
          setData(prevData => [...prevData, ...newRows]);
        } else {
          setData(newRows);
        }

        if (newRows.length === 0) {
          setNoResults(true); // Define noResults como true se não houver dados
        }
      } catch (error) {
        console.error('Erro ao carregar movimentações financeiras: ', error);
      } finally {
        setLoading(false);
        setReload(false);
      }
    },
    [data.length, limit],
  );

  // Efeito para carregar dados inicialmente
  useEffect(() => {
    if (!initialLoad && !noResults) {
      loadRepositories({
        startDate: startDateFilter,
        endDate: endDateFilter,
        operation: operationFilter,
        status: statusFilter,
        documentType: documentTypeFilter,
        producer: producerFilter,
      });
      setInitialLoad(true);
    }
  }, []);

  const renderFooter = useCallback(() => {
    if (!loading || data.length === 0) {
      return null;
    }
    return (
      <ActivityIndicator
        size="large"
        color={Colors.primary.blue}
        style={{marginTop: 32}}
      />
    );
  }, [loading, data.length]);

  const onRefresh = () => {
    setReload(true);
    setNoResults(false); // Reset noResults para permitir nova carga ao atualizar
    loadRepositories({
      startDate: startDateFilter,
      endDate: endDateFilter,
      operation: operationFilter,
      status: statusFilter,
      documentType: documentTypeFilter,
      producer: producerFilter,
    });
  };

  const handleFilter = useCallback(
    ({
      startDate,
      endDate,
      operation,
      status,
      documentType,
      producer,
    }: IOutFinancialMovimentFilters) => {
      setInitialLoad(false); // Reset a flag para permitir nova carga com filtros
      setNoResults(false); // Reset noResults para nova consulta
      loadRepositories({
        startDate,
        endDate,
        operation,
        status,
        documentType,
        producer,
      });
      console.log('handleFilter', {
        startDate,
        endDate,
        operation,
        status,
        documentType,
        producer,
      });
    },
    [],
  );

  const renderItem = (item: IFinancialMoviment, index: number) => (
    <Container>
      <CardFinancialMoviment
        key={(item._id || '').toString() + String(Date.now() * Math.random())}
        data={item}
        index={index}
      />
      {index === data.length - 1 ? (
        <View style={{height: 32, width: '100%'}} />
      ) : null}
    </Container>
  );

  const listEmptyComponent = () => (
    <CenteredFlex>
      <TextRegular size={32}>{translate('noItems')}</TextRegular>
    </CenteredFlex>
  );

  return (
    <>
      <Header showBackButton />
      {loading && data.length === 0 ? (
        <Loading />
      ) : (
        <FlatList
          data={data}
          ref={listRef}
          renderItem={({item, index}) => renderItem(item, index)}
          showsVerticalScrollIndicator={false}
          keyExtractor={item =>
            (item._id || '').toString() + String(Date.now() * Math.random())
          }
          refreshControl={
            <RefreshControl refreshing={reload} onRefresh={() => onRefresh()} />
          }
          refreshing={reload}
          onEndReached={() =>
            !noResults &&
            loadRepositories({
              startDate: startDateFilter,
              endDate: endDateFilter,
              operation: operationFilter,
              status: statusFilter,
              documentType: documentTypeFilter,
              nextRows: true,
            })
          }
          onEndReachedThreshold={0.5}
          ListEmptyComponent={!loading ? listEmptyComponent : null}
          ListFooterComponent={renderFooter}
          style={{paddingTop: 16}}
        />
      )}
      <FilterModalFinancialMoviment
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

export default FinancialMoviment;
