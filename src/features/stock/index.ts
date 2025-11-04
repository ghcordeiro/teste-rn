/**
 * Feature Stock - Exportações centralizadas
 * 
 * Facilita imports e reduz acoplamento entre features
 */

// Pages
export { default as Stock } from './pages/Stock';

// Components
export { default as CardStock } from './components/CardStock';
export { default as ModalCardStock } from './components/ModalCardStock';

// Types
export { default as IResumoStockProps } from './types/resumoStock';
export * from './types/stock';

