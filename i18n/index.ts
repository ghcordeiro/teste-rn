/**
 * Sistema de i18n modernizado
 * Exporta todas as funções e tipos necessários
 */

// Core
export {
  getLocale,
  getTranslations,
  hasTranslation,
  i18n,
  initializeI18n,
  setLocale,
  translate,
} from './core';

// Utils
export { detectDeviceLocale, normalizeLocale } from './utils/localeDetector';

// Types
export type {
  I18nConfig,
  Locale,
  TranslateOptions,
  Translations,
} from './types';

// Config
export { AVAILABLE_LOCALES, DEFAULT_LOCALE, SUPPORTED_LOCALES } from './config';

// Compatibilidade: exporta translate como default para compatibilidade com imports antigos
import { translate } from './core';
export default translate;
