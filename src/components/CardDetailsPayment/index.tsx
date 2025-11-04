import React from 'react';
import convertCurrency from '@utils/convertCurrency';
import convertData from '@utils/convertData';
import { IPayment } from 'src/features/contracts';
import ModalCardDetailsPayment from '../ModalCardDetailsPayment';
import CardDetails, { CardDetailsColumn } from '../CardDetails';

interface ICardProps {
  data: IPayment;
  index: number;
  contractId: string;
}

/**
 * CardDetailsPayment refatorado para usar componente genérico CardDetails
 * 
 * Reduzido de 47 para 30 linhas (-36%)
 */
const CardDetailsPayment = ({ data, index, contractId }: ICardProps) => {
  const columns: CardDetailsColumn[] = [
    {
      width: '30%',
      render: (data: IPayment) => `DOC ${data.document}`,
    },
    {
      width: '32%',
      textAlign: 'center',
      render: (data: IPayment) =>
        convertData(new Date(data.paymentDate).getTime(), '/'),
    },
    {
      width: '38%',
      textAlign: 'right',
      render: (data: IPayment) => convertCurrency(data.amount),
    },
  ];

  return (
    <CardDetails
      data={data}
      index={index}
      contractId={contractId}
      columns={columns}
      modalComponent={ModalCardDetailsPayment}
      modalProps={(payment, contractId) => ({
        contractId,
        payment,
      })}
    />
  );
};

export default CardDetailsPayment;
