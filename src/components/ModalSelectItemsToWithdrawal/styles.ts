import Colors from '@colors';
import {normalize} from '@size';
import {darken} from 'polished';
import styled from 'styled-components/native';

export const ModalContainer = styled.View`
  flex: 1;
  padding: 0 16px;
  align-items: center;
  justify-content: center;
`;

export const Container = styled.View`
  width: 100%;
  background-color: ${Colors.white};
  border-radius: 8px;
  padding: 16px;
`;

export const Button = styled.TouchableOpacity`
  width: 100%;
  height: ${normalize(50)}px;
  background: ${darken(0.15, Colors.ecoop.primary)};
  border-radius: 10px;
  margin-top: 8px;
  justify-content: center;
  align-items: center;
`;
export const LabelValueWrapper = styled.View`
  margin: 4px 0;
`;

export const InputWrapper = styled.View`
  margin-top: 12px;
`;
