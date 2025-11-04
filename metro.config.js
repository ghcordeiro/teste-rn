const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// --- Adicionado ---
// Obtenha a configuração padrão primeiro para acessar seu resolver
const defaultConfig = getDefaultConfig(__dirname);
const {
  resolver: { sourceExts, assetExts },
} = defaultConfig;
// --- Fim da Adição ---

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
    // Configuração para transformar SVGs usando react-native-svg-transformer
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    // Adicione 'cjs' à lista de extensões de arquivo que o Metro reconhece
    sourceExts: [...sourceExts, 'cjs', 'svg'],
    // Remove 'svg' de assetExts para que seja processado pelo transformer
    assetExts: assetExts.filter(ext => ext !== 'svg'),
  },
};

// Modificado para usar a 'defaultConfig' que definimos acima
module.exports = mergeConfig(defaultConfig, config);