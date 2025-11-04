/**
 * Configuração centralizada do i18n
 */

import {Locale} from './types';
import pt from './src/locales/pt-BR';
import en from './src/locales/en-US';

// Mapeamento de locales suportados
export const SUPPORTED_LOCALES: Record<string, Locale> = {
  'pt-BR': 'pt_BR',
  'pt_US': 'pt_BR',
  'pt': 'pt_BR',
  'en-US': 'en_US',
  'en_US': 'en_US',
  'en': 'en_US',
};

// Locale padrão
export const DEFAULT_LOCALE: Locale = 'pt_BR';

// Locales disponíveis
export const AVAILABLE_LOCALES: Locale[] = ['pt_BR', 'en_US'];

// Traduções
export const translations = {
  pt_BR: pt,
  pt: pt,
  pt_US: pt,
  en_US: en,
  en: en,
} as const;

