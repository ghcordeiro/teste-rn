import EFinancialMovementStatus from '@enum/EFinancialMovementStatus';
import EFinancialStatementOperation from '@enum/EFinancialStatementOperation';
import { TextBold } from '@globalStyle';
import { useTranslation } from '@translate/hooks';
import React, { useState } from 'react';
import { View } from 'react-native';
import FilterPeriod from './FilterPeriod';
import FilterSituation from './FilterSituation';

type IFilterOptionsProps = {
  show: boolean;
  label: boolean;
};

export interface IFiltersShowProps {
  period?: IFilterOptionsProps;
  situation?: IFilterOptionsProps;
  stock?: IFilterOptionsProps;
  pickerContract?: IFilterOptionsProps;
}

export interface IArraysFilterProps {
  period: Array<string>;
  situation: Array<string>;
}

export interface IFilterSituationProps {
  operation: null | EFinancialStatementOperation;
  status: null | EFinancialMovementStatus;
}

export interface IFilterStockProps {
  text: null | string;
}
interface IFilters {
  handleFilter: (filters?: string) => void;
  filters: IFiltersShowProps;
}

const Filters = ({ handleFilter, filters }: IFilters) => {
  const { t } = useTranslation();
  const [arraysFilter, setArraysFilter] = useState<IArraysFilterProps>({
    period: [],
    situation: []
  });

  const onSumArrays = () => {
    const filter = [...arraysFilter.period, ...arraysFilter.situation];

    handleFilter(filter.join('&'));
  };

  const onHandleFilterPeriod = (filter: string) => {
    arraysFilter.period = [];
    if (filter.length > 0) {
      arraysFilter.period.push(filter);
    }
    setArraysFilter({
      period: arraysFilter.period,
      situation: arraysFilter.situation
    });

    onSumArrays();
  };

  const onHandleFilterSituation = (filter: IFilterSituationProps) => {
    arraysFilter.situation = [];
    if (filter.operation !== null) {
      arraysFilter.situation.push(`operation=${filter.operation}`);
    }
    if (filter.status !== null) {
      arraysFilter.situation.push(`status=${filter.status}`);
    }

    setArraysFilter({
      period: arraysFilter.period,
      situation: arraysFilter.situation
    });

    onSumArrays();
  };

  return (
    <View
      style={{
        marginTop: 4
      }}>
      {filters.period?.show && (
        <>
          {filters.period.label && (
            <TextBold size={12}>{t('period')}</TextBold>
          )}
          <FilterPeriod onHandleFilters={onHandleFilterPeriod} />
        </>
      )}

      {filters.situation?.show && (
        <>
          {filters.situation.label && (
            <TextBold size={12}>{t('situation')}</TextBold>
          )}
          <FilterSituation onHandleFilters={onHandleFilterSituation} />
        </>
      )}
    </View>
  );
};

export default Filters;
