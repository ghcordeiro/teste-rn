import Colors from '@colors';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
`;

export const DrawerContentView = styled.View`
  padding-top: 16px;
  flex: 6;
  flex-direction: column;
  background-color: ${Colors.ecoop.darkGray};
`;

export const DrawerContentViewBottom = styled.View`
  flex: 1;
  flex-direction: column;
  background-color: ${Colors.ecoop.darkGray};
`;

