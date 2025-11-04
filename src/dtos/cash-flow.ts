export interface ICashFlow {
  title: string;
  ptax: number;
  currency: string;
  currencyName: string;
  income: number;
  expense: number;
  balance: number;
  alternativeCurrency: string;
  alternativeCurrencyName: string;
  alternativeIncome: number;
  alternativeExpense: number;
  alternativeBalance: number;
  finalIncome: number;
  finalExpense: number;
  finalBalance: number;
}

export interface ICashFlowResume {
  key: string;
  date: Date;
  currency: string;
  income: number;
  expense: number;
  balance: number;
}
