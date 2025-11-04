import Colors from '@colors';
import {defaultShadow} from '@globalStyle';
import styled from 'styled-components/native';

export const Body = styled.View`
  flex-direction: column;
  flex: 1;
  width: 100%;
  background-color: ${Colors.white};
  border-radius: 5px;
  ${defaultShadow()}
`;
