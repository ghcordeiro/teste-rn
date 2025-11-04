export default interface IResumoStockProps {
  dateOf: number;
  amount: number;
  description: string;
  currency: string;
  type?: string;
  operation?: 'DEBIT' | 'CREDIT';
}
