/**
 * Feature Shared - Recursos compartilhados entre features
 *
 * Componentes, hooks, utils e tipos que são usados por múltiplas features
 */

// Components
export { default as Button } from './components/Button';
export { default as FloatingButton } from './components/FloatingButton';
export { default as Header } from './components/Header';
export { default as Loading } from './components/Loading';
export { default as ProgressBar } from './components/ProgressBar';
export { default as Select } from './components/Select';
export { TextBold } from './components/TextBold';
export { TextLight } from './components/TextLight';
export { TextRegular } from './components/TextRegular';

// Hooks
export { DateFilterOption, useDateFilter } from './hooks/useDateFilter';
export {
  useSelectFilter,
  type UseSelectFilterConfig,
} from './hooks/useSelectFilter';
