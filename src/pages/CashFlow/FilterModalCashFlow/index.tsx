import Colors from '@colors';
import Select from '@components/Select';
import {IFilterModalProps} from '@dtos/FilterModalProps';
import IMobileOptionsDTO from '@dtos/molibe-options';
import EFinancialStatementOperation from '@enum/EFinancialStatementOperation';
import {TextBold, TextRegular} from '@globalStyle';
import DateTimePicker from '@react-native-community/datetimepicker';
import capitalizeFirstLetter from '@utils/capitalizeFirstLetter';
import {addMonths, differenceInDays, format, lastDayOfMonth} from 'date-fns';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {Platform, View} from 'react-native';
import Modal from 'react-native-modal';
import api from 'src/services/api';
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

export interface IOutCashFlowFilters {
  operation?: EFinancialStatementOperation;
  status?: 'OPEN' | 'PARTIALPAID' | null;
  documentType?: string;
  producer?: string;
  expirationdateend?: Date;
  expirationdatenextperiod?: number;
}

interface IProducerOptions {
  id: string;
  name: string;
}

interface ReciveProps {
  onHandleFilters?: (filters: IOutCashFlowFilters) => Promise<void>;
  useExport?: boolean;
  currentFilters?: IOutCashFlowFilters;
}

const FilterModalCashFlow: React.ForwardRefRenderFunction<
  IFilterModalProps,
  ReciveProps
