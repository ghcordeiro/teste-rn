import EFinancialMovementStatus from 'src/enum/EFinancialMovementStatus';
import EFinancialStatementOperation from 'src/enum/EFinancialStatementOperation';

import BaseModel from './base-model';

export default interface IFinancialMoviment extends BaseModel {
  cooperativeId?: string;
  cooperativeCode?: string;
  cooperativeName?: string;
  producerId?: string;
  producerCode?: string;
  producerName?: string;
  documentType?: string;
  document: string;
  counterparty?: string;
  dateOf: Date;
  expirationDate: Date;
  paymentDate?: Date;
  operation: EFinancialStatementOperation;
  typeFinancialMovement: string;
  status: EFinancialMovementStatus;
  amount: number;
  amountPaid?: number;
  amountDue?: number;
  currency: string;
  currencyName?: string;
  alternativeAmount?: number;
  alternativeAmountPaid?: number;
  alternativeAmountDue?: number;
  alternativeCurrency?: string;
  alternativeCurrencyName?: string;
  balance?: number;
  ptax?: number;
}
