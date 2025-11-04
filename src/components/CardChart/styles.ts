import Colors from '@colors';
import {defaultShadow} from '@globalStyle';
import {width} from '@size';
import styled from 'styled-components/native';

interface ISectionProps {
  flex?: number;
}

export const Container = styled.View`
  background-color: ${Colors.white};
  border-radius: 8px;
  padding: 16px;
  align-items: center;
  justify-content: center;
  width: ${width / 2 - 32}px;
  height: ${width / 2 - 48}px;
  ${defaultShadow()};
`;

export const Section = styled.View<ISectionProps>`
  flex: ${props => (props.flex ? props.flex + 1 : 1)};
  align-items: center;
  justify-content: center;
`;
