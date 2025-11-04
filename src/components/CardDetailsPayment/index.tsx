import React, { useRef } from 'react';
import { TextRegular } from '@globalStyle';
import convertCurrency from '@utils/convertCurrency';
import convertData from '@utils/convertData';

import { IPayment } from 'src/dtos/contract';
import { Container } from './styles';
import ModalCardDetailsPayment, {
  IModalCardDetailsPaymentProps
} from '../ModalCardDetailsPayment';

interface ICardProps {
  data: IPayment;
  index: number;
  contractId: string;
}

const CardDetailsPayment = ({ data, index, contractId }: ICardProps) => {
  const modalRef = useRef<IModalCardDetailsPaymentProps>(null);

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
          {convertData(new Date(data.paymentDate).getTime(), '/')}
        </TextRegular>
        <TextRegular width="38%" textAlign="right" size={12}>
          {convertCurrency(data.amount)}
        </TextRegular>
      </Container>
      <ModalCardDetailsPayment
        ref={modalRef}
        contractId={contractId}
        payment={data}
      />
    </>
  );
};

export default CardDetailsPayment;
