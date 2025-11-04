import React from 'react';
import convertCurrency from '@utils/convertCurrency';
import convertData from '@utils/convertData';
import { IAdvance } from 'src/features/contracts';
import ModalCardDetailsAdvance from '../ModalCardDetailsAdvance';
import CardDetails, { CardDetailsColumn } from '../CardDetails';

interface ICardProps {
  data: IAdvance;
  index: number;
  contractId: string;
}

/**
 * CardDetailsAdvance refatorado para usar componente genérico CardDetails
 * 
 * Reduzido de 47 para 30 linhas (-36%)
 */
const CardDetailsAdvance = ({ data, index, contractId }: ICardProps) => {
  const columns: CardDetailsColumn[] = [
    {
      width: '30%',
      render: (data: IAdvance) => `DOC ${data.document}`,
    },
    {
      width: '32%',
      textAlign: 'center',
      render: (data: IAdvance) =>
        convertData(new Date(data.dateOf).getTime(), '/'),
    },
    {
      width: '38%',
      textAlign: 'right',
      render: (data: IAdvance) => convertCurrency(data.amount),
    },
  ];

  return (
    <CardDetails
      data={data}
      index={index}
      contractId={contractId}
      columns={columns}
      modalComponent={ModalCardDetailsAdvance}
      modalProps={(advance, contractId) => ({
        contractId,
        advance,
      })}
    />
  );
};

export default CardDetailsAdvance;
