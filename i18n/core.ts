/**
 * Core do sistema de i18n
 * Instância singleton com configuração e métodos principais
 */

import {I18n as I18nClass} from 'i18n-js';
import {Locale, Translations, TranslateOptions, I18nConfig} from './types';
import {DEFAULT_LOCALE, translations} from './config';
import {detectDeviceLocale} from './utils/localeDetector';

/**
 * Configuração do i18n
 */
const config: I18nConfig = {
  translations,
  defaultLocale: DEFAULT_LOCALE,
  fallbacks: true,
};

/**
 * Instância singleton do I18n
 */
export const i18n = new I18nClass(config);

/**
 * Inicializa o i18n com o locale do dispositivo
 */
export const initializeI18n = (): void => {
  const deviceLocale = detectDeviceLocale();
  setLocale(deviceLocale);

  if (__DEV__) {
    console.log('[i18n] Initialized with locale:', i18n.locale);
    console.log('[i18n] Available locales:', Object.keys(i18n.translations || {}));
  }
};

/**
 * Define o locale atual
 */
export const setLocale = (locale: Locale): void => {
  if (!i18n.translations[locale]) {
    console.warn(`[i18n] Locale "${locale}" not found, using default: ${DEFAULT_LOCALE}`);
    i18n.locale = DEFAULT_LOCALE;
    return;
  }

  i18n.locale = locale;
};

/**
 * Obtém o locale atual
 */
export const getLocale = (): Locale => {
  return (i18n.locale as Locale) || DEFAULT_LOCALE;
};

/**
 * Verifica se uma tradução existe
 */
export const hasTranslation = (key: string, locale?: Locale): boolean => {
  const targetLocale = locale || getLocale();
  const translations = i18n.translations[targetLocale] as Translations | undefined;
  return translations ? key in translations : false;
};

/**
 * Obtém todas as traduções de um locale
 */
export const getTranslations = (locale?: Locale): Translations | undefined => {
  const targetLocale = locale || getLocale();
  return i18n.translations[targetLocale] as Translations | undefined;
};

/**
 * Traduz uma chave com fallback seguro
 */
export const translate = (key: string, options: TranslateOptions = {}): string => {
  if (!i18n) {
    console.warn(`[i18n] I18n not available, returning key: ${key}`);
    return options.defaultValue || key;
  }

  // Garante que o locale está definido
  if (!i18n.locale) {
    i18n.locale = DEFAULT_LOCALE;
  }

  try {
    const translation = i18n.t(key, {
      ...options,
      defaultValue: options.defaultValue || key,
    });

    // Detecta mensagens de erro do i18n-js
    if (typeof translation === 'string' && translation.includes('[missing') && translation.includes('translation]')) {
      if (__DEV__) {
        console.warn(`[i18n] Missing translation for key "${key}" in locale "${i18n.locale}"`);
      }
      return options.defaultValue || key;
    }

    return translation;
  } catch (error) {
    if (__DEV__) {
      console.warn(`[i18n] Error translating key "${key}":`, error);
    }
    return options.defaultValue || key;
  }
};

// Inicializa automaticamente
initializeI18n();

