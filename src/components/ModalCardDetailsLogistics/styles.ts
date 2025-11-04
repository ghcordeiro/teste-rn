import Colors from '@colors';
import {defaultShadow} from '@globalStyle';
import {height, normalizeHeight, width} from '@size';
import {getBottomSpace, isIphoneX} from '@utils/iPhoneXHelper';
import styled from 'styled-components/native';

export const ModalContainer = styled.View`
  position: absolute;
  bottom: ${-20 - (isIphoneX() ? getBottomSpace() : 0)}px;
  margin-left: -20px;
  width: ${width}px;
  height: ${normalizeHeight(
    height * 0.4 + (isIphoneX() ? getBottomSpace() : 0),
  )}px;
  background-color: ${Colors.white};
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

export const ContainerTimelineCard = styled.TouchableOpacity`
  padding: 16px;
  width: 100%;
  background-color: ${Colors.white};
  border-radius: 8px;
  margin-bottom: 16px;
  ${defaultShadow()}
`;
