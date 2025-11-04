import Colors from '@colors';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import CardFinancialStatement from '@components/CardFinancialStatement';
import Header from '@components/Header';
import Loading from '@components/Loading';
import { IFilterModalProps } from '@dtos/FilterModalProps';
import IFinancialStatement from '@dtos/financialStatement';
import { CenteredFlex, TextRegular } from '@globalStyle';
import { translate } from '@translate';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View
} from 'react-native';
import FloatingButton from 'src/components/Filters/FloatingButton';
import api from 'src/services/api';
import FilterModalFinancialStatement, {
  IOutFinancialStatementFilters
} from './FilterModalFinancialStatement';
import { Container } from './styles';

interface ILoadRepositoriesProps {
  startDate?: Date;
  endDate?: Date;
  nextRows?: boolean;
}

const FinancialStatement = () => {
  const listRef = useRef(null);
  const modalRef = useRef<IFilterModalProps>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [data, setData] = useState<Array<IFinancialStatement>>(
    [] as Array<IFinancialStatement>
  );
  const [limit] = useState(20);
  const [allRows, setAllRows] = useState(0);

  const [startDateFilter, setStartDateFilter] = useState<Date>();
  const [endDateFilter, setEndDateFilter] = useState<Date>();

  const loadRepositories = useCallback(
    async ({
      startDate,
      endDate,
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
        if (startDate) {
          filter = `${filter}&startdate=${new Date(
            startDate.setHours(0, 0, 0, 0)
          ).toJSON()}`;
        }
        if (endDate) {
          filter = `${filter}&enddate=${new Date(
            endDate.setHours(23, 59, 59, 999)
          ).toJSON()}`;
        }
        setStartDateFilter(startDate);
        setEndDateFilter(endDate);

        try {
          const response = await api.get(
            `financialstatement/list?skip=${
              currentData.length
            }&limit=${limit}&sort=-dateOf${filter ? `${filter}` : ''}`
          );

          setAllRows(response.data.allRows);
          setData([...currentData, ...response.data.rows]);
        } catch (error) {
          console.error('Request financialstatement/list.Error: ', error);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
        setReload(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    loadRepositories({
      startDate: startDateFilter,
      endDate: endDateFilter
    });
  }, [endDateFilter, loadRepositories, startDateFilter]);

  const renderItem = (item: IFinancialStatement, index: number) => (
    <Container>
      <CardFinancialStatement
        key={item.erpCode.toString() + String(Date.now() * Math.random())}
        data={item}
        index={index}
      />
      {index === data.length - 1 ? (
        <View style={{ height: 32, width: '100%' }} />
      ) : null}
    </Container>
  );

  const renderFooter = useCallback(() => {
    if (!loading) return null;

    return (
      <ActivityIndicator
        size="large"
        color={Colors.primary.blue}
        style={{ marginTop: 32 }}
      />
    );
  }, [loading]);

  const onRefresh = () => {
    setReload(true);
    loadRepositories({
      startDate: startDateFilter,
      endDate: endDateFilter
    });
  };

  const handleFilter = useCallback(
    ({ startDate, endDate }: IOutFinancialStatementFilters) => {
      loadRepositories({
        startDate,
        endDate
      });
    },
    [loadRepositories]
  );

  const listEmptyComponent = () => {
    return (
      <CenteredFlex>
        <TextRegular size={32}>{translate('noItems')}</TextRegular>
      </CenteredFlex>
    );
  };

  return (
    <>
      <Header showBackButton />
      {loading ? (
        <Loading />
      ) : (
        <>
          <FlatList
            data={data}
            ref={listRef}
            renderItem={({ item, index }) => renderItem(item, index)}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) =>
              item.erpCode.toString() + String(Date.now() * Math.random())
            }
            refreshControl={
              <RefreshControl
                refreshing={reload}
                onRefresh={() => onRefresh()}
              />
            }
            refreshing={reload}
            onEndReached={() =>
              loadRepositories({
                startDate: startDateFilter,
                endDate: endDateFilter,
                nextRows: true
              })
            }
            onEndReachedThreshold={0.3}
            ListEmptyComponent={listEmptyComponent}
            ListFooterComponent={() => renderFooter()}
            style={{ paddingTop: 16 }}
          />
        </>
      )}
      <FilterModalFinancialStatement
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

export default FinancialStatement;
