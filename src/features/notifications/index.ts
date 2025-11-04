/**
 * Feature Notifications - Exportações centralizadas
 * 
 * Facilita imports e reduz acoplamento entre features
 */

// Pages
export { default as Notificacoes } from './pages/Notificacoes';
export { default as PageNotificationAssayResult } from './pages/PageNotificationAssayResult';
export { default as PageNotificationNews } from './pages/PageNotificationNews';
export { default as PageNotificationNotification } from './pages/PageNotificationNotification';
export { default as PageNotificationWithdrawal } from './pages/PageNotificationWithdrawal';

// Components
export { default as CardNotification } from './components/CardNotification';

// Types
export * from './types/notification';
export * from './types/notification-news';

