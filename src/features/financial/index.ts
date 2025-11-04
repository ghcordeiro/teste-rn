/**
 * Feature Financial - Exportações centralizadas
 * 
 * Facilita imports e reduz acoplamento entre features
 */

// Pages
export { default as FinancialMoviment } from './pages/FinancialMoviment';
export { default as FinancialStatement } from './pages/FinancialStatement';
export { default as CashFlow } from './pages/CashFlow';

// Components
export { default as CardFinancialMoviment } from './components/CardFinancialMoviment';
export { default as CardFinancialStatement } from './components/CardFinancialStatement';
export { default as CardFinancialMovimentModalCashFlow } from './components/CardFinancialMovimentModalCashFlow';
export { default as CardHomeMoviment } from './components/CardHomeMoviment';
export { default as TabCashFlow } from './components/TabCashFlow';
export { default as CardDetailsCashFlow } from './components/CardDetailsCashFlow';
export { default as ModalCardDetailsCashFlow } from './components/ModalCardDetailsCashFlow';
export type { IModalCardDetailsCashFlowProps } from './components/ModalCardDetailsCashFlow';

// Types
export { default as IFinancialMoviment } from './types/financialMoviment';
export { default as IFinancialStatement, IFinancialStatementProps } from './types/financialStatement';
export { ICashFlow, ICashFlowResume } from './types/cash-flow';
export type { ICashFlowFilters } from './pages/CashFlow';

