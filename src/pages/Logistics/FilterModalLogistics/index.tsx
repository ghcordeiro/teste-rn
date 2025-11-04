/* eslint-disable no-underscore-dangle */
import { TextBold, TextRegular } from '@globalStyle';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState
} from 'react';
import Modal from 'react-native-modal';

import Colors from '@colors';
import { IFilterModalProps } from '@dtos/FilterModalProps';
import { downloadFile } from '@utils/downloadFileToStorage';
import { Alert, Platform } from 'react-native';
import Select from 'src/components/Select';
import api from 'src/services/api';
import {
  HandleButtons,
  ModalContainerContent,
  ModalContainerFlex,
  ModalContainerFooter,
  ModalContainerHeader,
  ModalContainerHeaderTitle,
  ModalContainerLayout,
  ModalContainerLayoutTop
} from './styles';

export interface IOutLogisticsFilters {
  cropCulture: string;
  producer: string;
  buyerCode?: string;
  placeNameId?: string;
  showHistory?: string;
}
export interface ReciveProps {
  onHandleFilters?: (filters: IOutLogisticsFilters) => void;
  useExport?: boolean;
}

interface IProducerOptions {
  id: string;
  name: string;
}
interface IDataCropCulture {
  crop: string;
  culture: string;
}
interface ICropCultureOptions {
  id: string;
  label: string;
  crop: string;
  culture: string;
}
interface IBuyerOptions {
  buyerCode: string;
  buyer: string;
}

interface IPlaceOptions {
  _id: string;
  placeName: string;
}

const FilterModalLogistics: React.ForwardRefRenderFunction<
  IFilterModalProps,
  ReciveProps
