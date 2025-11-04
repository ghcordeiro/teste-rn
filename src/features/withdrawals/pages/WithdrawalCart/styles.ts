import Colors from '@colors';
import {defaultShadow} from '@globalStyle';
import {width} from '@size';
import styled from 'styled-components/native';

export const Container = styled.View`
  padding: 0 16px;
`;

export const ContainerEmptyComponent = styled.View`
  padding: 0 16px;
  align-items: center;
`;

export const ButtonActionContainer = styled.View`
  width: 100%;
  position: absolute;
  bottom: 1px;
`;

export const InternalButtonActionContainer = styled.View`
  ${defaultShadow()}
  background-color: ${Colors.white};
`;

export const SelectWrapper = styled.View`
  padding: 8px 8px 0px 8px;
  width: 100%;
  /* se houver layout em linha acima, isso garante que ocupe toda a linha */
  align-self: stretch;
`;

export const ButtonWrapper = styled.View`
  padding: 8px 8px 16px 8px;
  flex-direction: row;
  justify-content: space-between;
`;

export const FloatingButton = styled.TouchableOpacity`
  width: 56px;
  height: 56px;
  align-items: center;
  justify-content: center;
  left: ${width - 66}px;
  margin-bottom: 8px;
  background-color: ${Colors.white};
  border-radius: 28px;
  ${defaultShadow()}
  z-index: 1000;
`;
