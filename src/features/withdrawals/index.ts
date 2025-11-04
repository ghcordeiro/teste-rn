/**
 * Feature Withdrawals - Exportações centralizadas
 * 
 * Facilita imports e reduz acoplamento entre features
 */

// Pages
export { default as NewWithdrawal } from './pages/NewWithdrawal';
export { TrackWithdrawal } from './pages/TrackWithdrawal';
export { WithdrawalCart } from './pages/WithdrawalCart';

// Components
export { default as CardWithdrawal } from './components/CardWithdrawal';
export { default as CardWithdrawalCart } from './components/CardWithdrawalCart';
export { default as CardWithdrawalItem } from './components/CardWithdrawalItem';
export { default as TabItemsTrackWithdrawal } from './components/TabItemsTrackWithdrawal';
export { default as TabAttachmentsTrackWithdrawal } from './components/TabAttachmentsTrackWithdrawal';

// Types
export * from './types/withdrawal';
export * from './types/delivery-order';
export * from './types/ISaveWithdrawalDto';