> = ({ onHandleFilters = () => { }, useExport = false }, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [filterCount, setFilterCount] = useState(0);
  const [producerValue, setProducerValue] = useState<any>();
  const [cropCultureValue, setCropCultureValue] = useState<any>();
  const [buyerValue, setBuyerValue] = useState<any>();
  const [placeValue, setPlaceValue] = useState<any>();
  const [historyValue, setHistoryValue] = useState<any>('false');

  const [cropCultureOptions, setCropCultureOptions] = useState<
    ICropCultureOptions[]
  >([]);
  const [producerOptions, setProducerOptions] = useState<IProducerOptions[]>();
  const [buyerOptions, setBuyerOptions] = useState<IBuyerOptions[]>();
  const [placeOptions, setPlaceOptions] = useState<IPlaceOptions[]>([]);
  const [historyOptions, setHistoryOptions] = useState([
    {
      label: 'EMBARCADOS HOJE',
      value: 'false'
    },
    {
      label: 'HISTÓRICO DE EMBARQUES',
      value: 'true'
    }
  ]);

  const openModal = useCallback(() => {
    setVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setVisible(false);
  }, []);

  useImperativeHandle(ref, () => {
    return {
      openModal,
      closeModal,
      filterCount
    };
  });
  /* Monta os filtros da consulta, consiedrando que todas as consultas tenham os mesmos parametros */
  const getFilters = useCallback((): string[] => {
    const filter: string[] = [];
    // if (producer && producer.length > 0) {
    filter.push(`producer=${producerValue || 'ALL'}`);
    // }
    if (cropCultureValue && cropCultureValue.length > 0) {
      if (cropCultureValue.split('-')[0] !== 'ALL') {
        filter.push(`culture=${cropCultureValue.split('-')[0]}`);
      }
      if (cropCultureValue.split('-')[1] !== 'ALL') {
        filter.push(`crop=${cropCultureValue.split('-')[1]}`);
      }
    }
    if (buyerValue && buyerValue.length > 0) {
      filter.push(`buyerCode=${buyerValue}`);
    }
    if (placeValue && placeValue.length > 0) {
      filter.push(`placeNameId=${placeValue}`);
    }
    filter.push(`showHistoryDelivery=${historyValue}`);

    return filter;
  }, [cropCultureValue, producerValue, buyerValue, historyValue, placeValue]);
  const sumFilterCount = useCallback(async () => {
    let count = 0;

    if (producerValue && producerValue.length > 0 && producerValue !== 'ALL') {
      count += 1;
    }
    if (cropCultureValue && cropCultureValue.length > 0) {
      count += 1;
    }
    if (buyerValue && buyerValue.length > 0) {
      count += 1;
    }
    if (placeValue && placeValue.length > 0) {
      count += 1;
    }
    setFilterCount(count);
  }, [cropCultureValue, producerValue, buyerValue, placeValue]);

  const clearAllValues = useCallback(() => {
    setProducerValue(null);
    setCropCultureValue(null);
    setBuyerValue(null);
    setPlaceValue(null);
    setHistoryValue('false')
    setFilterCount(0);
  }, []);

  const actionExport = useCallback(() => {
    sumFilterCount();
    closeModal();
    const query = getFilters();
    downloadFile(
      `${api.defaults.baseURL}salescontract/download${query.length > 0 ? `?${query.join('&')}` : ''
      }`,
      'Extrato Posição Contratos',
      '.xlsx'
    ).catch((error: any) => {
      if (error.message === 'NO_DATA') {
        Alert.alert(
          'Atenção!',
          'A exportação não retornou dados para geração do arquivo!'
        );
      } else {
        Alert.alert('Error', error.message);
      }
    });
  }, [sumFilterCount, closeModal, getFilters]);

  const actionFilters = useCallback(() => {
    sumFilterCount();
    console.log('call handleFilter - ', historyValue)
    onHandleFilters({
      producer: producerValue,
      cropCulture: cropCultureValue,
      buyerCode: buyerValue,
      placeNameId: placeValue,
      showHistory: historyValue
    });
    closeModal();
  }, [
    closeModal,
    sumFilterCount,
    onHandleFilters,
    producerValue,
    cropCultureValue,
    buyerValue,
    historyValue,
    placeValue
  ]);

  const loadProducerOptions = async () => {
    const options: IProducerOptions[] = [];
    try {
      const response = await api.get<IProducerOptions[]>(
        'session/producer/contract'
      );
      if (response.data && response.data.length > 0) {
        response.data.forEach((value) => {
          options.push(value);
        });
      }
    } catch (error) {
      console.error('loadProducerOptions.Error: ', error);
    }
    setProducerOptions(options);
  };

  const loadBuyerOptions = async () => {
    const options: IBuyerOptions[] = [];
    try {
      const response = await api.get<IBuyerOptions[]>(
        'salescontract-delivery/buyer/list'
      );
      if (response.data && response.data.length > 0) {
        options.push({
          buyer: 'TODOS COMPRADORES',
          buyerCode: 'ALL',
        })
        response.data.forEach((value) => {
          options.push(value);
        });
      }
    } catch (error) {
      console.error('loadBuyerOptions.Error: ', error);
    }
    setBuyerOptions(options);
  };

  const loadCropCultureOptions = async () => {
    let options: ICropCultureOptions[] = [];
    try {
      const response = await api.get<IDataCropCulture[]>(
        'salescontract-delivery/crop/list'
      );
      const { data = [] } = response;
      const distinctCrop = data
        .map((c: IDataCropCulture) => c.crop)
        .filter((value, index, self) => self.indexOf(value) === index);

      const distinctCulture = data
        .map((c: IDataCropCulture) => c.culture)
        .filter((value, index, self) => self.indexOf(value) === index);

      data.forEach((e: IDataCropCulture) => {
        options.push({
          id: `${e.culture}-${e.crop}`,
          label: `${e.culture} - ${e.crop}`,
          ...e
        });
      });
      distinctCrop.forEach((c) => {
        options.push({
          id: `ALL-${c}`,
          label: `TODAS CULTURAS - ${c}`,
          crop: c,
          culture: 'ALL'
        });
      });
      distinctCulture.forEach((c) => {
        options.push({
          id: `${c}-ALL`,
          label: `${c} - TODAS SAFRAS`,
          crop: 'ALL',
          culture: c
        });
      });
      options.push({
        id: `ALL-ALL`,
        label: `TODAS CULTURAS/SAFRAS`,
        crop: 'ALL',
        culture: 'ALL'
      });

      options = options.sort((a, b) =>
        a.label < b.label ? 1 : b.label < a.label ? -1 : 0
      );
    } catch (error) {
      console.error('loadCropCultureOptions.Error: ', error);
    }
    setCropCultureOptions(options);
  };

  const loadPlaces = async () => {
    const options: IPlaceOptions[] = [];
    try {
      const response = await api.get<IPlaceOptions[]>(
        '/salescontract-delivery/placename/list'
      );
      if (response.data && response.data.length > 0) {
        options.push({ _id: 'ALL', placeName: 'TODAS FAZENDAS' });
        response.data.forEach((value) => {
          options.push(value);
        });
      }
    } catch (error) {
      console.error('loadPlaces.Error: ', error);
    }
    setPlaceOptions(options);

  }

  useEffect(() => {
    loadProducerOptions();
    loadCropCultureOptions();
    loadBuyerOptions();
    loadPlaces();
  }, []);

  return (
    <Modal
      isVisible={visible}
      backdropColor="#3b3b3b"
      backdropOpacity={0.9}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={600}
      animationOutTiming={600}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      onBackButtonPress={() => setVisible(false)}
      onBackdropPress={() => setVisible(false)}
      shouldRasterizeIOS>
      <ModalContainerFlex
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled>
        <ModalContainerLayoutTop onPress={closeModal} />
        <ModalContainerLayout>
          <ModalContainerHeader>
            <ModalContainerHeaderTitle>
              <TextBold>Filtros</TextBold>
            </ModalContainerHeaderTitle>
          </ModalContainerHeader>
          <ModalContainerContent>
            <Select
              propertyValue="id"
              propertyLabel="name"
              defaultValue={producerValue || 'ALL'}
              options={producerOptions || []}
              key="FilterProducer"
              name="FilterProducer@salesContract"
              onActionChange={(value: any) => {
                setProducerValue(value);
              }}
            />
            <Select
              propertyValue="id"
              propertyLabel="label"
              defaultValue={cropCultureValue || 'ALL-ALL'}
              options={cropCultureOptions || []}
              key="FilterCropCulture"
              name="FilterCropCulture@salesContract"
              onActionChange={(value: any) => {
                setCropCultureValue(value);
              }}
            />
            <Select
              propertyValue="buyerCode"
              propertyLabel="buyer"
              defaultValue={buyerValue || 'ALL-ALL'}
              options={buyerOptions || []}
              key="FilterBuyer"
              name="FilterFilterBuyer@salesContract"
              onActionChange={(value: any) => {
                setBuyerValue(value);
              }}
            />
            <Select
              propertyValue="_id"
              propertyLabel="placeName"
              defaultValue={placeValue || 'ALL-ALL'}
              options={placeOptions || []}
              key="FilterPlace"
              name="FilterPlace@salesContract"
              onActionChange={(value: any) => {
                setPlaceValue(value);
              }}
            />
            <Select
              propertyValue="value"
              propertyLabel="label"
              defaultValue={historyValue || 'false'}
              options={historyOptions}
              key="FilterHistory"
              name="FilterHistory@salesContract"
              onActionChange={(value: any) => {
                console.log('value setHistory', value)
                setHistoryValue(value);
              }}
            />

          </ModalContainerContent>

          <ModalContainerFooter>
            <HandleButtons color={Colors.warn.warn_1} onPress={clearAllValues}>
              <TextRegular>Limpar</TextRegular>
            </HandleButtons>
            {useExport && (
              <HandleButtons
                ml={8}
                color={Colors.blue.blue_1}
                onPress={actionExport}>
                <TextRegular color={Colors.white}>Exportar</TextRegular>
              </HandleButtons>
            )}
            <HandleButtons
              ml={8}
              color={Colors.success.success_1}
              onPress={actionFilters}>
              <TextRegular color={Colors.white}>Filtrar</TextRegular>
            </HandleButtons>
          </ModalContainerFooter>
        </ModalContainerLayout>
      </ModalContainerFlex>
    </Modal>
  );
};

export default forwardRef(FilterModalLogistics);
