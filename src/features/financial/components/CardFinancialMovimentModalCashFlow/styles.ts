import Colors from '@colors';
import {defaultShadow} from '@globalStyle';
import {height, normalizeHeight, scale} from '@size';
import styled from 'styled-components/native';

interface IContainerStatusProps {
  backgoundColor: string;
}

const containerHeight = height * 0.19;

export const Container = styled.View`
  background-color: ${Colors.white};
  border-radius: 8px;
  width: 100%;
  height: ${normalizeHeight(containerHeight) * -scale}px;
  margin-bottom: 16px;
  ${defaultShadow()};
`;

export const Header = styled.View`
  width: 100%;
  background-color: ${Colors.primary.blue};
  border-top-right-radius: 8px;
  border-top-left-radius: 8px;
  padding: 4px 8px;
  justify-content: center;
  flex: 1;
`;

export const Body = styled.View`
  display: flex;
  width: 100%;
  flex: 3;
  padding: 6px 8px;
`;

export const ContainerStatus = styled.View<IContainerStatusProps>`
  background-color: ${props => props.backgoundColor};
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
`;

export const WrapperStatus = styled.View`
  align-items: center;
  justify-content: center;
`;
