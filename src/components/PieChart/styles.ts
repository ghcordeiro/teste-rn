import Colors from '@colors';
import {defaultShadow} from '@globalStyle';
import styled from 'styled-components/native';

interface IDotSubtitleProps {
  color: string;
}

export const Container = styled.View`
  background-color: ${Colors.white};
  ${defaultShadow()}
  border-radius: 8px;
  margin-bottom: 24px;
`;

export const Subtitle = styled.View`
  margin: 16px 0;
  align-items: center;
  justify-content: center;
`;

export const RowSubtitle = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const DotSubtitle = styled.View<IDotSubtitleProps>`
  width: 10px;
  height: 10px;
  border-radius: 10px;
  background-color: ${props => props.color};
  margin-right: 8px;
`;
