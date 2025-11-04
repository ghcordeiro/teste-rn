import { TextBold, TextRegular } from '@globalStyle';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTranslation } from '@translate/hooks';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import Modal from 'react-native-modal';

import Colors from '@colors';
import { IFilterModalProps } from '@dtos/FilterModalProps';
import IMobileOptionsDTO from '@dtos/molibe-options';
import EFinancialMovementStatus from '@enum/EFinancialMovementStatus';
import EFinancialStatementOperation from '@enum/EFinancialStatementOperation';
import { downloadFile } from '@utils/downloadFileToStorage';
import { format } from 'date-fns';
import { Alert, Dimensions, Platform, ScrollView, View } from 'react-native';
import api from 'src/services/api';
import { Select } from 'src/shared';
import {
  ButtonPeriod,
  ContainerButtonPeriod,
  ContainerPeriod,
  FirstButtonPeriod,
  HandleButtons,
  ModalContainerContent,
  ModalContainerFlex,
  ModalContainerFooter,
  ModalContainerHeader,
  ModalContainerHeaderTitle,
  ModalContainerLayout,
  ModalContainerLayoutTop,
  TextDays,
  TextDescription,
} from './styles';

enum ButtonNumberEnum {
  NONE = 0,
  FIVE_DAYS = -5,
  FIFTEEN_DAYS = -15,
  THIRTY_DAYS = -30,
  NEXT_FIVE_DAYS = 5,
  NEXT_FIFTEEN_DAYS = 15,
  NEXT_THIRTY_DAYS = 30,
  CUSTOM = 99,
}

export interface IOutFinancialMovimentFilters {
  startDate?: Date;
  endDate?: Date;
  operation?: EFinancialStatementOperation;
  status?: EFinancialMovementStatus[];
  documentType?: string;
  producer?: string;
}
interface IProducerOptions {
  id: string;
  name: string;
}
export interface ReciveProps {
  onHandleFilters?: (filters: IOutFinancialMovimentFilters) => void;
  useExport?: boolean;
}

const FilterModalFinancialMoviment: React.ForwardRefRenderFunction<
  IFilterModalProps,
  ReciveProps
