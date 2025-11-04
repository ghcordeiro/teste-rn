module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-worklets/plugin',
    [
      'module-resolver',
      {
        root: ['./'],
        extensions: ['.ts', '.tsx', '.jsx', '.js', '.json', '.svg'],
        alias: {
          '@components': './src/components',
          '@hooks': './src/hooks',
          '@utils': './src/utils',
          '@translate': './i18n',
          '@colors': './src/assets/colors',
          '@globalStyle': './src/assets/styles.ts',
          '@size': './src/assets/size.ts',
          '@provider': './src/AppProviderContext.tsx',
          '@enum': './src/enum',
          '@dtos': './src/dtos',
        }
      }
    ],
  ]
};
