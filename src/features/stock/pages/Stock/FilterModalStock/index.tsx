/* eslint-disable no-underscore-dangle */
import { TextBold, TextRegular } from '@globalStyle';
import { useTranslation } from '@translate/hooks';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import Modal from 'react-native-modal';

import Colors from '@colors';
import InputMask from '@components/InputMask';
import { IFilterModalProps } from '@dtos/FilterModalProps';
import { downloadFile } from '@utils/downloadFileToStorage';
import { Alert, Platform } from 'react-native';
import api from 'src/services/api';
import { Select } from 'src/shared';
import {
  HandleButtons,
  ModalContainerContent,
  ModalContainerFlex,
  ModalContainerFooter,
  ModalContainerHeader,
  ModalContainerHeaderTitle,
  ModalContainerLayout,
  ModalContainerLayoutTop,
} from './styles';

export interface IOutStockFilters {
  text: string;
  crop: string;
  culture: string;
}
export interface ReciveProps {
  onHandleFilters?: (filters: IOutStockFilters) => void;
  useExport?: boolean;
}

interface ICultureOptions {
  culture: string;
  description: string;
}

interface ICropOptions {
  crop: string;
  description: string;
}

const FilterModalStock: React.ForwardRefRenderFunction<
  IFilterModalProps,
  ReciveProps
> = ({ onHandleFilters = () => {}, useExport = false }, ref) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState<boolean>(false);
  const [filterCount, setFilterCount] = useState(0);
  const [textValue, setTextValue] = useState<any>();
  const [cropValue, setCropValue] = useState<any>();
  const [cultureValue, setCultureValue] = useState<any>();

  const [cropOptions, setCropOptions] = useState<ICropOptions[]>([]);
  const [cultureOptions, setCultureOptions] = useState<ICultureOptions[]>();

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
      filterCount,
    };
  });

  const sumFilterCount = useCallback(async () => {
    let count = 0;
    if (textValue && textValue.length > 0) {
      count += 1;
    }
    if (cropValue && cropValue.length > 0) {
      count += 1;
    }
    if (cultureValue && cultureValue.length > 0) {
      count += 1;
    }
    setFilterCount(count);
  }, [cropValue, cultureValue, textValue]);

  const clearAllValues = useCallback(() => {
    setTextValue(null);
    setCropValue(null);
    setCultureValue(null);
    setFilterCount(0);
  }, []);

  const actionExport = useCallback(() => {
    sumFilterCount();
    closeModal();

    let filter = '';
    if (textValue) {
      filter = `${filter}&q=${textValue}`;
    }
    if (cropValue && cropValue !== 'ALL') {
      filter = `${filter}&crop=${cropValue}`;
    }
    if (cultureValue && cultureValue !== 'ALL') {
      filter = `${filter}&culture=${cultureValue}`;
    }

    downloadFile(
      `${api.defaults.baseURL}orderstock/balance/download?${
        filter ? `&${filter}` : ''
      }`,
      'Posição de estoque',
      '.xlsx',
    ).catch((error: any) => {
      if (error.message === 'NO_DATA') {
        Alert.alert(
          'Atenção!',
          'A exportação não retornou dados para geração do arquivo!',
        );
      } else {
        Alert.alert(t('otherError'), error.message);
      }
    });
  }, [sumFilterCount, closeModal, textValue, cropValue, cultureValue]);

  const actionFilters = useCallback(() => {
    sumFilterCount();
    onHandleFilters({
      text: textValue,
      culture: cultureValue,
      crop: cropValue,
    });
    closeModal();
  }, [
    closeModal,
    sumFilterCount,
    onHandleFilters,
    cropValue,
    cultureValue,
    textValue,
  ]);

  const loadCropOptions = async () => {
    const options: ICropOptions[] = [];
    try {
      const response = await api.get<ICropOptions[]>('orderstock/crop/list');
      if (response.data && response.data.length > 0) {
        options.push({ crop: 'ALL', description: 'ALL' });
        response.data.forEach(value => {
          options.push({ crop: value.crop, description: value.crop });
        });
      }
    } catch (error) {
      console.error('loadCropOptions.Error: ', error);
    }
    setCropOptions(options);
  };

  const loadCultureOptions = async () => {
    const options: ICultureOptions[] = [];
    try {
      const response = await api.get<ICultureOptions[]>(
        'orderstock/culture/list',
      );
      if (response.data && response.data.length > 0) {
        options.push({ culture: 'ALL', description: 'ALL' });
        response.data.forEach(value => {
          options.push(value);
        });
      }
    } catch (error) {
      console.error('loadCultureOptions.Error: ', error);
    }
    setCultureOptions(options);
  };

  useEffect(() => {
    loadCropOptions();
    loadCultureOptions();
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
      shouldRasterizeIOS
    >
      <ModalContainerFlex
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled
      >
        <ModalContainerLayoutTop onPress={closeModal} />
        <ModalContainerLayout>
          <ModalContainerHeader>
            <ModalContainerHeaderTitle>
              <TextBold>Filtros</TextBold>
            </ModalContainerHeaderTitle>
          </ModalContainerHeader>
          <ModalContainerContent>
            <InputMask
              value={textValue}
              onChangeText={(value: any) => {
                setTextValue(value);
              }}
              icon="search"
              type="text"
              autoCapitalize="none"
              autoCorrect={false}
              observable
            />
            {cultureOptions && cultureOptions.length > 0 && (
              <Select
                propertyValue="culture"
                propertyLabel="description"
                defaultValue={cultureValue || 'ALL'}
                options={cultureOptions || []}
                key="FilterCulture"
                name="FilterCulture@orderStoke"
                onActionChange={(value: any) => {
                  setCultureValue(value);
                }}
              />
            )}
            {cropOptions && cropOptions.length > 0 && (
              <Select
                propertyValue="crop"
                propertyLabel="description"
                defaultValue={cropValue || 'ALL'}
                options={cropOptions || []}
                key="FilterCrop"
                name="FilterCrop@orderStoke"
                onActionChange={(value: any) => {
                  setCropValue(value);
                }}
              />
            )}
          </ModalContainerContent>
          <ModalContainerFooter>
            <HandleButtons color={Colors.warn.warn_1} onPress={clearAllValues}>
              <TextRegular>Limpar</TextRegular>
            </HandleButtons>
            {useExport && (
              <HandleButtons
                ml={8}
                color={Colors.blue.blue_1}
                onPress={actionExport}
              >
                <TextRegular color={Colors.white}>Exportar</TextRegular>
              </HandleButtons>
            )}
            <HandleButtons
              ml={8}
              color={Colors.success.success_1}
              onPress={actionFilters}
            >
              <TextRegular color={Colors.white}>Filtrar</TextRegular>
            </HandleButtons>
          </ModalContainerFooter>
        </ModalContainerLayout>
      </ModalContainerFlex>
    </Modal>
  );
};

export default forwardRef(FilterModalStock);
