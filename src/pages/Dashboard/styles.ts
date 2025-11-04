import Colors from '@colors';
import {defaultShadow} from '@globalStyle';
import styled from 'styled-components/native';

interface IBodyProps {
  height: number;
}

export const Container = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

export const ContainerGraph = styled.View`
  height: 250px;
  background-color: ${Colors.white};
  padding: 0 16px;
  ${defaultShadow()}
`;

export const Body = styled.View<IBodyProps>`
  flex-direction: row;
  height: ${props => props.height}px;
  width: 100%;
`;

export const ButtonSelect = styled.TouchableOpacity`
  align-items: flex-start;
  justify-content: center;
  padding: 16px;
  width: 100%;
  background-color: ${Colors.ecoop.white};
  margin-bottom: 8px;
  border-radius: 8px;
  ${defaultShadow()}
`;

export const ContainerCards = styled.View`
  flex-direction: row;
  margin-top: 24px;
`;
