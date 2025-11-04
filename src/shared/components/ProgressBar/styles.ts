import { normalizeHeight } from '@size';
import returnRainbow from '@utils/returnRainbow';
import styled from 'styled-components/native';

interface ProgressBarProps {
  width: number;
  isCard: boolean;
}

const progressBarHeight = normalizeHeight(25);

export const Container = styled.View`
  width: 100%;
  height: 30px;
  align-items: center;
  justify-content: center;
`;

export const Progress = styled.View<ProgressBarProps>`
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  width: ${(props) => `${props.width}%`};
  height: ${progressBarHeight}px;
  position: absolute;
  border-bottom-right-radius: ${(props) =>
    props.width >= 98 && props.width <= 99 ? 4 : props.width > 99 ? 8 : 0}px;
  border-bottom-left-radius: 8px;
  border-top-left-radius: ${(props) => (props.isCard ? 0 : 8)}px;
  border-top-right-radius: ${(props) => (props.isCard ? 0 : 8)}px;
  background-color: ${(props) => returnRainbow(props.width)};
`;
