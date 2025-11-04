import Colors from '@colors';
import {normalize} from '@size';
import {getBottomSpace} from '@utils/iPhoneXHelper';
import {darken} from 'polished';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import styled, {css} from 'styled-components/native';

interface IInputContainerProps {
  isFocused: boolean;
  isError: boolean;
  isEnable: boolean;
}

interface TextInputProps {
  error: boolean | undefined;
}

export const Container = styled.KeyboardAvoidingView`
  flex: 1;
  align-items: center;
  justify-content: center;
  top: 0;
  background-color: ${Colors.ecoop.darkGray};
`;

export const ContainerSelect = styled.View`
  width: 100%;
  padding: 16px;
  align-items: center;
  justify-content: center;
`;

export const Scroll = styled.ScrollView`
  flex: 1;
  height: 100%;
  width: 100%;
  padding: 10px 16px;
`;

export const Form = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ButtonSelect = styled.TouchableOpacity`
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  width: 100%;
  background-color: ${darken(0.12, Colors.ecoop.primary)};
  margin-bottom: 8px;
  border-radius: 8px;
`;

export const ContainerButton = styled.View`
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  bottom: ${getBottomSpace()}px;
  position: absolute;
  width: 100%;
  margin-left: 16px;
`;

export const Icon = styled(FontAwesome)`
  flex: 2;
  margin-right: 8px;
`;

export const InputContainer = styled.View<IInputContainerProps>`
  width: 100%;
  height: 60px;
  padding: 0 8px;
  background: ${props => (props.isEnable ? Colors.white : Colors.default.gray)};
  border-radius: 10px;
  margin-bottom: 8px;
  border-width: 3px;
  border-color: ${Colors.white};
  flex-direction: row;
  align-items: center;
  border-color: ${props =>
    props.isEnable
      ? props.isFocused && !props.isError
        ? Colors.primary.blue
        : !props.isFocused && props.isError
        ? Colors.danger.danger_1
        : Colors.white
      : Colors.default.gray};
`;

export const InputText = styled.TextInput<TextInputProps>`
  flex: 12;
  font-size: ${normalize(16)}px;
  height: 100%;
  width: 100%;
  color: ${Colors.primary.lightBlue};
  ${props =>
    props.error &&
    css`
      color: ${Colors.danger.danger_0};
    `};
  font-family: 'Lato-Regular';
`;
