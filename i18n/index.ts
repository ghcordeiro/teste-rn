import { I18n } from 'i18n-js';
import { NativeModules, Platform } from 'react-native';

// @ts-ignore - JSON imports são suportados pelo Metro
import ptBR from './locales/pt-BR.json';
// @ts-ignore - JSON imports são suportados pelo Metro
import enUS from './locales/en-US.json';

// Define os locales suportados pela sua aplicação
const supportedLocales = ['pt-BR', 'en-US'];
const defaultLocale = 'pt-BR';

// Mapeia as traduções
const translations = {
  'pt-BR': ptBR,
  'en-US': enUS,
};

// Cria a instância do i18n
const i18n = new I18n(translations);

// --- Configuração ---

// Define o locale padrão
i18n.defaultLocale = defaultLocale;

// Ativa os fallbacks (ex: 'pt' usará 'pt-BR')
i18n.enableFallback = true;

// Define o comportamento para traduções ausentes.
// O i18n-js v4.5.1 espera um objeto com método 'get'
i18n.missingTranslation = {
  get: (scope: string): string => {
    if (__DEV__) {
      console.warn(`[i18n] Missing translation: ${scope}`);
    }
    return scope;
  },
};

/**
 * Detecta o locale do dispositivo usando APIs nativas do React Native
 * (Mantido exatamente como você pediu)
 */
const detectDeviceLocale = (): string => {
  try {
    let locale: string | undefined;

    if (Platform.OS === 'ios') {
      const SettingsManager = NativeModules.SettingsManager;
      locale = SettingsManager?.settings?.AppleLocale;

      if (!locale) {
        const languages = SettingsManager?.settings?.AppleLanguages;
        locale = languages?.[0];
      }

      if (!locale) {
        locale = NativeModules.I18nManager?.localeIdentifier;
      }
    } else {
      locale = NativeModules.I18nManager?.localeIdentifier;
    }

    if (locale) {
      const normalized = locale.replace('_', '-');

      if (supportedLocales.includes(normalized)) {
        return normalized;
      }

      const languageCode = normalized.split('-')[0];
      const matchedLocale = supportedLocales.find(loc =>
        loc.startsWith(languageCode),
      );

      if (matchedLocale) {
        return matchedLocale;
      }
    }
  } catch (error) {
    console.warn('[i18n] Erro ao detectar locale:', error);
  }

  return defaultLocale;
};

/**
 * Função principal de configuração de locale.
 * Aceita um locale opcional ou detecta automaticamente.
 * ESTA FUNÇÃO FOI MODIFICADA
 */
export const setLocale = (locale?: string): void => {
  // Usa o locale fornecido ou detecta automaticamente
  const localeToSet = locale || detectDeviceLocale();

  // Define o locale do i18n
  i18n.locale = localeToSet;

  if (__DEV__) {
    console.log('[i18n] Locale definido como:', localeToSet);
  }
};

/**
 * Função de tradução simplificada (wrapper para i18n.t)
 */
export const translate = (key: string, options?: object): string => {
  return i18n.t(key, options);
};

/**
 * Obtém o locale atual
 */
export const getLocale = (): string => {
  return i18n.locale;
};

/**
 * Verifica se uma tradução existe
 */
export const hasTranslation = (key: string, locale?: string): boolean => {
  const targetLocale = locale || getLocale();
  const translations = i18n.translations[targetLocale];
  return translations ? key in translations : false;
};

/**
 * Obtém todas as traduções de um locale
 */
export const getTranslations = (
  locale?: string,
): Record<string, string> | undefined => {
  const targetLocale = locale || getLocale();
  return i18n.translations[targetLocale] as Record<string, string> | undefined;
};

// --- Inicialização ---

// Configura o locale (detecção automática) assim que o app é carregado
setLocale();

// Exporta o 't' como padrão
export default translate;

// Exporta a instância completa
export { i18n as I18nInstance };
