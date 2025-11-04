export default interface IFinancialStatement {
  dateOf: number;
  description: string;
  operation: string;
  amount: number;
  currency: string;
  erpCode: string;
}

export interface IFinancialStatementProps {
  dateOf: number;
  amount: number;
  description: string;
  currency: string;
  type?: string;
  operation?: 'DEBIT' | 'CREDIT';
}
