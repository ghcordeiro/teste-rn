import Colors from '@colors';
import { RectButton } from 'react-native-gesture-handler';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import styled from 'styled-components/native';

interface IInputContainerProps {
  isFocused: boolean;
  isError: boolean;
}

export const Container = styled.KeyboardAvoidingView`
  flex: 1;
  align-items: center;
  justify-content: center;
  top: 0;
  background-color: ${Colors.ecoop.darkGray};
`;

export const Scroll = styled.ScrollView`
  flex: 1;
  height: 100%;
  width: 100%;
  padding: 0 16px;
`;

export const Form = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const ButtonSelect = styled.TouchableOpacity`
  height: 50px;
  width: 100%;
  background-color: ${Colors.primary.blue};
  align-items: center;
  justify-content: center;
  border-radius: 5px;
`;

export const ContainerButton = styled.View`
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  bottom: 0;
  position: absolute;
  width: 100%;
  margin-left: 16px;
`;

export const Icon = styled(AwesomeIcon)`
  flex: 2;
  margin-right: 8px;
`;

export const InputContainer = styled.View<IInputContainerProps>`
  width: 100%;
  height: 60px;
  padding: 0 8px;
  background: ${Colors.white};
  border-radius: 10px;
  margin-bottom: 8px;
  border-width: 3px;
  border-color: ${Colors.white};
  flex-direction: row;
  align-items: center;
  border-color: ${(props) =>
    // eslint-disable-next-line no-nested-ternary
    props.isFocused && !props.isError
      ? Colors.primary.blue
      : !props.isFocused && props.isError
      ? Colors.danger.danger_1
      : Colors.white};
`;
