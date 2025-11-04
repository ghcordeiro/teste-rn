import React from 'react';
import { TextRegular } from '@globalStyle';

import { INote } from 'src/dtos/contract';
import { Container } from './styles';

interface ICardProps {
  data: INote;
}

const CardDetailsNFObs = ({ data }: ICardProps) => {
  return (
    <>
      <Container>
        <TextRegular>{data.note}</TextRegular>
      </Container>
    </>
  );
};

export default CardDetailsNFObs;
