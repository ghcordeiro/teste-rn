/**
 * Arquivo de compatibilidade JavaScript
 * 
 * IMPORTANTE: Este arquivo deve ser ignorado pelo Metro bundler
 * O Metro deve priorizar index.ts sobre index.js
 * 
 * Se este arquivo estiver sendo usado, pode causar erros.
 * Delete este arquivo se não for necessário.
 */

// Tenta usar o index.ts compilado, mas se não existir, exporta do core
try {
  // Se o Metro estiver usando este arquivo, tenta requerer o core diretamente
  const core = require('./core.ts') || require('./core.js');
  
  // Garante que translate está disponível
  if (!core || typeof core.translate !== 'function') {
    throw new Error('translate not found in core');
  }
  
  module.exports = {
    ...core,
    default: core.translate,
    translate: core.translate,
    i18n: core.i18n,
    getLocale: core.getLocale,
    setLocale: core.setLocale,
    initializeI18n: core.initializeI18n,
    getTranslations: core.getTranslations,
    hasTranslation: core.hasTranslation,
  };
} catch (error) {
  console.error('[i18n/index.js] Error loading core:', error);
  // Fallback: retorna uma função translate que retorna a chave
  const fallbackTranslate = (key) => key;
  module.exports = {
    translate: fallbackTranslate,
    default: fallbackTranslate,
    getLocale: () => 'pt_BR',
    setLocale: () => {},
    initializeI18n: () => {},
    getTranslations: () => ({}),
    hasTranslation: () => false,
  };
}
