import styled from 'styled-components/native';
import Colors from '@colors';
import { height, normalizeHeight } from '@size';
import { defaultShadow } from '@globalStyle';

export const Container = styled.TouchableOpacity`
  background-color: ${Colors.white};
  border-radius: 8px;
  width: 100%;
  height: ${normalizeHeight(height * 0.09)}px;
  margin-bottom: 16px;
  ${defaultShadow()};
`;

export const Header = styled.View`
  width: 100%;
  height: ${normalizeHeight(32)}px;
  background-color: ${Colors.dark};
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  padding: 0 8px;
  justify-content: center;
`;

export const Body = styled.View`
  width: 100%;
  height: ${normalizeHeight(height * 0.09 - 32)}px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 0 8px;
`;
