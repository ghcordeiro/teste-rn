import React, { useRef } from 'react';
import { TextRegular } from '@globalStyle';
import convertCurrency from '@utils/convertCurrency';
import convertData from '@utils/convertData';

import { IAdvance } from 'src/dtos/contract';
import { Container } from './styles';
import ModalCardDetailsAdvance, {
  IModalCardDetailsAdvanceProps
} from '../ModalCardDetailsAdvance';

interface ICardProps {
  data: IAdvance;
  index: number;
  contractId: string;
}

const CardDetailsAdvance = ({ data, index, contractId }: ICardProps) => {
  const modalRef = useRef<IModalCardDetailsAdvanceProps>(null);

  const handleOpenModal = () => {
    modalRef.current?.openModal();
  };
  return (
    <>
      <Container key={`${data._id}-${index}`} onPress={handleOpenModal}>
        <TextRegular width="30%" size={12}>
          DOC {data.document}
        </TextRegular>
        <TextRegular width="32%" textAlign="center" size={12}>
          {convertData(new Date(data.dateOf).getTime(), '/')}
        </TextRegular>
        <TextRegular width="38%" textAlign="right" size={12}>
          {convertCurrency(data.amount)}
        </TextRegular>
      </Container>
      <ModalCardDetailsAdvance
        ref={modalRef}
        contractId={contractId}
        advance={data}
      />
    </>
  );
};

export default CardDetailsAdvance;
