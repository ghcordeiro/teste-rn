/**
 * Hook React para traduções
 * Fornece reatividade e melhor integração com React
 */

import {useCallback, useMemo} from 'react';
import {translate, getLocale, setLocale} from '../core';
import type {Locale, TranslateOptions} from '../types';

/**
 * Hook para usar traduções no React
 * Retorna função de tradução e locale atual
 */
export const useTranslation = () => {
  const locale = getLocale();

  const t = useCallback(
    (key: string, options?: TranslateOptions): string => {
      return translate(key, options);
    },
    [locale], // Re-executa quando locale muda
  );

  const changeLocale = useCallback((newLocale: Locale) => {
    setLocale(newLocale);
  }, []);

  return useMemo(
    () => ({
      t,
      locale,
      changeLocale,
    }),
    [t, locale, changeLocale],
  );
};

/**
 * Hook simples que retorna apenas a função de tradução
 */
export const useT = () => {
  const {t} = useTranslation();
  return t;
};

