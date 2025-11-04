import Colors from '@colors';
import {height, normalizeHeight, width} from '@size';
import styled from 'styled-components/native';

interface IContainerProps {
  mt: number;
}

export const Container = styled.View<IContainerProps>`
  height: ${props => normalizeHeight(height * 0.18 + props.mt * 4)}px;
  width: ${width}px;
`;

export const InternalContainer = styled.View`
  height: ${normalizeHeight(height * 0.18)}px;
  width: ${width}px;
  background-color: ${Colors.dark};
  border-bottom-left-radius: 25px;
  border-bottom-right-radius: 25px;
  padding: ${normalizeHeight(8)}px 16px;
`;

export const ButtonChangeUser = styled.TouchableOpacity`
  padding: 2px 0;
  border-radius: 4px;
`;
