import Colors from '@colors';
import {defaultShadow} from '@globalStyle';
import {normalize, normalizeHeight} from '@size';
import {getBottomSpace} from '@utils/iPhoneXHelper';
import styled from 'styled-components/native';

export const Container = styled.View``;

export const Touch = styled.TouchableOpacity`
  height: ${normalizeHeight(48)}px;
  background-color: ${Colors.white};
  padding: 0 8px;
  align-items: center;
  border-radius: 8px;
  font-size: ${normalize(18)}px;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
  ${defaultShadow()}
`;

export const Header = styled.View`
  height: ${normalizeHeight(40)}px;
  width: 100%;
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.default.bg};
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
`;

export const BackButton = styled.TouchableOpacity`
  height: ${normalizeHeight(40)}px;
  flex: 1.5;
  align-items: center;
  justify-content: center;
`;

export const CancelButton = styled.TouchableOpacity`
  height: ${normalizeHeight(40)}px;
  flex: 1.5;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
`;

export const Body = styled.View`
  padding-bottom: ${getBottomSpace()}px;
`;

export const Item = styled.TouchableOpacity`
  padding: 12px 8px;
  align-items: flex-start;
  justify-content: center;
  border-bottom-width: 1px;
  border-bottom-color: ${Colors.default.bg};
`;
