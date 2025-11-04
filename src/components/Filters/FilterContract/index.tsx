import Colors from '@colors';
import { TextBold } from '@globalStyle';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { translate } from '@translate';
import ajustDateStartEnd from '@utils/ajustDateStartEnd';
import { differenceInDays } from 'date-fns';
import React, { useState } from 'react';
import { Platform, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import {
  Button,
  ButtonFirst,
  Container,
  ModalContainer,
  TextDays,
  TextDescription
} from './styles';

interface IFilters {
  onHandleFilters: (filters: string) => void;
}

export enum ButtonNumberEnum {
  NONE,
  FIVE_DAYS,
  FIFTEEN_DAYS,
  THIRTY_DAYS,
  CUSTOM
}

const FilterContract = ({ onHandleFilters }: IFilters) => {
  const [buttonSelect, setButtonSelect] = useState<ButtonNumberEnum>(
    ButtonNumberEnum.NONE
  );
  const [firstDate, setFirstDate] = useState(new Date());
  const [secondDate, setSecondDate] = useState(new Date());
  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [showFirstModal, setShowFirstModal] = useState(false);

  const updateDateFilters = (days: number, buttonNumber: ButtonNumberEnum) => {
    let datas = [];

    if (
      buttonSelect !== ButtonNumberEnum.CUSTOM &&
      buttonNumber === buttonSelect
    ) {
      datas = [null, null];
      buttonNumber = -1;
    } else {
      if (buttonSelect === ButtonNumberEnum.CUSTOM) {
        datas = [firstDate, secondDate];
        setFirstDate(datas[0]);
        setSecondDate(datas[1]);
      } else {
        datas = [new Date(), new Date()];
        datas[0].setDate(datas[0].getDate() - days);
      }
      ajustDateStartEnd(datas);
    }

    setButtonSelect(buttonNumber);

    onHandleFilters(
      `lastperiod=${differenceInDays(
        datas[1]?.getTime() || 0,
        datas[0]?.getTime() || 0
      )}`
    );
  };

  const onChangeFirst = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (_event.type === 'set') {
      const currentDate = selectedDate || firstDate;
      setShowFirst(Platform.OS === 'ios');
      setFirstDate(currentDate);
      setShowSecond(true);
    } else if (_event.type === 'dismissed') {
      setShowFirst(Platform.OS === 'ios');
    } else {
      const currentDate = selectedDate || firstDate;
      setFirstDate(currentDate);
    }
  };

  const onChangeSecond = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (_event.type === 'set') {
      const currentDate = selectedDate || secondDate;
      setShowSecond(Platform.OS === 'ios');
      setSecondDate(currentDate);
      updateDateFilters(0, ButtonNumberEnum.CUSTOM);
    } else if (_event.type === 'dismissed') {
      setShowSecond(Platform.OS === 'ios');
    } else {
      const currentDate = selectedDate || secondDate;
      setSecondDate(currentDate);
    }
  };

  // const showCalendar = () => {
  //   if (Platform.OS === 'android') {
  //     setShowFirst(true);
  //   } else if (Platform.OS === 'ios') {
  //     setShowFirstModal(true);
  //   }
  // };

  return (
    <>
      <Container>
        <ButtonFirst
          activeOpacity={1}
          isFirst
          selected={buttonSelect === ButtonNumberEnum.FIVE_DAYS}
          onPress={() => updateDateFilters(5, ButtonNumberEnum.FIVE_DAYS)}>
          <TextDescription
            selected={buttonSelect === ButtonNumberEnum.FIVE_DAYS}>
            últimos
          </TextDescription>
          <TextDays selected={buttonSelect === ButtonNumberEnum.FIVE_DAYS}>
            5 dias
          </TextDays>
        </ButtonFirst>
        <Button
          activeOpacity={1}
          isFirst={false}
          selected={buttonSelect === ButtonNumberEnum.FIFTEEN_DAYS}
          onPress={() => updateDateFilters(15, ButtonNumberEnum.FIFTEEN_DAYS)}>
          <TextDescription
            selected={buttonSelect === ButtonNumberEnum.FIFTEEN_DAYS}>
            últimos
          </TextDescription>
          <TextDays selected={buttonSelect === ButtonNumberEnum.FIFTEEN_DAYS}>
            15 dias
          </TextDays>
        </Button>
        <Button
          activeOpacity={1}
          isFirst={false}
          selected={buttonSelect === ButtonNumberEnum.THIRTY_DAYS}
          onPress={() => updateDateFilters(30, ButtonNumberEnum.THIRTY_DAYS)}>
          <TextDescription
            selected={buttonSelect === ButtonNumberEnum.THIRTY_DAYS}>
            últimos
          </TextDescription>
          <TextDays selected={buttonSelect === ButtonNumberEnum.THIRTY_DAYS}>
            30 dias
          </TextDays>
        </Button>
        {/* <ButtonCalendar
          activeOpacity={1}
          selected={buttonSelect === ButtonNumberEnum.CUSTOM}
          onPress={showCalendar}>
          <Icon
            name="calendar"
            color={
              buttonSelect === ButtonNumberEnum.CUSTOM
                ? Colors.white
                : Colors.default.text
            }
            size={18}
          />
          <View>
            <TextPeriod selected={buttonSelect === ButtonNumberEnum.CUSTOM}>
              escolher
            </TextPeriod>
            <TextPeriod selected={buttonSelect === ButtonNumberEnum.CUSTOM}>
              período
            </TextPeriod>
          </View>
        </ButtonCalendar> */}
        <Button
          activeOpacity={1}
          isFirst={false}
          selected={false}
          onPress={() => updateDateFilters(-1, -1)}>
          {/* <TextDescription selected={false}>últimos</TextDescription> */}
          <TextDays selected={false}>redefinir</TextDays>
        </Button>
        {showFirst && (
          <DateTimePicker
            value={firstDate}
            mode="date"
            display="default"
            onChange={onChangeFirst}
          />
        )}
        {showSecond && (
          <DateTimePicker
            value={secondDate}
            mode="date"
            display="default"
            onChange={onChangeSecond}
          />
        )}
      </Container>
      <Modal
        isVisible={showFirstModal}
        backdropColor="#3b3b3b"
        backdropOpacity={0.9}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}
        shouldRasterizeIOS>
        <ModalContainer>
          <TextBold color={Colors.white} width="100%" textAlign="center">
            {translate('dateStart')}
          </TextBold>
          <DateTimePicker
            value={firstDate}
            mode="date"
            display="spinner"
            onChange={onChangeFirst}
          />
          <TextBold color={Colors.white} width="100%" textAlign="center">
            {translate('dateEnd')}
          </TextBold>
          <DateTimePicker
            value={secondDate}
            mode="date"
            display="spinner"
            onChange={onChangeFirst}
          />
          <TouchableOpacity
            onPress={() => {
              setShowFirstModal(false);
              updateDateFilters(0, 4);
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.white,
              marginHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 5
            }}>
            <TextBold color={Colors.ecoop.darkGray}>Selecionar</TextBold>
          </TouchableOpacity>
        </ModalContainer>
      </Modal>
    </>
  );
};

export default FilterContract;
