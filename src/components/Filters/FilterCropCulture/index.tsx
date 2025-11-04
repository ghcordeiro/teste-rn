import Loading from '@components/Loading';
import Select from '@components/Select';
import React, { useEffect, useState } from 'react';
import api from 'src/services/api';
import StorageService from 'src/services/storage';

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
 * Consultar todas culturas e safras dos ultimos 5 antes até os proximos 3 anos,
 * Retorna o ID com cultura+"-"+safra
 * Retorna "ALL-ALL", quanto selecionada a opção Todos.
 * Retorna "ALL-{SAFRA}", quanto selecionada a opção Todas as culturas da safra.
 * Retorna "{CULTURA}-ALL", quanto selecionada a opção Todas as Safras da Cultura.
 * @param key chave unica para o campo, caso o componente seja reutinizado, informar uma chave diferente.
 * @param returnObject Boolean, indica se deve retornar um objeto da lista de opções ou o id.
 * @method onLoading Return boolean se o componente está buscando a opção de culturas/safras do backend
 * @method onActionChange Return string com o id da cultura-safra, ou objeto
 * @returns (string | Object)
 */
const FilterCropCulture = ({
  key = 'default',
  onLoading = () => {},
  onActionChange = () => {},
  returnObject = false,
  allCropCulture = true
}: IPropsFilterCropCulture) => {
  const keyStorage = `ecooperativa@ContractCropCultureFilter@${key}`;
  const [loading, setLoading] = useState(true);

  const [options, setOptions] = useState<any[]>();
  const [filterValue, setFilterValue] = useState<any | undefined>();

  const loadOptions = async () => {
    setLoading(true);
    let newData: Array<IDataCropCultureProps> = [];
    let defaultFilter;
    try {
      const response = await api.get('salescontract/crop/list');

      const distinctCrop = (
        (response.data || []) as Array<IResponseCropCultureProps>
      )
        .map((c: IResponseCropCultureProps) => c.crop)
        .filter((value, index, self) => self.indexOf(value) === index);

      const distinctCulture = (
        (response.data || []) as Array<IResponseCropCultureProps>
      )
        .map((c: IResponseCropCultureProps) => c.culture)
        .filter((value, index, self) => self.indexOf(value) === index);
      response.data.forEach((e: IResponseCropCultureProps) => {
        newData.push({
          id: `${e.culture}-${e.crop}`,
          label: `${e.culture} - ${e.crop}`,
          ...e
        });
      });

      if (allCropCulture) {
        distinctCrop.forEach((c) => {
          newData.push({
            id: `ALL-${c}`,
            label: `TODAS CULTURAS - ${c}`,
            crop: c,
            culture: 'ALL'
          });
        });
        distinctCulture.forEach((c) => {
          newData.push({
            id: `${c}-ALL`,
            label: `${c} - TODAS SAFRAS`,
            crop: 'ALL',
            culture: c
          });
        });
        newData.push({
          id: `ALL-ALL`,
          label: `TODAS CULTURAS/SAFRAS`,
          crop: 'ALL',
          culture: 'ALL'
        });
      }
      newData = newData.sort((a, b) =>
        a.label < b.label ? 1 : b.label < a.label ? -1 : 0
      );
      const currentCropCultureFilter = await StorageService.getStorage(
        keyStorage
      );
      defaultFilter = newData.find(
        (f) => f.id.toString() === String(currentCropCultureFilter)
      );

      if (!defaultFilter) {
        defaultFilter = newData.find(
          (f) => f.crop.toString() === new Date().getFullYear().toString()
        );
      }

      setFilterValue(defaultFilter?.id);
      setOptions(newData);
    } catch (error) {
      console.error(error);
      setOptions([]);
    }
    if (defaultFilter?.id) {
      await StorageService.setStorage(keyStorage, defaultFilter?.id);
    } else {
      await StorageService.removeStorage(keyStorage);
    }

    onActionChange(defaultFilter?.id);
    setLoading(false);
    onLoading(false);
  };

  const handleOnActionChange = async (value: any) => {
    if (value) {
      await StorageService.setStorage(keyStorage, value);
    } else {
      await StorageService.removeStorage(keyStorage);
    }
    onActionChange(value);
  };

  useEffect(() => {
    loadOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        // <SimplePicker
        //   propertyValue="id"
        //   propertyLabel="label"
        //   defaultValue={filterValue || ''}
        //   options={options || []}
        //   key={key}
        //   name={`FilterCropCulture@${key}`}
        //   returnObject={returnObject}
        //   onActionChange={(value: any) => {
        //     setFilterValue(value);
        //     handleOnActionChange(value);
        //   }}
        // />
        <Select
          propertyValue="id"
          propertyLabel="label"
          defaultValue={filterValue || ''}
          options={options || []}
          key={key}
          name={`FilterCropCulture@${key}`}
          returnObject={returnObject}
          onActionChange={(value: any) => {
            setFilterValue(value);
            handleOnActionChange(value);
          }}
        />
      )}
    </>
  );
};
export default FilterCropCulture;
