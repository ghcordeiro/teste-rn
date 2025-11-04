import Colors from '@colors';
import {defaultShadow} from '@globalStyle';
import {normalize, normalizeHeight, width} from '@size';
import {getBottomSpace} from '@utils/iPhoneXHelper';
import {Pressable} from 'react-native';
import styled from 'styled-components/native';

interface IButtonProps {
  color: string;
  ml?: number;
}

export const ModalContainerFlex = styled.KeyboardAvoidingView`
  flex: 1;
  width: ${width - 2}px;
  bottom: -${getBottomSpace()}px;
`;

export const ModalContainerLayoutTop = styled.TouchableOpacity`
  flex: 1;
  width: 100%;
`;

export const ModalContainerLayout = styled.View`
  background-color: ${Colors.white};
  margin-left: ${-normalize(17)}px;
  width: 100%;
  flex: 4;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  padding: ${normalize(16)}px;
  padding-bottom: ${normalizeHeight(getBottomSpace() + 16)}px;
`;

export const ModalContainerHeader = styled.View`
  flex-direction: row;
  padding-right: ${normalize(10)}px;
  padding-left: ${normalize(10)}px;
  flex: 0.75;
`;

export const ModalContainerHeaderTitle = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const ModalContainerContent = styled.View`
  flex: 6;
`;

export const ModalContainerFooter = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 1;
`;
/**
 * RectButton não funciona com Modal no Android, como pode ser visto na issue abaixo:
 * https://github.com/software-mansion/react-native-gesture-handler/issues/500
 * Solução é utilizar Pressable
 */
export const HandleButtons = styled(Pressable)<IButtonProps>`
  flex: 1;
  height: ${normalize(36)}px;
  border-radius: ${normalize(5)}px;
  background-color: ${props => props.color};
  align-items: center;
  justify-content: center;
  margin-left: ${props => props.ml || 0}px;
`;

interface IPeriodProps {
  selected?: boolean;
  isFirst?: boolean;
  size?: number;
  row?: boolean;
}

export const ContainerPeriod = styled.View`
  min-height: 60px;
  max-height: 100px;
  width: 100%;
  flex-direction: row;
  border-radius: 5px;
  background-color: ${Colors.white};
  margin: 4px 0 4px 0;
  elevation: 10;
  ${defaultShadow()}
`;

export const FirstButtonPeriod = styled.TouchableOpacity<IPeriodProps>`
  flex: 1;
  ${props => props.row && 'flex-direction: row;'}
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.selected ? Colors.ecoop.darkGray : 'transparent'};
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;

export const ButtonPeriod = styled.TouchableOpacity<IPeriodProps>`
  flex: 1;
  ${props => props.row && 'flex-direction: row;'}
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

export const TextDescription = styled.Text<IPeriodProps>`
  font-family: 'Lato-Regular';
  font-size: ${props => props.size || 12}px;
  color: ${props => (props.selected ? Colors.white : Colors.default.text)};
`;

export const TextDays = styled.Text<IPeriodProps>`
  font-family: 'Lato-Regular';
  font-size: ${props => props.size || 16}px;
  color: ${props => (props.selected ? Colors.white : Colors.default.text)};
`;

export const TextPeriod = styled.Text<IPeriodProps>`
  margin-left: 8px;
  font-family: 'Lato-Regular';
  font-size: ${props => props.size || 12}px;
  color: ${props => (props.selected ? Colors.white : Colors.default.text)};
`;

export const ContainerButtonPeriod = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
