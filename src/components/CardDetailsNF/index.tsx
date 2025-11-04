import React, { useRef } from 'react';
import { TextRegular } from '@globalStyle';
import convertCurrency from '@utils/convertCurrency';
import convertData from '@utils/convertData';

import returnContractType from '@utils/returnContractType';
import { IInvoice } from 'src/dtos/contract';
import { Container } from './styles';
import ModalCardDetailsNF, {
  IModalCardDetailsNFProps
} from '../ModalCardDetailsNF';

interface ICardProps {
  data: IInvoice;
  index: number;
  contractId: string;
}

const CardDetailsNF = ({ data, index, contractId }: ICardProps) => {
  const modalRef = useRef<IModalCardDetailsNFProps>(null);

  const handleOpenModal = () => {
    modalRef.current?.openModal();
  };
  return (
    <>
      <Container key={`${data._id}-${index}`} onPress={handleOpenModal}>
        <TextRegular width="27%" size={12}>
          NF {data.invoice}
        </TextRegular>
        <TextRegular width="10%" textAlign="center" size={12}>
          {returnContractType(data.type)?.initials}
        </TextRegular>
        <TextRegular width="25%" textAlign="center" size={12}>
          {convertData(new Date(data.dateOf).getTime(), '/')}
        </TextRegular>
        <TextRegular width="38%" textAlign="right" size={12}>
          {convertCurrency(data.amount)}
        </TextRegular>
      </Container>
      <ModalCardDetailsNF
        ref={modalRef}
        contractId={contractId}
        invoice={data}
      />
    </>
  );
};

export default CardDetailsNF;
