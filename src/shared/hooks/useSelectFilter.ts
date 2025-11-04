import { useCallback, useEffect, useRef, useState } from 'react';
import api from 'src/services/api';
import StorageService from 'src/services/storage';

/**
 * Configuração do hook useSelectFilter
 */
export interface UseSelectFilterConfig<T> {
  /**
   * Chave única para armazenamento local
   */
  storageKey: string;
  /**
   * Endpoint da API para buscar opções
   */
  apiEndpoint: string;
  /**
   * Função para transformar os dados da API em formato de opções
   */
  transformData: (data: any[]) => T[];
  /**
   * Função para encontrar o valor padrão
   */
  getDefaultValue?: (options: T[], storedValue?: string) => T | undefined;
  /**
   * Propriedade que contém o ID do item
   */
  idProperty: keyof T;
  /**
   * Callback quando o filtro é alterado
   */
  onFilterChange?: (value: any) => void;
  /**
   * Callback quando o loading muda
   */
  onLoadingChange?: (loading: boolean) => void;
}

/**
 * Hook para gerenciar filtros baseados em Select (API + Storage)
 * 
 * Unifica a lógica comum entre FilterCropCulture e FilterProducerPermission
 * Reduz duplicação de código e facilita manutenção
 */
export const useSelectFilter = <T extends Record<string, any>>(
  config: UseSelectFilterConfig<T>,
) => {
  const {
    storageKey,
    apiEndpoint,
    transformData,
    getDefaultValue,
    idProperty,
    onFilterChange,
    onLoadingChange,
  } = config;

  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<T[]>([]);
  const [selectedValue, setSelectedValue] = useState<any>();

  /**
   * Carrega as opções da API
   * 
   * Usa useRef para callbacks que podem mudar frequentemente
   * para evitar loops infinitos de re-render
   */
  const onFilterChangeRef = useRef(onFilterChange);
  const onLoadingChangeRef = useRef(onLoadingChange);
  const isInitialLoadRef = useRef(true);
  const initialValueSetRef = useRef(false); // Flag para saber se o valor inicial foi definido
  
  // Atualiza refs quando callbacks mudam
  useEffect(() => {
    onFilterChangeRef.current = onFilterChange;
    onLoadingChangeRef.current = onLoadingChange;
  }, [onFilterChange, onLoadingChange]);

  const loadOptions = useCallback(async () => {
    setLoading(true);
    onLoadingChangeRef.current?.(true);

    let initialValueToNotify: any = null; // Armazena o valor inicial para notificar após o loading

    try {
      const response = await api.get(apiEndpoint);
      const transformedData = transformData(response.data || []);
      setOptions(transformedData);

      // Busca valor armazenado
      const storedValue = await StorageService.getStorage(storageKey);

      // Encontra valor padrão
      const defaultOption = getDefaultValue
        ? getDefaultValue(transformedData, storedValue)
        : transformedData.find(
            (item) => String(item[idProperty]) === String(storedValue),
          ) ||
          transformedData.find((item) => String(item[idProperty]) === 'ALL');

      if (defaultOption) {
        const newValue = defaultOption[idProperty];
        // Só atualiza e chama callback se o valor mudou
        if (selectedValue !== newValue) {
          setSelectedValue(newValue);
          await StorageService.setStorage(storageKey, newValue);
          // Marca que o valor inicial foi definido e armazena para notificar depois
          if (isInitialLoadRef.current) {
            initialValueSetRef.current = true;
            initialValueToNotify = newValue; // Armazena o valor para notificar no finally
          }
          // Só chama o callback se não for o carregamento inicial
          // para evitar loops infinitos
          if (!isInitialLoadRef.current) {
            onFilterChangeRef.current?.(newValue);
          }
        }
      } else {
        if (selectedValue !== undefined) {
          setSelectedValue(undefined);
        }
        await StorageService.removeStorage(storageKey);
      }
    } catch (error) {
      console.error('Error loading filter options:', error);
      setOptions([]);
    } finally {
      setLoading(false);
      onLoadingChangeRef.current?.(false);
      
      // Se foi o carregamento inicial e um valor foi definido, chama o callback
      // Isso garante que os dados sejam carregados na primeira renderização
      if (isInitialLoadRef.current && initialValueSetRef.current && initialValueToNotify) {
        // Usa setTimeout para garantir que está no próximo ciclo de renderização
        // e evitar problemas com o estado ainda não atualizado
        setTimeout(() => {
          onFilterChangeRef.current?.(initialValueToNotify);
          initialValueSetRef.current = false; // Reseta a flag para não chamar novamente
        }, 0);
      }
      
      // Marca que o carregamento inicial foi concluído
      isInitialLoadRef.current = false;
    }
  }, [
    apiEndpoint,
    transformData,
    getDefaultValue,
    idProperty,
    storageKey,
    // Removidos onFilterChange e onLoadingChange das dependências
    // para evitar loops infinitos - usando refs em vez disso
  ]);

  /**
   * Handler para mudança de valor
   */
  const handleValueChange = useCallback(
    async (value: any) => {
      if (value) {
        await StorageService.setStorage(storageKey, value);
      } else {
        await StorageService.removeStorage(storageKey);
      }
      setSelectedValue(value);
      onFilterChange?.(value);
    },
    [storageKey, onFilterChange],
  );

  useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  return {
    loading,
    options,
    selectedValue,
    setSelectedValue,
    handleValueChange,
    reload: loadOptions,
  };
};

