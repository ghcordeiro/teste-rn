import React, { useCallback, useEffect, useState } from 'react';
import Loading from 'src/components/Loading';
import Select from 'src/components/Select';
import api from 'src/services/api';
import StorageService from 'src/services/storage';

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
 * Consultar todos os cooperados que estão na lista de permissão do usuario,
 * Retorna o ID do produtor selecionado.
 * Retorna "ALL", quanto selecionada a opção Todos.
 * @param key => chave unica para o campo, caso o componente seja reutinizado, informar uma chave diferente.
 * @method onLoading => Return boolean se o componente está buscando a opção de produces do backend
 * @method onActionChange => Return string com o id do producer selecionado.
 * @returns (string) id do producer
 */
const FilterProducerPermission = ({
  key = 'default',
  onLoading = () => {},
  onActionChange = () => {}
}: IPropsFilterProducerPermission) => {
  const keyStorage = `ecooperativa@ContractProducerPermissionFilter@${key}`;
  const [loading, setLoading] = useState(true);

  const [options, setOptions] = useState<any[]>();
  const [filterValue, setFilterValue] = useState<any | undefined>();

  const loadOptions = useCallback(async () => {
    setLoading(true);
    onLoading(true);
    const newData: Array<IDataProducerProps> = [];
    let defaultFilter;
    try {
      const response = await api.get('session/producer/contract');
      response.data.forEach((e: IDataProducerProps) => {
        newData.push(e);
      });
      const currentProducerFilter = await StorageService.getStorage(keyStorage);
      defaultFilter = newData.find(
        (f) => f.id.toString() === String(currentProducerFilter)
      );
      if (!defaultFilter) {
        defaultFilter = newData.find((f) => f.id === 'ALL');
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
  }, [keyStorage, onActionChange, onLoading]);

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
  }, [loadOptions]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Select
          propertyValue="id"
          propertyLabel="name"
          defaultValue={filterValue || ''}
          options={options || []}
          key={key}
          name={`FilterProducerPermission@${key}`}
          onActionChange={(value: any) => {
            setFilterValue(value);
            handleOnActionChange(value);
          }}
        />
      )}
    </>
  );
};
export default FilterProducerPermission;
