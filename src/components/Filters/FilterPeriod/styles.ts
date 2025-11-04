import Colors from '@colors';
import {defaultShadow} from '@globalStyle';
import {height, normalizeHeight, width} from '@size';
import {getBottomSpace, isIphoneX} from '@utils/iPhoneXHelper';
import styled from 'styled-components/native';

interface IPeriodProps {
  selected?: boolean;
  isFirst?: boolean;
}

export const Container = styled.View`
  min-height: 60px;
  max-height: 100px;
  width: 100%;
  flex-direction: row;
  border-radius: 5px;
  background-color: ${Colors.white};
  margin: 4px 0 16px 0;
  elevation: 10;
  ${defaultShadow()}
`;

export const ButtonFirst = styled.TouchableOpacity<IPeriodProps>`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.selected ? Colors.ecoop.darkGray : 'transparent'};
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;

export const Button = styled.TouchableOpacity<IPeriodProps>`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.selected ? Colors.ecoop.darkGray : 'transparent'};
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: ${props =>
    props.isFirst && props.selected ? 5 : 0}px;
  border-bottom-left-radius: ${props =>
    props.isFirst && props.selected ? 5 : 0}px;
`;

export const ButtonCalendar = styled.TouchableOpacity<IPeriodProps>`
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  background-color: ${props =>
    props.selected ? Colors.ecoop.darkGray : 'transparent'};
  border-top-right-radius: ${props => (props.selected ? 5 : 0)}px;
  border-bottom-right-radius: ${props => (props.selected ? 5 : 0)}px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
`;

export const TextDescription = styled.Text<IPeriodProps>`
  font-family: 'Lato-Regular';
  font-size: 12px;
  color: ${props => (props.selected ? Colors.white : Colors.default.text)};
`;

export const TextDays = styled.Text<IPeriodProps>`
  font-family: 'Lato-Regular';
  font-size: 16px;
  color: ${props => (props.selected ? Colors.white : Colors.default.text)};
`;

export const TextPeriod = styled.Text<IPeriodProps>`
  margin-left: 8px;
  font-family: 'Lato-Regular';
  font-size: 12px;
  color: ${props => (props.selected ? Colors.white : Colors.default.text)};
`;

export const ModalContainer = styled.View`
  position: absolute;
  bottom: ${-20 - (isIphoneX() ? getBottomSpace() : 0)}px;
  margin-left: -20px;
  width: ${width}px;
  height: ${normalizeHeight(
    height * 0.58 + (isIphoneX() ? getBottomSpace() : 0),
  )}px;
  background-color: ${Colors.ecoop.darkGray};
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  padding-top: 16px;
`;
