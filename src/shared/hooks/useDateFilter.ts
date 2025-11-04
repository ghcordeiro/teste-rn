import { useState } from 'react';
import { Platform } from 'react-native';
import DateTimePicker, {
  AndroidEvent,
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import ajustDateStartEnd from '@utils/ajustDateStartEnd';
import { differenceInDays } from 'date-fns';

/**
 * Enum para opções de período pré-definido
 */
export enum DateFilterOption {
  NONE = -1,
  FIVE_DAYS = 0,
  FIFTEEN_DAYS = 1,
  THIRTY_DAYS = 2,
  CUSTOM = 3,
  // Opções para períodos futuros (usado em FilterPeriod)
  NEXT_FIVE_DAYS = 4,
  NEXT_FIFTEEN_DAYS = 5,
  NEXT_THIRTY_DAYS = 6,
}

/**
 * Configuração do hook useDateFilter
 */
export interface UseDateFilterConfig {
  /**
   * Se true, permite períodos futuros (próximos X dias)
   */
  allowFuturePeriods?: boolean;
  /**
   * Callback quando o filtro é atualizado
   */
  onFilterChange: (filter: string) => void;
}

/**
 * Hook para gerenciar filtros de data/período
 * 
 * Unifica a lógica comum entre FilterPeriod e FilterContract
 * Reduz duplicação de código e facilita manutenção
 */
export const useDateFilter = (config: UseDateFilterConfig) => {
  const { allowFuturePeriods = false, onFilterChange } = config;

  const [selectedOption, setSelectedOption] = useState<DateFilterOption>(
    DateFilterOption.NONE,
  );
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showModal, setShowModal] = useState(false);

  /**
   * Atualiza o filtro baseado na opção selecionada
   */
  const updateFilter = (
    days: number,
    option: DateFilterOption,
  ) => {
    const lastDaysOptions = [
      DateFilterOption.FIVE_DAYS,
      DateFilterOption.FIFTEEN_DAYS,
      DateFilterOption.THIRTY_DAYS,
    ];
    const nextDaysOptions = [
      DateFilterOption.NEXT_FIVE_DAYS,
      DateFilterOption.NEXT_FIFTEEN_DAYS,
      DateFilterOption.NEXT_THIRTY_DAYS,
    ];

    let dates: (Date | null)[] = [];

    // Se o mesmo botão foi clicado novamente, desmarca
    if (
      selectedOption !== DateFilterOption.CUSTOM &&
      option === selectedOption
    ) {
      dates = [null, null];
      option = DateFilterOption.NONE;
    } else {
      if (selectedOption === DateFilterOption.CUSTOM) {
        dates = [startDate, endDate];
        setStartDate(dates[0]);
        setEndDate(dates[1]);
      } else if (lastDaysOptions.includes(selectedOption)) {
        dates = [new Date(), new Date()];
        dates[0].setDate(dates[0].getDate() - days);
      } else if (
        allowFuturePeriods &&
        nextDaysOptions.includes(selectedOption)
      ) {
        dates = [new Date(), new Date()];
        dates[1].setDate(dates[1].getDate() + days);
      } else if (lastDaysOptions.includes(option as DateFilterOption)) {
        dates = [new Date(), new Date()];
        dates[0].setDate(dates[0].getDate() - days);
      } else if (
        allowFuturePeriods &&
        nextDaysOptions.includes(option as DateFilterOption)
      ) {
        dates = [new Date(), new Date()];
        dates[1].setDate(dates[1].getDate() + days);
      }

      if (dates.length > 0 && dates[0] && dates[1]) {
        ajustDateStartEnd(dates);
      }
    }

    setSelectedOption(option);

    const filterString = dates.length > 0 && dates[0] && dates[1]
      ? `lastperiod=${differenceInDays(
          dates[1].getTime(),
          dates[0].getTime(),
        )}`
      : '';

    onFilterChange(filterString);
  };

  /**
   * Handler para mudança da data inicial
   */
  const handleStartDateChange = (
    event: AndroidEvent | DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (event.type === 'set') {
      const currentDate = selectedDate || startDate;
      setShowStartPicker(Platform.OS === 'ios');
      setStartDate(currentDate);
      setShowEndPicker(true);
    } else if (event.type === 'dismissed') {
      setShowStartPicker(Platform.OS === 'ios');
    } else {
      const currentDate = selectedDate || startDate;
      setStartDate(currentDate);
    }
  };

  /**
   * Handler para mudança da data final
   */
  const handleEndDateChange = (
    event: AndroidEvent | DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (event.type === 'set') {
      const currentDate = selectedDate || endDate;
      setShowEndPicker(Platform.OS === 'ios');
      setEndDate(currentDate);
      updateFilter(0, DateFilterOption.CUSTOM);
    } else if (event.type === 'dismissed') {
      setShowEndPicker(Platform.OS === 'ios');
    } else {
      const currentDate = selectedDate || endDate;
      setEndDate(currentDate);
    }
  };

  /**
   * Abre o seletor de calendário (comportamento diferente por plataforma)
   */
  const openCalendar = () => {
    if (Platform.OS === 'android') {
      setShowStartPicker(true);
    } else if (Platform.OS === 'ios') {
      setShowModal(true);
    }
  };

  /**
   * Fecha o modal e aplica o filtro customizado
   */
  const closeModal = () => {
    setShowModal(false);
    updateFilter(0, DateFilterOption.CUSTOM);
  };

  return {
    // Estado
    selectedOption,
    startDate,
    endDate,
    showStartPicker,
    showEndPicker,
    showModal,

    // Setters
    setStartDate,
    setEndDate,
    setShowStartPicker,
    setShowEndPicker,
    setShowModal,

    // Handlers
    updateFilter,
    handleStartDateChange,
    handleEndDateChange,
    openCalendar,
    closeModal,
  };
};

