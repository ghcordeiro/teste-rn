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

export interface IOutContractFilters {
  cropCulture: string;
  producer: string;
  status?: string[];
}
export interface ReciveProps {
  onHandleFilters?: (filters: IOutContractFilters) => void;
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

const FilterModalContract: React.ForwardRefRenderFunction<
  IFilterModalProps,
  ReciveProps
> = ({ onHandleFilters = () => {}, useExport = false }, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [filterCount, setFilterCount] = useState(0);
  const [producerValue, setProducerValue] = useState<any>();
  const [cropCultureValue, setCropCultureValue] = useState<any>();

  const [cropCultureOptions, setCropCultureOptions] = useState<
    ICropCultureOptions[]
  >([]);
  const [producerOptions, setProducerOptions] = useState<IProducerOptions[]>();
  const [statusOpenSelected, setStatusOpenSelected] = useState(false);
  const [statusFinishedSelected, setStatusFinishedSelected] = useState(false);
  const [statusValue, setStatusValue] = useState<string[]>([]);

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
    if (statusValue && statusValue.length > 0) {
      filter.push(`status=${statusValue.join(',')}`);
    }

    return filter;
  }, [cropCultureValue, producerValue, statusValue]);
  const sumFilterCount = useCallback(async () => {
    let count = 0;

    if (producerValue && producerValue.length > 0 && producerValue !== 'ALL') {
      count += 1;
    }
    if (cropCultureValue && cropCultureValue.length > 0) {
      count += 1;
    }
    setFilterCount(count);
  }, [cropCultureValue, producerValue]);

  const clearAllValues = useCallback(() => {
    setProducerValue(null);
    setCropCultureValue(null);
    setStatusOpenSelected(false);
    setStatusFinishedSelected(false);
    setStatusValue([]);
    setFilterCount(0);
  }, []);

  const actionExport = useCallback(() => {
    sumFilterCount();
    closeModal();
    const query = getFilters();
    downloadFile(
      `${api.defaults.baseURL}salescontract/download${
        query.length > 0 ? `?${query.join('&')}` : ''
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
    onHandleFilters({
      producer: producerValue,
      cropCulture: cropCultureValue
    });
    closeModal();
  }, [
    closeModal,
    sumFilterCount,
    onHandleFilters,
    producerValue,
    cropCultureValue
  ]);

  useEffect(() => {
    const statusSeleted: string[] = [];
    if (statusOpenSelected) statusSeleted.push('OPEN');
    if (statusFinishedSelected) statusSeleted.push('FINISHED');
    setStatusValue(statusSeleted);
  }, [statusOpenSelected, statusFinishedSelected]);

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

  const loadCropCultureOptions = async () => {
    let options: ICropCultureOptions[] = [];
    try {
      const response = await api.get<IDataCropCulture[]>(
        'salescontract/crop/list'
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

  useEffect(() => {
    loadProducerOptions();
    loadCropCultureOptions();
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
            {/**
            <TextDescription size={18}>
              Status para geração de arquivo
            </TextDescription>
            <ContainerPeriod>
              <FirstButtonPeriod
                activeOpacity={1}
                isFirst
                selected={statusOpenSelected}
                onPress={() => setStatusOpenSelected(!statusOpenSelected)}>
                <TextDescription selected={statusOpenSelected} size={18}>
                  Aberto
                </TextDescription>
              </FirstButtonPeriod>
              <ButtonPeriod
                activeOpacity={1}
                isFirst={false}
                selected={statusFinishedSelected}
                onPress={() =>
                  setStatusFinishedSelected(!statusFinishedSelected)
                }>
                <TextDescription selected={statusFinishedSelected} size={18}>
                  Finalizado
                </TextDescription>
              </ButtonPeriod>
            </ContainerPeriod>             
             */}
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

export default forwardRef(FilterModalContract);
