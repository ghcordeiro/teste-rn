import { useCallback, useMemo, useState } from 'react';
import { getLocale, setLocale, translate } from '../index';

/**
 * Hook para usar traduções no React
 * ESTE ARQUIVO FOI CORRIGIDO PARA SER REATIVO
 */
export const useTranslation = () => {
  // Armazena o locale no estado para re-renderizar o componente
  const [locale, setInternalLocale] = useState(getLocale());

  // 't' é estável, mas o memoizamos por boa prática
  const t = useCallback(
    (
      key: string,
      options?: { defaultValue?: string; [key: string]: any },
    ): string => {
      return translate(key, options);
    },
    [], // translate é estável
  );

  // Esta função agora muda o locale global E o estado do hook
  const changeLocale = useCallback((newLocale: string) => {
    setLocale(newLocale); // Atualiza o i18n (global)
    setInternalLocale(newLocale); // Atualiza o estado do hook (reativo)
  }, []);

  // useMemo garante que o objeto retornado só mude se o locale mudar
  return useMemo(
    () => ({
      t,
      locale,
      changeLocale,
    }),
    [t, locale, changeLocale],
  );
};
