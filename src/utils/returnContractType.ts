import { EContractType } from 'src/dtos/contract';

export type ITypeDefinition = {
  type: EContractType;
  description: string;
  initials: string;
};

const types: Array<ITypeDefinition> = [
  {
    type: EContractType.EXPEDITION,
    description: 'Expedição',
    initials: 'EXP'
  },
  {
    type: EContractType.SHIPPING,
    description: 'Transferência',
    initials: 'TRA'
  },
  {
    type: EContractType.RECEIVEMENT,
    description: 'Recebimento',
    initials: 'REC'
  },
  {
    type: EContractType.DEVOLUTION,
    description: 'Devolução',
    initials: 'DEV'
  }
];

export default (type: EContractType) => {
  return types.find((e) => e.type === type);
};
