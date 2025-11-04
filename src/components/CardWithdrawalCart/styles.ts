import Colors from '@colors';
import { defaultShadow } from '@globalStyle';
import { height, normalizeHeight } from '@size';
import styled from 'styled-components/native';

const containerHeight = normalizeHeight(height * 0.1);
const headerHeight = normalizeHeight(30);
const bodyHeight = containerHeight - headerHeight;

export const Container = styled.View`
  background-color: ${Colors.white};
  border-radius: 8px;
  width: 100%;
  margin-bottom: ${normalizeHeight(16)}px;
  ${defaultShadow()}
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
  height: ${bodyHeight}px;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  padding: ${normalizeHeight(8)}px 8px;
`;
