/**
 * Sistema de i18n modernizado
 * Exporta todas as funções e tipos necessários
 */

// Importa core primeiro para garantir inicialização
import {
  getLocale,
  getTranslations,
  hasTranslation,
  i18n,
  initializeI18n,
  setLocale,
  translate,
} from './core';

// Exporta todas as funções
export {
  getLocale,
  getTranslations,
  hasTranslation,
  i18n,
  initializeI18n,
  setLocale,
  translate,
};

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
export default translate;
