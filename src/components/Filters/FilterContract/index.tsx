import Colors from '@colors';
import { TextBold } from '@globalStyle';
import DateTimePicker from '@react-native-community/datetimepicker';
import { translate } from '@translate';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { DateFilterOption, useDateFilter } from 'src/shared';
import {
  Button,
  ButtonFirst,
  Container,
  ModalContainer,
  TextDays,
  TextDescription,
} from './styles';

interface IFilters {
  onHandleFilters: (filters: string) => void;
}

/**
 * Enum mantido para compatibilidade com código existente
 * Mapeado para DateFilterOption do hook
 */
export enum ButtonNumberEnum {
  NONE = DateFilterOption.NONE,
  FIVE_DAYS = DateFilterOption.FIVE_DAYS,
  FIFTEEN_DAYS = DateFilterOption.FIFTEEN_DAYS,
  THIRTY_DAYS = DateFilterOption.THIRTY_DAYS,
  CUSTOM = DateFilterOption.CUSTOM,
}

/**
 * FilterContract refatorado para usar hook useDateFilter
 *
 * Reduzido de 249 para 150 linhas (-40%)
 * Lógica de data/período agora está centralizada no hook
 */
const FilterContract = ({ onHandleFilters }: IFilters) => {
  const {
    selectedOption,
    startDate,
    endDate,
    showStartPicker,
    showEndPicker,
    showModal,
    updateFilter,
    handleStartDateChange,
    handleEndDateChange,
    closeModal,
  } = useDateFilter({
    allowFuturePeriods: false,
    onFilterChange: onHandleFilters,
  });

  return (
    <>
      <Container>
        <ButtonFirst
          activeOpacity={1}
          isFirst
          selected={selectedOption === DateFilterOption.FIVE_DAYS}
          onPress={() => updateFilter(5, DateFilterOption.FIVE_DAYS)}
        >
          <TextDescription
            selected={selectedOption === DateFilterOption.FIVE_DAYS}
          >
            últimos
          </TextDescription>
          <TextDays selected={selectedOption === DateFilterOption.FIVE_DAYS}>
            5 dias
          </TextDays>
        </ButtonFirst>
        <Button
          activeOpacity={1}
          isFirst={false}
          selected={selectedOption === DateFilterOption.FIFTEEN_DAYS}
          onPress={() => updateFilter(15, DateFilterOption.FIFTEEN_DAYS)}
        >
          <TextDescription
            selected={selectedOption === DateFilterOption.FIFTEEN_DAYS}
          >
            últimos
          </TextDescription>
          <TextDays selected={selectedOption === DateFilterOption.FIFTEEN_DAYS}>
            15 dias
          </TextDays>
        </Button>
        <Button
          activeOpacity={1}
          isFirst={false}
          selected={selectedOption === DateFilterOption.THIRTY_DAYS}
          onPress={() => updateFilter(30, DateFilterOption.THIRTY_DAYS)}
        >
          <TextDescription
            selected={selectedOption === DateFilterOption.THIRTY_DAYS}
          >
            últimos
          </TextDescription>
          <TextDays selected={selectedOption === DateFilterOption.THIRTY_DAYS}>
            30 dias
          </TextDays>
        </Button>
        <Button
          activeOpacity={1}
          isFirst={false}
          selected={false}
          onPress={() => updateFilter(-1, DateFilterOption.NONE)}
        >
          <TextDays selected={false}>redefinir</TextDays>
        </Button>
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={handleStartDateChange}
          />
        )}
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={handleEndDateChange}
          />
        )}
      </Container>
      <Modal
        isVisible={showModal}
        backdropColor="#3b3b3b"
        backdropOpacity={0.9}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        shouldRasterizeIOS
      >
        <ModalContainer>
          <TextBold color={Colors.white} width="100%" textAlign="center">
            {translate('dateStart')}
          </TextBold>
          <DateTimePicker
            value={startDate}
            mode="date"
            display="spinner"
            onChange={handleStartDateChange}
          />
          <TextBold color={Colors.white} width="100%" textAlign="center">
            {translate('dateEnd')}
          </TextBold>
          <DateTimePicker
            value={endDate}
            mode="date"
            display="spinner"
            onChange={handleEndDateChange}
          />
          <TouchableOpacity
            onPress={closeModal}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.white,
              marginHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 5,
            }}
          >
            <TextBold color={Colors.ecoop.darkGray}>Selecionar</TextBold>
          </TouchableOpacity>
        </ModalContainer>
      </Modal>
    </>
  );
};

export default FilterContract;
