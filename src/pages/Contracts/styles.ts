import Colors from '@colors';
import { defaultShadow } from '@globalStyle';
import styled from 'styled-components/native';

export const Container = styled.View`
  padding: 0 8px;
`;

export const Button = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 16px;
`;

export const ContainerContractPosition = styled.View`
  padding: 8px 8px;
  border-radius: 4px;
  background-color: ${Colors.white};
  margin: 8px 8px;
  ${defaultShadow()}
`;
