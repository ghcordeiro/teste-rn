import Colors from '@colors';
import {defaultShadow} from '@globalStyle';
import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: ${Colors.white};
  border-radius: 5px;
  ${defaultShadow()}
`;