> = ({onHandleFilters, currentFilters}, ref) => {
  const modalRef = useRef(null);

  const [visible, setVisible] = useState(false);
  const [filterCount, setFilterCount] = useState(0);
  const [producerOptions, setProducerOptions] = useState<IProducerOptions[]>(
    [],
  );
  const [documentTypeOptions, setDocumentTypeOptions] = useState<
    IMobileOptionsDTO[]
  >([]);

  const [filters, setFilters] = useState<IOutCashFlowFilters>({});

  const [buttonSelect, setButtonSelect] = useState(-1);
  const [buttonOperationSelect, setButtonOperationSelect] =
    useState<EFinancialStatementOperation>(EFinancialStatementOperation.NONE);

  const [statusOpenSelected, setStatusOpenSelected] = useState(false);
  const [statusPartialPaidSelected, setStatusPartialPaidSelected] =
    useState(false);

  const [expirationDate, setExpirationDate] = useState<number>();

  const [firstDate, setFirstDate] = useState<Date>();
  const [isFirstDate, setIsFirstDate] = useState(false);

  const openModal = useCallback(() => {
    if (currentFilters) {
      setFilters(currentFilters);
      if (currentFilters.operation)
        setButtonOperationSelect(currentFilters.operation);
      if (currentFilters.status === 'OPEN') setStatusOpenSelected(true);
      if (currentFilters.status === 'PARTIALPAID')
        setStatusPartialPaidSelected(true);
    }
    setVisible(true);
  }, [currentFilters]);

  const closeModal = useCallback(() => {
    setVisible(false);
  }, []);

  useImperativeHandle(ref, () => ({
    openModal,
    closeModal,
    filterCount,
  }));

  const calculateFilterCount = useCallback(() => {
    let count = 0;
    if (filters.status) count++;
    if (filters.operation) count++;
    if (filters.expirationdateend || filters.expirationdatenextperiod) count++;
    if (filters.documentType) count++;
    if (filters.producer) count++;
    return count;
  }, [filters]);

  const clearAllValues = useCallback(() => {
    setFilters({});
    setButtonSelect(-1);
    setButtonOperationSelect(EFinancialStatementOperation.NONE);
    setStatusOpenSelected(false);
    setStatusPartialPaidSelected(false);
    setFirstDate(undefined);
    setExpirationDate(undefined);
    setFilterCount(0);
  }, []);

  const actionFilters = useCallback(() => {
    const count = calculateFilterCount();
    setFilterCount(count);
    onHandleFilters?.({
      ...filters,
      producer: filters.producer || 'ALL',
    });
    closeModal();
  }, [filters, calculateFilterCount, onHandleFilters, closeModal]);

  const setFilterField = (key: keyof IOutCashFlowFilters, value: any) => {
    setFilters(prev => ({...prev, [key]: value}));
  };

  const onSelectButtonOperation = (op: EFinancialStatementOperation) => {
    if (buttonOperationSelect === op) {
      setButtonOperationSelect(EFinancialStatementOperation.NONE);
      setFilterField('operation', undefined);
    } else {
      setButtonOperationSelect(op);
      setFilterField('operation', op);
    }
  };

  // Função modificada para selecionar data customizada
  const selectFirstDate = (date: Date) => {
    setFirstDate(date);
    setIsFirstDate(false);
    setFilterField('expirationdateend', date.toISOString());

    // Limpa a seleção de período pré-definido quando uma data customizada é selecionada
    setExpirationDate(undefined);
    setFilterField('expirationdatenextperiod', undefined);

    // Mantém apenas o botão de período customizado selecionado
    setButtonSelect(ButtonNumberEnum.CUSTOM);
  };

  useEffect(() => {
    if (statusOpenSelected) setFilterField('status', 'OPEN');
    else if (statusPartialPaidSelected) setFilterField('status', 'PARTIALPAID');
    else setFilterField('status', null);
  }, [statusOpenSelected, statusPartialPaidSelected]);

  useEffect(() => {
    api
      .get<IMobileOptionsDTO[]>('financialmovement/document-type/find')
      .then(res => {
        const options = [{key: 'ALL', value: 'ALL'}, ...res.data];
        setDocumentTypeOptions(options);
      });
    api
      .get<IProducerOptions[]>('session/producer/financial')
      .then(res => setProducerOptions(res.data));
  }, []);

  // Enum restaurado
  enum ButtonNumberEnum {
    NONE = 0,
    THIS_MONTH = 0,
    NEXT_THREE_MONTHS = 2,
    NEXT_SIX_MONTHS = 5,
    CUSTOM = 99,
  }

  // Função modificada para selecionar botões de período
  const onSelectButtonPeriod = async (buttonType: ButtonNumberEnum) => {
    const lastDays = [
      ButtonNumberEnum.THIS_MONTH,
      ButtonNumberEnum.NEXT_THREE_MONTHS,
      ButtonNumberEnum.NEXT_SIX_MONTHS,
    ];

    // Se o botão clicado já estiver selecionado, desmarque-o
    if (buttonSelect === buttonType) {
      setButtonSelect(ButtonNumberEnum.NONE);
      setExpirationDate(undefined);
      setFilterField('expirationdatenextperiod', undefined);
    }
    // Se for um dos botões de período pré-definido
    else if (lastDays.includes(buttonType)) {
      const dateSelect = addMonths(new Date(), buttonType.valueOf());
      const diffDiasAteData = differenceInDays(
        lastDayOfMonth(dateSelect),
        new Date(),
      );
      setExpirationDate(diffDiasAteData);
      setFilterField('expirationdatenextperiod', diffDiasAteData);

      // Limpa os valores de data customizada quando selecionar um botão de período
      setFirstDate(undefined);
      setFilterField('expirationdateend', undefined);

      setButtonSelect(buttonType);
    }
  };

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
              <ContainerPeriod>
                <FirstButtonPeriod
                  activeOpacity={1}
                  isFirst
                  selected={buttonSelect === ButtonNumberEnum.THIS_MONTH}
                  onPress={() =>
                    onSelectButtonPeriod(ButtonNumberEnum.THIS_MONTH)
                  }>
                  <TextDescription
                    selected={buttonSelect === ButtonNumberEnum.THIS_MONTH}>
                    mês
                  </TextDescription>
                  <TextDays
                    selected={buttonSelect === ButtonNumberEnum.THIS_MONTH}>
                    atual
                  </TextDays>
                </FirstButtonPeriod>
                <ButtonPeriod
                  activeOpacity={1}
                  isFirst={false}
                  selected={buttonSelect === ButtonNumberEnum.NEXT_THREE_MONTHS}
                  onPress={() =>
                    onSelectButtonPeriod(ButtonNumberEnum.NEXT_THREE_MONTHS)
                  }>
                  <TextDescription
                    selected={
                      buttonSelect === ButtonNumberEnum.NEXT_THREE_MONTHS
                    }>
                    próximos
                  </TextDescription>
                  <TextDays
                    selected={
                      buttonSelect === ButtonNumberEnum.NEXT_THREE_MONTHS
                    }>
                    3 meses
                  </TextDays>
                </ButtonPeriod>
                <ButtonPeriod
                  activeOpacity={1}
                  isFirst={false}
                  selected={buttonSelect === ButtonNumberEnum.NEXT_SIX_MONTHS}
                  onPress={() =>
                    onSelectButtonPeriod(ButtonNumberEnum.NEXT_SIX_MONTHS)
                  }>
                  <TextDescription
                    selected={
                      buttonSelect === ButtonNumberEnum.NEXT_SIX_MONTHS
                    }>
                    próximos
                  </TextDescription>
                  <TextDays
                    selected={
                      buttonSelect === ButtonNumberEnum.NEXT_SIX_MONTHS
                    }>
                    6 meses
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
                    // Se já estiver selecionado, desmarque
                    if (buttonSelect === ButtonNumberEnum.CUSTOM) {
                      setButtonSelect(ButtonNumberEnum.NONE);
                      setFirstDate(undefined);
                      setFilterField('expirationdateend', undefined);
                    } else {
                      // Caso contrário, abra o seletor de data e limpe qualquer seleção de botão de período
                      setIsFirstDate(true);
                      setButtonSelect(ButtonNumberEnum.CUSTOM);
                      // Limpe os valores de período pré-definido
                      setExpirationDate(undefined);
                      setFilterField('expirationdatenextperiod', undefined);
                    }
                  }}>
                  {buttonSelect !== ButtonNumberEnum.CUSTOM ? (
                    <TextDescription selected={false}>
                      Selecione um período
                    </TextDescription>
                  ) : (
                    <>
                      <ContainerButtonPeriod>
                        <TextDescription selected>Data final</TextDescription>
                        <TextDays selected>
                          {firstDate && format(firstDate, 'dd/MM/yyyy')}
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
                    onSelectButtonOperation(EFinancialStatementOperation.CREDIT)
                  }>
                  <TextDescription
                    selected={
                      buttonOperationSelect ===
                      EFinancialStatementOperation.CREDIT
                    }>
                    Recebimentos
                  </TextDescription>
                </FirstButtonPeriod>
                <ButtonPeriod
                  activeOpacity={1}
                  isFirst={false}
                  selected={
                    buttonOperationSelect === EFinancialStatementOperation.DEBIT
                  }
                  onPress={() =>
                    onSelectButtonOperation(EFinancialStatementOperation.DEBIT)
                  }>
                  <TextDescription
                    selected={
                      buttonOperationSelect ===
                      EFinancialStatementOperation.DEBIT
                    }>
                    Pagamentos
                  </TextDescription>
                </ButtonPeriod>
              </ContainerPeriod>

              <ContainerPeriod>
                <FirstButtonPeriod
                  activeOpacity={1}
                  isFirst
                  selected={statusOpenSelected}
                  onPress={() => setStatusOpenSelected(!statusOpenSelected)}>
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
                  }>
                  <TextDescription selected={statusPartialPaidSelected}>
                    Liquid. Parcial
                  </TextDescription>
                </ButtonPeriod>
              </ContainerPeriod>

              {producerOptions && producerOptions.length > 0 && (
                <Select
                  propertyValue="id"
                  propertyLabel="name"
                  defaultValue={filters.producer || 'ALL'}
                  options={producerOptions.map(a => ({
                    name: capitalizeFirstLetter(a.name),
                    id: a.id,
                  }))}
                  key="FilterProducer"
                  name="FilterProducer@FiancialMoviment"
                  onActionChange={(value: any) =>
                    setFilterField('producer', value)
                  }
                />
              )}

              {documentTypeOptions && documentTypeOptions.length > 0 && (
                <Select
                  propertyValue="key"
                  propertyLabel="value"
                  defaultValue={filters.documentType || 'ALL'}
                  options={documentTypeOptions}
                  key="FilterDocumentType"
                  name="FilterDocumentType@FiancialMoviment"
                  onActionChange={(value: any) =>
                    setFilterField('documentType', value)
                  }
                />
              )}
            </ModalContainerContent>
            <ModalContainerFooter>
              <HandleButtons
                color={Colors.warn.warn_1}
                onPress={clearAllValues}>
                <TextRegular>Limpar</TextRegular>
              </HandleButtons>
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
        style={{justifyContent: 'flex-end', margin: 0}}>
        <View
          style={{
            backgroundColor: Colors.white,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: 20,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              padding: 16,
              borderBottomWidth: 1,
              borderBottomColor: Colors.ecoop.gray,
            }}>
            <TextRegular onPress={() => setIsFirstDate(false)}>
              Cancelar
            </TextRegular>
            <TextBold>Selecionar Data</TextBold>
            <TextRegular
              onPress={() => {
                if (firstDate) {
                  selectFirstDate(firstDate);
                } else {
                  setIsFirstDate(false);
                }
              }}>
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
            <View style={{padding: 16, alignItems: 'center'}}>
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
    </>
  );
};

export default forwardRef(FilterModalCashFlow);
