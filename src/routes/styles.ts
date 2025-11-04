import styled from 'styled-components/native';
import Colors from '@colors';

interface IScreenStyleProps {
  active: boolean;
}

export const Container = styled.View`
  align-items: center;
  background-color: ${Colors.primary.blue};
`;

export const ScreenContainer = styled.View`
  padding-top: 20px;
  width: 100%;
`;

export const ScreenStyle = styled.View<IScreenStyleProps>`
  height: 30px;
  margin-top: 2px;
  flex-direction: row;
  align-items: center;
  width: 100%;
  background-color: ${(props) =>
    props.active ? Colors.primary.lightBlue : Colors.primary.blue};
`;
