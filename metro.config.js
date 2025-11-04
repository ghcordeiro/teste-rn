const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// --- Adicionado ---
// Obtenha a configuração padrão primeiro para acessar seu resolver
const defaultConfig = getDefaultConfig(__dirname);
const {
  resolver: { sourceExts },
} = defaultConfig;
// --- Fim da Adição ---

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  // --- Adicionado ---
  // Adicione 'cjs' à lista de extensões de arquivo que o Metro reconhece
  resolver: {
    sourceExts: [...sourceExts, 'cjs'],
  },
  // --- Fim da Adição ---
};

// Modificado para usar a 'defaultConfig' que definimos acima
module.exports = mergeConfig(defaultConfig, config);