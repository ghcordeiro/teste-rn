import Colors from '@colors';
import {height, normalizeHeight, width} from '@size';
import {getBottomSpace, isIphoneX} from '@utils/iPhoneXHelper';
import styled from 'styled-components/native';

export const ModalContainer = styled.View`
  position: absolute;
  bottom: ${-20 - (isIphoneX() ? getBottomSpace() : 0)}px;
  margin-left: -20px;
  width: ${width}px;
  height: ${normalizeHeight(
    height * 0.6 + (isIphoneX() ? getBottomSpace() : 0),
  )}px;
  background-color: ${Colors.default.bg};
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
`;

export const Container = styled.View`
  padding: 0 16px;
`;

export const Header = styled.View`
  width: 100%;
  height: ${normalizeHeight(32)}px;
  background-color: ${Colors.dark};
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  padding: 0 8px;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
`;
