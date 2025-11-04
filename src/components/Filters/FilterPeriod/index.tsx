import React, { useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import Modal from 'react-native-modal';
import DateTimePicker, {
  AndroidEvent
} from '@react-native-community/datetimepicker';
import ajustDateStartEnd from '@utils/ajustDateStartEnd';
import Colors from '@colors';
import { TextBold } from '@globalStyle';
import { translate } from '@translate';
import { differenceInDays } from 'date-fns';
import { Icon } from 'src/components/Button/styles';
import {
  Button,
  ButtonCalendar,
  ButtonFirst,
  Container,
  ModalContainer,
  TextDays,
  TextDescription,
  TextPeriod
} from './styles';

interface IFilters {
  onHandleFilters: (filters: string) => void;
}

export enum ButtonNumberEnum {
  NONE,
  FIVE_DAYS,
  FIFTEEN_DAYS,
  THIRTY_DAYS,
  NEXT_FIVE_DAYS,
  NEXT_FIFTEEN_DAYS,
  NEXT_THIRTY_DAYS,
  CUSTOM
}

const FilterPeriod = ({ onHandleFilters }: IFilters) => {
  const [buttonSelect, setButtonSelect] = useState<ButtonNumberEnum>(
    ButtonNumberEnum.NONE
  );
  const [firstDate, setFirstDate] = useState(new Date());
  const [secondDate, setSecondDate] = useState(new Date());
  const [showFirst, setShowFirst] = useState(false);
  const [showSecond, setShowSecond] = useState(false);
  const [showFirstModal, setShowFirstModal] = useState(false);

  const updateDateFilters = (days: number, buttonNumber: ButtonNumberEnum) => {
    const lastDays = [
      ButtonNumberEnum.FIVE_DAYS,
      ButtonNumberEnum.FIFTEEN_DAYS,
      ButtonNumberEnum.THIRTY_DAYS
    ];
    const nextDays = [
      ButtonNumberEnum.NEXT_FIVE_DAYS,
      ButtonNumberEnum.NEXT_FIFTEEN_DAYS,
      ButtonNumberEnum.NEXT_THIRTY_DAYS
    ];
    let datas: Date[] = [];

    if (
      buttonSelect !== ButtonNumberEnum.CUSTOM &&
      buttonNumber === buttonSelect
    ) {
      // datas = [null, null];
      buttonNumber = -1;
    } else {
      if (buttonSelect === ButtonNumberEnum.CUSTOM) {
        datas = [firstDate, secondDate];
        setFirstDate(datas[0]);
        setSecondDate(datas[1]);
      } else if (lastDays.includes(buttonSelect)) {
        datas = [new Date(), new Date()];
        datas[0].setDate(datas[0].getDate() - days);
      } else if (nextDays.includes(buttonSelect)) {
        datas = [new Date(), new Date()];
        datas[1].setDate(datas[1].getDate() + days);
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

  const onChangeFirst = (_event: AndroidEvent, selectedDate?: Date) => {
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

  const onChangeSecond = (_event: AndroidEvent, selectedDate?: Date) => {
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

  const showCalendar = () => {
    if (Platform.OS === 'android') {
      setShowFirst(true);
    } else if (Platform.OS === 'ios') {
      setShowFirstModal(true);
    }
  };

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
        <ButtonCalendar
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
        </ButtonCalendar>
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
            display={Platform.OS === 'android' ? 'default' : 'compact'}
            onChange={onChangeFirst}
          />
        )}
        {showSecond && (
          <DateTimePicker
            value={secondDate}
            mode="date"
            display={Platform.OS === 'android' ? 'default' : 'compact'}
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
            display={Platform.OS === 'android' ? 'default' : 'compact'}
            onChange={onChangeFirst}
          />
          <TextBold color={Colors.white} width="100%" textAlign="center">
            {translate('dateEnd')}
          </TextBold>
          <DateTimePicker
            value={secondDate}
            mode="date"
            display={Platform.OS === 'android' ? 'default' : 'compact'}
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

export default FilterPeriod;
