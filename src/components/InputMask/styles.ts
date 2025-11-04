import styled, { css } from 'styled-components/native';

import Colors from '@colors';
import { defaultShadow } from '@globalStyle';
import { normalize } from '@size';
import { darken } from 'polished';
import FontAwesome from '@react-native-vector-icons/fontawesome';

interface ContainerProps {
  isFocused: boolean;
  isEnable: boolean;
  error: boolean | undefined;
  observable: boolean;
}

interface TextInputProps {
  error: boolean | undefined;
}

export const Container = styled.View<ContainerProps>`
  width: 100%;
  height: 60px;
  padding: 0 0 0 16px;
  background: ${props => (props.isEnable ? Colors.white : Colors.default.bg)};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  margin-bottom: 8px;
  border-width: ${props => (props.observable ? 0.5 : 0)}px;
  border-bottom-width: 8px;
  border-color: ${Colors.white};
  flex-direction: row;
  align-items: center;
  ${props =>
    props.isEnable && !props.observable
      ? props.isFocused &&
        !props.error &&
        css`
          border-color: ${darken(0.15, Colors.ecoop.primary)};
        `
      : css`
          border-color: ${Colors.ecoop.darkGray};
        `}
  ${props =>
    props.isEnable && !props.observable
      ? props.error &&
        css`
          border-color: ${Colors.danger.danger_0};
        `
      : css`
          border-color: ${Colors.ecoop.darkGray};
        `}
  ${defaultShadow()}
`;

export const InputText = styled.TextInput<TextInputProps>`
  flex: 10;
  font-size: ${normalize(16)}px;
  height: 100%;
  width: 100%;
  font-family: 'Lato-Regular';
  /* border-right-width: 1px;
  border-right-color: ${Colors.ecoop.gray}; */
`;

export const Icon = styled(FontAwesome)`
  flex: 1;
  margin-right: 8px;
  margin-left: 12px;
  width: auto;
`;
