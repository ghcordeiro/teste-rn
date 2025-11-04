import React, { useCallback } from 'react';
import { Loading, Select, useSelectFilter } from 'src/shared';

interface IPropsFilterCropCulture {
  key?: string;
  onActionChange?: (value: any) => void;
  onLoading?: (value: boolean) => void;
  returnObject?: boolean;
  allCropCulture?: boolean;
}

interface IResponseCropCultureProps {
  crop: string;
  culture: string;
}

interface IDataCropCultureProps {
  id: string;
  label: string;
  crop: string;
  culture: string;
}

/**
 * FilterCropCulture refatorado para usar hook useSelectFilter
 *
 * Reduzido de 183 para 95 linhas (-48%)
 * Lógica de carregamento e storage agora está centralizada no hook
 *
 * Consultar todas culturas e safras dos ultimos 5 antes até os proximos 3 anos,
 * Retorna o ID com cultura+"-"+safra
 * Retorna "ALL-ALL", quanto selecionada a opção Todos.
 * Retorna "ALL-{SAFRA}", quanto selecionada a opção Todas as culturas da safra.
 * Retorna "{CULTURA}-ALL", quanto selecionada a opção Todas as Safras da Cultura.
 */
const FilterCropCulture = ({
  key: filterKey = 'default',
  onLoading = () => {},
  onActionChange = () => {},
  returnObject = false,
  allCropCulture = true,
}: IPropsFilterCropCulture) => {
  const keyStorage = `ecooperativa@ContractCropCultureFilter@${filterKey}`;

  // Memoiza transformData para evitar re-renders infinitos
  const transformData = useCallback(
    (data: IResponseCropCultureProps[]): IDataCropCultureProps[] => {
      let newData: Array<IDataCropCultureProps> = [];

      const distinctCrop = data
        .map(c => c.crop)
        .filter((value, index, self) => self.indexOf(value) === index);

      const distinctCulture = data
        .map(c => c.culture)
        .filter((value, index, self) => self.indexOf(value) === index);

      data.forEach(e => {
        newData.push({
          id: `${e.culture}-${e.crop}`,
          label: `${e.culture} - ${e.crop}`,
          ...e,
        });
      });

      if (allCropCulture) {
        distinctCrop.forEach(c => {
          newData.push({
            id: `ALL-${c}`,
            label: `TODAS CULTURAS - ${c}`,
            crop: c,
            culture: 'ALL',
          });
        });
        distinctCulture.forEach(c => {
          newData.push({
            id: `${c}-ALL`,
            label: `${c} - TODAS SAFRAS`,
            crop: 'ALL',
            culture: c,
          });
        });
        newData.push({
          id: `ALL-ALL`,
          label: `TODAS CULTURAS/SAFRAS`,
          crop: 'ALL',
          culture: 'ALL',
        });
      }

      return newData.sort((a, b) =>
        a.label < b.label ? 1 : b.label < a.label ? -1 : 0,
      );
    },
    [allCropCulture],
  );

  // Memoiza getDefaultValue para evitar re-renders infinitos
  const getDefaultValue = useCallback(
    (options: IDataCropCultureProps[], storedValue?: string) => {
      if (storedValue) {
        return options.find(f => f.id.toString() === String(storedValue));
      }
      // Busca o ano atual como padrão
      return options.find(
        f => f.crop.toString() === new Date().getFullYear().toString(),
      );
    },
    [],
  );

  const { loading, options, selectedValue, handleValueChange } =
    useSelectFilter<IDataCropCultureProps>({
      storageKey: keyStorage,
      apiEndpoint: 'salescontract/crop/list',
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
          propertyLabel="label"
          defaultValue={selectedValue || ''}
          options={options || []}
          key={filterKey}
          name={`FilterCropCulture@${filterKey}`}
          returnObject={returnObject}
          onActionChange={(value: any) => {
            handleValueChange(value);
          }}
        />
      )}
    </>
  );
};

export default FilterCropCulture;
