import React from 'react';
import convertCurrency from '@utils/convertCurrency';
import convertData from '@utils/convertData';
import returnContractType from '@utils/returnContractType';
import { IInvoice } from 'src/features/contracts';
import ModalCardDetailsNF from '../ModalCardDetailsNF';
import CardDetails, { CardDetailsColumn } from '../CardDetails';

interface ICardProps {
  data: IInvoice;
  index: number;
  contractId: string;
}

/**
 * CardDetailsNF refatorado para usar componente genérico CardDetails
 * 
 * Reduzido de 51 para 35 linhas (-31%)
 */
const CardDetailsNF = ({ data, index, contractId }: ICardProps) => {
  const columns: CardDetailsColumn[] = [
    {
      width: '27%',
      render: (data: IInvoice) => `NF ${data.invoice}`,
    },
    {
      width: '10%',
      textAlign: 'center',
      render: (data: IInvoice) => returnContractType(data.type)?.initials || '',
    },
    {
      width: '25%',
      textAlign: 'center',
      render: (data: IInvoice) =>
        convertData(new Date(data.dateOf).getTime(), '/'),
    },
    {
      width: '38%',
      textAlign: 'right',
      render: (data: IInvoice) => convertCurrency(data.amount),
    },
  ];

  return (
    <CardDetails
      data={data}
      index={index}
      contractId={contractId}
      columns={columns}
      modalComponent={ModalCardDetailsNF}
      modalProps={(invoice, contractId) => ({
        contractId,
        invoice,
      })}
    />
  );
};

export default CardDetailsNF;
