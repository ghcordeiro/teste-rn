import Colors from '@colors';
import { TextBold } from '@globalStyle';
import convertAfterDot from '@utils/convertAfterDot';
import React from 'react';

import { Progress, Container } from './styles';

interface IProgressBarProps {
  value: number;
  isCard?: boolean;
}

const ProgressBar = ({ value, isCard = true }: IProgressBarProps) => {
  return (
    <Container>
      <Progress width={value} isCard={isCard} />
      <TextBold
        size={16}
        color={
          Math.floor(value * 100) / 100 < 66.66 ? Colors.dark : Colors.white
        }
        textAlign="center">
        {convertAfterDot(Math.floor(value * 100) / 100, 2)}%
      </TextBold>
    </Container>
  );
};

export default ProgressBar;
