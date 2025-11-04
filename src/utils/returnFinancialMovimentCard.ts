import Colors from '@colors';
import EFinancialMovementStatus from 'src/enum/EFinancialMovementStatus';

interface IdAndDescriptionAndColor {
  id: EFinancialMovementStatus;
  description: string;
  color: string;
}

export default (status: EFinancialMovementStatus) => {
  const a: Array<IdAndDescriptionAndColor> = [
    {
      id: EFinancialMovementStatus.OPEN,
      description: 'Aberta',
      color: Colors.info.info_1
    },
    {
      id: EFinancialMovementStatus.CANCELED,
      description: 'Cancelado',
      color: Colors.danger.danger_1
    },
    {
      id: EFinancialMovementStatus.PAID,
      description: 'Liquidado',
      color: Colors.success.success_1
    },
    {
      id: EFinancialMovementStatus.PARTIALPAID,
      description: 'Parcial',
      color: Colors.warn.warn_1
    }
  ];

  return a.find((f) => f.id === status);
};
