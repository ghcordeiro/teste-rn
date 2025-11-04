/**
 * Feature Contracts - Exportações centralizadas
 * 
 * Facilita imports e reduz acoplamento entre features
 */

// Pages
export { default as Contracts } from './pages/Contracts';
export { default as ContractDetails } from './pages/ContractDetails';

// Components
export { default as CardContract } from './components/CardContract';
export { default as CardHomeContract } from './components/CardHomeContract';
export { default as TabContractNF } from './components/TabContractNF';
export { default as TabContractPayment } from './components/TabContractPayment';
export { default as TabContractAdvance } from './components/TabContractAdvance';
export { default as TabContractNFObs } from './components/TabContractNFObs';

// Types
export * from './types/contract';
export { EContractType } from './types/contract';
export { default as IResumoContractProps } from './types/resumoContract';

