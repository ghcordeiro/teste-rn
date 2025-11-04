import Colors from '@colors';
import {defaultShadow} from '@globalStyle';
import {normalizeHeight} from '@size';
import returnRainbow from '@utils/returnRainbow';
import {Dimensions} from 'react-native';
import styled from 'styled-components/native';

interface ProgressBarProps {
  width: number;
}
const {height: screenHeight, fontScale} = Dimensions.get('window');
const containerHeight = normalizeHeight(screenHeight * (fontScale - 1));
const headerHeight = normalizeHeight(30);
const progressBarHeight = normalizeHeight(25);
const bodyHeight = containerHeight - progressBarHeight - headerHeight;

export const Container = styled.TouchableOpacity`
  background-color: ${Colors.white};
  border-radius: 8px;
  width: 100%;
  height: ${containerHeight}px;
  margin-bottom: ${normalizeHeight(16)}px;
  ${defaultShadow()}
`;

export const Header = styled.View`
  width: 100%;
  height: ${headerHeight}px;
  background-color: ${Colors.dark};
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  padding: 0 12px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

export const Body = styled.View`
  width: 100%;
  height: ${bodyHeight}px;
  justify-content: space-between;
  flex-direction: column;
  padding: ${normalizeHeight(8)}px 8px;
`;

export const BodyGroupText = styled.View`
  align-items: center;
  justify-content: center;
  padding: 0 8px;
`;

export const ProgressBar = styled.View<ProgressBarProps>`
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  width: ${props => `${props.width}%`};
  height: ${progressBarHeight}px;
  position: relative;
  border-bottom-right-radius: ${props =>
    props.width >= 98 && props.width <= 99 ? 4 : props.width > 99 ? 8 : 0}px;
  border-bottom-left-radius: 8px;
  background-color: ${props => returnRainbow(props.width)};
`;
