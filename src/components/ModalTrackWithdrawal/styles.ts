import Colors from '@colors';
import {height, normalizeHeight, width} from '@size';
import {getBottomSpace, isIphoneX} from '@utils/iPhoneXHelper';
import styled from 'styled-components/native';

const containerHeight = normalizeHeight(
  height * 0.6 + (isIphoneX() ? getBottomSpace() : 0),
);
const headerHeight = normalizeHeight(30);
const bodyHeight = containerHeight - headerHeight;

export const ModalContainer = styled.View`
  position: absolute;
  bottom: ${-20 - (isIphoneX() ? getBottomSpace() : 0)}px;
  margin-left: -20px;
  width: ${width}px;
  height: ${containerHeight}px;
  background-color: ${Colors.default.bg};
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
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

  flex-direction: column;
  padding: ${normalizeHeight(8)}px 8px;
`;

export const BodyGroupText = styled.View`
  align-items: center;
  justify-content: center;
  padding: 0 8px;
`;

export const BodyGroupTextRow = styled.View`
  flex-direction: row; /* filhos em linha */
  align-items: flex-end; /* alinha na parte de baixo (eixo cruzado) */
  justify-content: flex-start; /* alinha à esquerda (eixo principal) */
  padding: 0 8px;
`;