> = ({ onHandleFilters = () => {}, useExport = false }, ref) => {
  const { t } = useTranslation();
  const modalRef = useRef(null);
  const [visible, setVisible] = useState<boolean>(false);
  const [filterCount, setFilterCount] = useState(0);
  const [buttonSelect, setButtonSelect] = useState<ButtonNumberEnum>(
    ButtonNumberEnum.NONE,
  );
  const [buttonOperationSelect, setButtonOperationSelect] =
    useState<EFinancialStatementOperation>(EFinancialStatementOperation.NONE);
  const [statusOpenSelected, setStatusOpenSelected] = useState(false);
  const [statusPartialPaidSelected, setStatusPartialPaidSelected] =
    useState(false);
  const [statusPaidSelected, setStatusPaidSelected] = useState(false);

  const [startDateValue, setStartDateValue] = useState<Date>(/** NullDate */);
  const [endDateValue, setEndDateValue] = useState<Date>(/* NullDate */);
  const [statusValue, setStatusValue] = useState<EFinancialMovementStatus[]>(
    [],
  );
  const [operationValue, setOperationValue] =
    useState<EFinancialStatementOperation>(/* EFinancialStatementOperation.NONE */);
  const [isFirstDate, setIsFirstDate] = useState(false);
  const [isSecondDate, setIsSecondDate] = useState(false);
  const [firstDate, setFirstDate] = useState<Date>();
  const [secondDate, setSecondDate] = useState<Date>();
  const [documentTypeValue, setDocumentTypeValue] = useState<any>();
  const [documentTypeOptions, setDocumentTypeOptions] = useState<
    IMobileOptionsDTO[]
  >([]);
  const [producerOptions, setProducerOptions] = useState<IProducerOptions[]>();
  const [producerValue, setProducerValue] = useState<any>();

  const screenHeight = Dimensions.get('window').height;

  const loadDocumentTypeOptions = async () => {
    const options: IMobileOptionsDTO[] = [];

    try {
      const response = await api.get<IMobileOptionsDTO[]>(
        'financialmovement/document-type/find',
      );

      if (response.data && response.data.length > 0) {
        options.push({ key: 'ALL', value: 'ALL' });
        response.data.forEach(value => {
          options.push({ key: value.key, value: value.value });
        });
      }
    } catch (error) {
      console.error('loadCropOptions.Error: ', error);
    }

    setDocumentTypeOptions(options);
  };

  const loadProducerOptions = async () => {
    const options: IProducerOptions[] = [];
    try {
      const response = await api.get<IProducerOptions[]>(
        'session/producer/financial',
      );
      if (response.data && response.data.length > 0) {
        response.data.forEach(value => {
          options.push(value);
        });
      }
    } catch (error) {
      console.error('loadProducerOptions.Error: ', error);
    }
    setProducerOptions(options);
  };
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
    if (statusValue && statusValue.length > 0) {
      count += 1;
    }
    if (operationValue) {
      count += 1;
    }
    if (startDateValue || endDateValue) {
      count += 1;
    }
    if (documentTypeValue && documentTypeValue.length > 0) {
      count += 1;
    }
    if (producerValue) {
      count += 1;
    }
    setFilterCount(count);
  }, [
    endDateValue,
    operationValue,
    startDateValue,
    statusValue,
    documentTypeValue,
    producerValue,
  ]);

  const clearAllValues = useCallback(() => {
    setStartDateValue(undefined);
    setEndDateValue(undefined);
    setFirstDate(undefined);
    setSecondDate(undefined);
    setButtonSelect(ButtonNumberEnum.NONE);
    setOperationValue(undefined);
    setButtonOperationSelect(EFinancialStatementOperation.NONE);
    setStatusValue([]);
    setStatusOpenSelected(false);
    setStatusPartialPaidSelected(false);
    setStatusPaidSelected(false);
    setDocumentTypeValue(undefined);
    setProducerValue(null);
    setFilterCount(0);
  }, []);

  const actionExport = useCallback(() => {
    sumFilterCount();
    closeModal();

    downloadFile(
      `${api.defaults.baseURL}financialmovement/download?producer=${
        producerValue || 'ALL'
      }&expirationdatestart=${startDateValue?.toJSON()}&expirationdateend=${endDateValue?.toISOString()}${
        operationValue ? `&operation=${operationValue}` : ''
      }${statusValue?.length > 0 ? `&status=${statusValue.join(',')}` : ''}
      ${documentTypeValue ? `&documentType=${documentTypeValue}` : ''}`,
      'Extrato Posição Financeira',
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
  }, [
    sumFilterCount,
    closeModal,
    startDateValue,
    endDateValue,
    operationValue,
    statusValue,
    documentTypeValue,
    producerValue,
  ]);

  const actionFilters = useCallback(() => {
    sumFilterCount();
    onHandleFilters({
      startDate: startDateValue,
      endDate: endDateValue,
      status: statusValue,
      operation: operationValue,
      documentType: documentTypeValue,
      producer: producerValue || 'ALL',
    });
    closeModal();
  }, [
    sumFilterCount,
    onHandleFilters,
    startDateValue,
    endDateValue,
    statusValue,
    operationValue,
    documentTypeValue,
    producerValue,
    closeModal,
  ]);

  const onSelectButtonPeriod = async (buttonType: ButtonNumberEnum) => {
    const lastDays = [
      ButtonNumberEnum.FIVE_DAYS,
      ButtonNumberEnum.FIFTEEN_DAYS,
      ButtonNumberEnum.THIRTY_DAYS,
    ];
    const nextDays = [
      ButtonNumberEnum.NEXT_FIVE_DAYS,
      ButtonNumberEnum.NEXT_FIFTEEN_DAYS,
      ButtonNumberEnum.NEXT_THIRTY_DAYS,
    ];
    const currentDate = new Date();
    if (buttonSelect === buttonType) {
      setStartDateValue(undefined);
      setEndDateValue(undefined);
      buttonType = ButtonNumberEnum.NONE;
    } else if (lastDays.includes(buttonType)) {
      setFirstDate(undefined);
      setSecondDate(undefined);

      setStartDateValue(
        new Date(currentDate.setDate(currentDate.getDate() + buttonType)),
      );
      setEndDateValue(new Date());
    } else if (nextDays.includes(buttonType)) {
      setFirstDate(undefined);
      setSecondDate(undefined);

      setStartDateValue(new Date());
      setEndDateValue(
        new Date(currentDate.setDate(currentDate.getDate() + buttonType)),
      );
    }
    setButtonSelect(buttonType);
  };

  const onSelectCustomPeriod = async (startDate?: Date, endDate?: Date) => {
    let buttonType = ButtonNumberEnum.NONE;
    /* if (buttonSelect === ButtonNumberEnum.CUSTOM) {
      setStartDateValue(undefined);
      setEndDateValue(undefined);
      buttonType = ButtonNumberEnum.NONE;
    } else */
    if (startDate && endDate) {
      setStartDateValue(startDate);
      setEndDateValue(endDate);
      buttonType = ButtonNumberEnum.CUSTOM;
    }
    setButtonSelect(buttonType);
  };

  const onSelectButtonOperation = async (
    buttonType: EFinancialStatementOperation,
  ) => {
    if (buttonOperationSelect === buttonType) {
      setOperationValue(undefined);
      buttonType = EFinancialStatementOperation.NONE;
    } else if (
      buttonType === EFinancialStatementOperation.CREDIT ||
      buttonType === EFinancialStatementOperation.DEBIT
    ) {
      setOperationValue(buttonType);
    }
    setButtonOperationSelect(buttonType);
  };
  useEffect(() => {
    const statusSeleted: EFinancialMovementStatus[] = [];
    if (statusOpenSelected) {
      statusSeleted.push(EFinancialMovementStatus.OPEN);
    }
    if (statusPartialPaidSelected) {
      statusSeleted.push(EFinancialMovementStatus.PARTIALPAID);
    }
    if (statusPaidSelected) {
      statusSeleted.push(EFinancialMovementStatus.PAID);
    }
    setStatusValue(statusSeleted);
  }, [statusOpenSelected, statusPartialPaidSelected, statusPaidSelected]);

  const selectFirstDate = (date: Date) => {
    setFirstDate(date);
    setIsFirstDate(false);
    setIsSecondDate(true);
  };

  const selectSecondDate = (date: Date) => {
    setSecondDate(date);
    setIsSecondDate(false);
    onSelectCustomPeriod(firstDate, secondDate);
  };

  useEffect(() => {
    loadProducerOptions();
    loadDocumentTypeOptions();
  }, []);

  return (
    <>
      <Modal
        ref={modalRef}
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
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 32 }}
              style={{ maxHeight: screenHeight * 0.85 }}
            >
              <ModalContainerHeader>
                <ModalContainerHeaderTitle>
                  <TextBold>Filtros</TextBold>
                </ModalContainerHeaderTitle>
              </ModalContainerHeader>
              <ModalContainerContent>
                <ContainerPeriod>
                  <FirstButtonPeriod
                    activeOpacity={1}
                    isFirst
                    selected={buttonSelect === ButtonNumberEnum.FIVE_DAYS}
                    onPress={() =>
                      onSelectButtonPeriod(ButtonNumberEnum.FIVE_DAYS)
                    }
                  >
                    <TextDescription
                      selected={buttonSelect === ButtonNumberEnum.FIVE_DAYS}
                    >
                      últimos
                    </TextDescription>
                    <TextDays
                      selected={buttonSelect === ButtonNumberEnum.FIVE_DAYS}
                    >
                      5 dias
                    </TextDays>
                  </FirstButtonPeriod>
                  <ButtonPeriod
                    activeOpacity={1}
                    isFirst={false}
                    selected={buttonSelect === ButtonNumberEnum.FIFTEEN_DAYS}
                    onPress={() =>
                      onSelectButtonPeriod(ButtonNumberEnum.FIFTEEN_DAYS)
                    }
                  >
                    <TextDescription
                      selected={buttonSelect === ButtonNumberEnum.FIFTEEN_DAYS}
                    >
                      últimos
                    </TextDescription>
                    <TextDays
                      selected={buttonSelect === ButtonNumberEnum.FIFTEEN_DAYS}
                    >
                      15 dias
                    </TextDays>
                  </ButtonPeriod>
                  <ButtonPeriod
                    activeOpacity={1}
                    isFirst={false}
                    selected={buttonSelect === ButtonNumberEnum.THIRTY_DAYS}
                    onPress={() =>
                      onSelectButtonPeriod(ButtonNumberEnum.THIRTY_DAYS)
                    }
                  >
                    <TextDescription
                      selected={buttonSelect === ButtonNumberEnum.THIRTY_DAYS}
                    >
                      últimos
                    </TextDescription>
                    <TextDays
                      selected={buttonSelect === ButtonNumberEnum.THIRTY_DAYS}
                    >
                      30 dias
                    </TextDays>
                  </ButtonPeriod>
                </ContainerPeriod>
                <ContainerPeriod>
                  <FirstButtonPeriod
                    activeOpacity={1}
                    isFirst
                    selected={buttonSelect === ButtonNumberEnum.NEXT_FIVE_DAYS}
                    onPress={() =>
                      onSelectButtonPeriod(ButtonNumberEnum.NEXT_FIVE_DAYS)
                    }
                  >
                    <TextDescription
                      selected={
                        buttonSelect === ButtonNumberEnum.NEXT_FIVE_DAYS
                      }
                    >
                      próximos
                    </TextDescription>
                    <TextDays
                      selected={
                        buttonSelect === ButtonNumberEnum.NEXT_FIVE_DAYS
                      }
                    >
                      5 dias
                    </TextDays>
                  </FirstButtonPeriod>
                  <ButtonPeriod
                    activeOpacity={1}
                    isFirst={false}
                    selected={
                      buttonSelect === ButtonNumberEnum.NEXT_FIFTEEN_DAYS
                    }
                    onPress={() =>
                      onSelectButtonPeriod(ButtonNumberEnum.NEXT_FIFTEEN_DAYS)
                    }
                  >
                    <TextDescription
                      selected={
                        buttonSelect === ButtonNumberEnum.NEXT_FIFTEEN_DAYS
                      }
                    >
                      próximos
                    </TextDescription>
                    <TextDays
                      selected={
                        buttonSelect === ButtonNumberEnum.NEXT_FIFTEEN_DAYS
                      }
                    >
                      15 dias
                    </TextDays>
                  </ButtonPeriod>
                  <ButtonPeriod
                    activeOpacity={1}
                    isFirst={false}
                    selected={
                      buttonSelect === ButtonNumberEnum.NEXT_THIRTY_DAYS
                    }
                    onPress={() =>
                      onSelectButtonPeriod(ButtonNumberEnum.NEXT_THIRTY_DAYS)
                    }
                  >
                    <TextDescription
                      selected={
                        buttonSelect === ButtonNumberEnum.NEXT_THIRTY_DAYS
                      }
                    >
                      próximos
                    </TextDescription>
                    <TextDays
                      selected={
                        buttonSelect === ButtonNumberEnum.NEXT_THIRTY_DAYS
                      }
                    >
                      30 dias
                    </TextDays>
                  </ButtonPeriod>
                </ContainerPeriod>
                <ContainerPeriod>
                  <FirstButtonPeriod
                    activeOpacity={1}
                    isFirst
                    row
                    selected={buttonSelect === ButtonNumberEnum.CUSTOM}
                    onPress={() => {
                      setIsFirstDate(true);
                    }}
                  >
                    {buttonSelect !== ButtonNumberEnum.CUSTOM ? (
                      <TextDescription selected={false}>
                        Selecione um período
                      </TextDescription>
                    ) : (
                      <>
                        <ContainerButtonPeriod>
                          <TextDescription
                            selected={buttonSelect === ButtonNumberEnum.CUSTOM}
                          >
                            Data inicial
                          </TextDescription>
                          <TextDays
                            selected={buttonSelect === ButtonNumberEnum.CUSTOM}
                          >
                            {firstDate && format(firstDate, 'dd/MM/yyyy')}
                          </TextDays>
                        </ContainerButtonPeriod>
                        <ContainerButtonPeriod>
                          <TextDescription
                            selected={buttonSelect === ButtonNumberEnum.CUSTOM}
                          >
                            Data final
                          </TextDescription>
                          <TextDays
                            selected={buttonSelect === ButtonNumberEnum.CUSTOM}
                          >
                            {secondDate && format(secondDate, 'dd/MM/yyyy')}
                          </TextDays>
                        </ContainerButtonPeriod>
                      </>
                    )}
                  </FirstButtonPeriod>
                </ContainerPeriod>
                <ContainerPeriod>
                  <FirstButtonPeriod
                    activeOpacity={1}
                    isFirst
                    selected={
                      buttonOperationSelect ===
                      EFinancialStatementOperation.CREDIT
                    }
                    onPress={() =>
                      onSelectButtonOperation(
                        EFinancialStatementOperation.CREDIT,
                      )
                    }
                  >
                    <TextDescription
                      selected={
                        buttonOperationSelect ===
                        EFinancialStatementOperation.CREDIT
                      }
                    >
                      Recebimentos
                    </TextDescription>
                  </FirstButtonPeriod>
                  <ButtonPeriod
                    activeOpacity={1}
                    isFirst={false}
                    selected={
                      buttonOperationSelect ===
                      EFinancialStatementOperation.DEBIT
                    }
                    onPress={() =>
                      onSelectButtonOperation(
                        EFinancialStatementOperation.DEBIT,
                      )
                    }
                  >
                    <TextDescription
                      selected={
                        buttonOperationSelect ===
                        EFinancialStatementOperation.DEBIT
                      }
                    >
                      Pagamentos
                    </TextDescription>
                  </ButtonPeriod>
                </ContainerPeriod>

                <ContainerPeriod>
                  <FirstButtonPeriod
                    activeOpacity={1}
                    isFirst
                    selected={statusOpenSelected}
                    onPress={() => setStatusOpenSelected(!statusOpenSelected)}
                  >
                    <TextDescription selected={statusOpenSelected}>
                      Aberto
                    </TextDescription>
                  </FirstButtonPeriod>
                  <ButtonPeriod
                    activeOpacity={1}
                    isFirst={false}
                    selected={statusPartialPaidSelected}
                    onPress={() =>
                      setStatusPartialPaidSelected(!statusPartialPaidSelected)
                    }
                  >
                    <TextDescription selected={statusPartialPaidSelected}>
                      Liquid. Parcial
                    </TextDescription>
                  </ButtonPeriod>
                  <ButtonPeriod
                    activeOpacity={1}
                    isFirst={false}
                    selected={statusPaidSelected}
                    onPress={() => setStatusPaidSelected(!statusPaidSelected)}
                  >
                    <TextDescription selected={statusPaidSelected}>
                      Liquidado
                    </TextDescription>
                  </ButtonPeriod>
                </ContainerPeriod>

                {producerOptions && producerOptions.length > 0 && (
                  <Select
                    propertyValue="id"
                    propertyLabel="name"
                    defaultValue={producerValue || 'ALL'}
                    options={producerOptions || []}
                    key="FilterProducer"
                    name="FilterProducer@FiancialMoviment"
                    onActionChange={(value: any) => {
                      setProducerValue(value);
                    }}
                  />
                )}

                {documentTypeOptions && documentTypeOptions.length > 0 && (
                  <Select
                    propertyValue="key"
                    propertyLabel="value"
                    defaultValue={documentTypeValue || 'ALL'}
                    options={documentTypeOptions || []}
                    key="FilterDocumentType"
                    name="FilterDocumentType@FiancialMoviment"
                    onActionChange={(value: any) => {
                      setDocumentTypeValue(value);
                    }}
                  />
                )}
              </ModalContainerContent>
            </ScrollView>
            <ModalContainerFooter>
              <HandleButtons
                color={Colors.warn.warn_1}
                onPress={() => {
                  clearAllValues();
                }}
              >
                <TextRegular>Limpar</TextRegular>
              </HandleButtons>
              {useExport && (
                <HandleButtons
                  ml={8}
                  color={Colors.blue.blue_1}
                  onPress={() => {
                    if (startDateValue && endDateValue) {
                      actionExport();
                    } else {
                      Alert.alert(
                        'Atenção',
                        'Selecione um período para exportar',
                      );
                    }
                  }}
                >
                  <TextRegular color={Colors.white}>Exportar</TextRegular>
                </HandleButtons>
              )}
              <HandleButtons
                ml={8}
                color={Colors.success.success_1}
                onPress={() => {
                  actionFilters();
                }}
              >
                <TextRegular color={Colors.white}>Filtrar</TextRegular>
              </HandleButtons>
            </ModalContainerFooter>
          </ModalContainerLayout>
        </ModalContainerFlex>
      </Modal>

      <Modal
        isVisible={isFirstDate}
        backdropColor="#3b3b3b"
        backdropOpacity={0.9}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={300}
        animationOutTiming={300}
        onBackdropPress={() => setIsFirstDate(false)}
        onBackButtonPress={() => setIsFirstDate(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <View
          style={{
            backgroundColor: Colors.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: 20,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: Colors.ecoop.gray,
            }}
          >
            <TextRegular onPress={() => setIsFirstDate(false)}>
              Cancelar
            </TextRegular>
            <TextBold>Selecionar Data Inicial</TextBold>
            <TextRegular
              onPress={() => {
                if (firstDate) {
                  selectFirstDate(firstDate);
                } else {
                  setIsFirstDate(false);
                }
              }}
            >
              Confirmar
            </TextRegular>
          </View>
          {Platform.OS === 'ios' ? (
            <DateTimePicker
              value={firstDate || new Date()}
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setFirstDate(selectedDate);
                }
              }}
            />
          ) : (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <DateTimePicker
                value={firstDate || new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setIsFirstDate(false);
                  if (event.type === 'set' && selectedDate) {
                    selectFirstDate(selectedDate);
                  }
                }}
              />
            </View>
          )}
        </View>
      </Modal>
      <Modal
        isVisible={isSecondDate}
        backdropColor="#3b3b3b"
        backdropOpacity={0.9}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={300}
        animationOutTiming={300}
        onBackdropPress={() => setIsSecondDate(false)}
        onBackButtonPress={() => setIsSecondDate(false)}
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <View
          style={{
            backgroundColor: Colors.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: 20,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: Colors.ecoop.gray,
            }}
          >
            <TextRegular onPress={() => setIsSecondDate(false)}>
              Cancelar
            </TextRegular>
            <TextBold>Selecionar Data Final</TextBold>
            <TextRegular
              onPress={() => {
                const dateToUse = secondDate || firstDate;
                if (dateToUse) {
                  selectSecondDate(dateToUse);
                  onSelectCustomPeriod(firstDate, dateToUse);
                } else {
                  setIsSecondDate(false);
                }
              }}
            >
              Confirmar
            </TextRegular>
          </View>
          {Platform.OS === 'ios' ? (
            <DateTimePicker
              value={secondDate || firstDate || new Date()}
              mode="date"
              display="spinner"
              minimumDate={firstDate}
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setSecondDate(selectedDate);
                }
              }}
            />
          ) : (
            <View style={{ padding: 16, alignItems: 'center' }}>
              <DateTimePicker
                value={secondDate || firstDate || new Date()}
                mode="date"
                display="default"
                minimumDate={firstDate}
                onChange={(event, selectedDate) => {
                  setIsSecondDate(false);
                  if (event.type === 'set' && selectedDate) {
                    selectSecondDate(selectedDate);
                    onSelectCustomPeriod(firstDate, selectedDate);
                  }
                }}
              />
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

export default forwardRef(FilterModalFinancialMoviment);
