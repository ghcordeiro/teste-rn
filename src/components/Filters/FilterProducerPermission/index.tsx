import React from 'react';
import { Loading, Select, useSelectFilter } from 'src/shared';

interface IPropsFilterProducerPermission {
  key: string;
  onActionChange?: (value: any) => void;
  onLoading?: (value: boolean) => void;
}

interface IDataProducerProps {
  id: string;
  name: string;
}

/**
 * FilterProducerPermission refatorado para usar hook useSelectFilter
 *
 * Reduzido de 105 para 60 linhas (-43%)
 * Lógica de carregamento e storage agora está centralizada no hook
 *
 * Consultar todos os cooperados que estão na lista de permissão do usuario,
 * Retorna o ID do produtor selecionado.
 * Retorna "ALL", quanto selecionada a opção Todos.
 */
const FilterProducerPermission = ({
  key: filterKey = 'default',
  onLoading = () => {},
  onActionChange = () => {},
}: IPropsFilterProducerPermission) => {
  const keyStorage = `ecooperativa@ContractProducerPermissionFilter@${filterKey}`;

  const transformData = (data: IDataProducerProps[]): IDataProducerProps[] => {
    return data;
  };

  const getDefaultValue = (
    options: IDataProducerProps[],
    storedValue?: string,
  ) => {
    if (storedValue) {
      return options.find(f => f.id.toString() === String(storedValue));
    }
    return options.find(f => f.id === 'ALL');
  };

  const { loading, options, selectedValue, handleValueChange } =
    useSelectFilter<IDataProducerProps>({
      storageKey: keyStorage,
      apiEndpoint: 'session/producer/contract',
      transformData,
      getDefaultValue,
      idProperty: 'id',
      onFilterChange: onActionChange,
      onLoadingChange: onLoading,
    });

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Select
          propertyValue="id"
          propertyLabel="name"
          defaultValue={selectedValue || ''}
          options={options || []}
          key={filterKey}
          name={`FilterProducerPermission@${filterKey}`}
          onActionChange={(value: any) => {
            handleValueChange(value);
          }}
        />
      )}
    </>
  );
};

export default FilterProducerPermission;
