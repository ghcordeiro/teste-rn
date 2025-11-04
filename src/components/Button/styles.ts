import {buttonSize, normalize} from '@size';
import {darken} from 'polished';
import FontAwesome from '@react-native-vector-icons/fontawesome';
import styled, {css} from 'styled-components/native';
import Colors from '../../assets/colors';

interface IButtonSize {
  size?: 'extraSmall' | 'small' | 'normal' | 'large';
  type?: 'normal' | 'outline';
}

export const Container = styled.TouchableOpacity<IButtonSize>`
  width: ${props =>
    buttonSize ? buttonSize[props.size || 'normal'].width : 100}%;
  height: ${props =>
    buttonSize ? buttonSize[props.size || 'normal'].height : normalize(50)}px;
  background: ${props =>
    props.type === 'normal'
      ? darken(0.15, Colors.ecoop.primary)
      : Colors.white};
  border-radius: 10px;
  margin-top: 8px;
  justify-content: center;
  align-items: center;
  :disabled {
    background: ${props =>
      props.type === 'normal'
        ? darken(0.25, Colors.ecoop.primary)
        : Colors.white};
  }
  ${props =>
    props.type === 'outline' &&
    css`
      border: 1px solid ${Colors.ecoop.primary};
    `}
`;

export const ContainerIconText = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ButtonText = styled.Text`
  color: ${Colors.white};
  font-size: ${normalize(18)}px;
  font-family: 'Roboto-Bold';
  font-weight: bold;
`;

export const ContainerIndicator = styled.TouchableOpacity`
  flex: 1;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  margin-top: 8px;
  justify-content: center;
  align-items: center;
  position: absolute;
  z-index: 10;
`;

export const Icon = styled(FontAwesome)`
  margin-right: 8px;
  width: auto;
`;
