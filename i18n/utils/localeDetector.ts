/**
 * Utilitário moderno para detectar o locale do dispositivo
 * Usa React Native Localize para melhor compatibilidade
 */

import { NativeModules, Platform } from 'react-native';
import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from '../config';
import { Locale } from '../types';

/**
 * Detecta o locale do dispositivo de forma robusta
 * Suporta iOS e Android com fallbacks adequados
 */
export const detectDeviceLocale = (): Locale => {
  try {
    let locale: string | undefined;

    if (Platform.OS === 'ios') {
      // iOS: Tenta múltiplas formas de obter o locale
      const SettingsManager = NativeModules.SettingsManager;

      // Primeiro tenta AppleLocale
      locale = SettingsManager?.settings?.AppleLocale;

      // Se não encontrar, tenta AppleLanguages
      if (!locale) {
        const languages = SettingsManager?.settings?.AppleLanguages;
        locale = languages?.[0];
      }

      // Fallback para localeIdentifier do I18nManager
      if (!locale) {
        locale = NativeModules.I18nManager?.localeIdentifier;
      }
    } else {
      // Android: Usa localeIdentifier diretamente
      locale = NativeModules.I18nManager?.localeIdentifier;
    }

    // Normaliza o locale (ex: "pt-BR" -> "pt_BR")
    if (locale) {
      const normalized = locale.replace('-', '_');

      // Verifica se está no mapeamento de suporte
      if (SUPPORTED_LOCALES[normalized]) {
        return SUPPORTED_LOCALES[normalized];
      }

      // Tenta match parcial (ex: "pt" em "pt-BR")
      const languageCode = normalized.split('_')[0];
      if (SUPPORTED_LOCALES[languageCode]) {
        return SUPPORTED_LOCALES[languageCode];
      }
    }
  } catch (error) {
    console.warn('[i18n] Error detecting locale:', error);
  }

  return DEFAULT_LOCALE;
};

/**
 * Normaliza um locale para o formato padrão
 */
export const normalizeLocale = (locale: string): Locale => {
  const normalized = locale.replace('-', '_');
  return (
    SUPPORTED_LOCALES[normalized] ||
    SUPPORTED_LOCALES[normalized.split('_')[0]] ||
    DEFAULT_LOCALE
  );
};
