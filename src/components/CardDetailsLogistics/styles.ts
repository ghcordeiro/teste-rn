import Colors from '@colors';
import {height, normalizeHeight} from '@size';
import styled from 'styled-components/native';

interface ICollumnProps {
  align: 'flex-start' | 'center' | 'flex-end';
}

interface IContainerStatusProps {
  backgoundColor: string;
}

const containerHeight = height * 0.03;
const headerHeight = 32;

export const Container = styled.TouchableOpacity`
  background-color: #dfdfdf;
  border-radius: 8px;
  width: 100%;
  justify-content: space-between;
  padding: 8px 12px;
  margin: 4px 0;
`;

export const Header = styled.View`
  width: 100%;
  height: ${normalizeHeight(headerHeight)}px;
  background-color: ${Colors.primary.blue};
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  padding: 0 8px;
  justify-content: center;
`;

export const Body = styled.View`
  width: 100%;
  flex-direction: row;
  height: ${normalizeHeight(containerHeight - headerHeight)}px;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
`;

export const Collumn = styled.View<ICollumnProps>`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  align-items: ${props => props.align};
  height: 100%;
  width: 100%;
`;

export const ContainerStatus = styled.View<IContainerStatusProps>`
  background-color: ${props => props.backgoundColor};
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  padding: 4px 8px;
  margin-right: 16px;
`;
