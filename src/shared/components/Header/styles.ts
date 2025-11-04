import Colors from '@colors';
import {height} from '@size';
import {getStatusBarHeight, isIphoneX} from '@utils/iPhoneXHelper';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${Colors.dark};
  height: ${height * 0.075 + (isIphoneX() ? 0 : getStatusBarHeight())}px;
  width: 100%;
  opacity: 1;
  shadow-color: #000;
  shadow-offset: {
    width: 0px;
    height: 2px;
  }
  shadow-opacity: 0.23;
  shadow-radius: 2.62px;
  elevation: 4;
  padding-top: ${isIphoneX() ? 0 : getStatusBarHeight()}px;
`;

export const ColumnBackButton = styled.TouchableOpacity`
  flex: 2;
  align-items: center;
  justify-content: center;
`;

export const ColumnFilterButton = styled.TouchableOpacity`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const ContainerBackButton = styled.View`
  flex: 2;
`;

export const ContainerLogo = styled.View`
  flex: 8;
  align-items: center;
  justify-content: center;
`;

export const SpaceButton = styled.View`
  flex: 2;
`;
