import Colors from '@colors';
import {defaultShadow} from '@globalStyle';
import {normalizeHeight, width} from '@size';
import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  height: ${normalizeHeight(width / 6)}px;
  width: ${normalizeHeight(width / 6)}px;
  background-color: ${Colors.white};
  border-radius: 8px;
  align-items: center;
  justify-content: center;

  ${defaultShadow()}
`;
