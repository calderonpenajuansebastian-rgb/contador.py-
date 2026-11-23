// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
    // El resolvedor nativo de TypeScript no carga en todos los entornos Windows.
    // Usamos el resolvedor de Node para poder ejecutar el lint igualmente.
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
        },
      },
    },
    rules: {
      // Falso positivo del resolvedor de Node con los tipos de expo-splash-screen.
      'import/namespace': 'off',
      // React Native Animated necesita leer el valor del ref dentro de los handlers.
      'react-hooks/refs': 'off',
    },
  },
  {
    files: ['src/hooks/use-color-scheme.web.ts'],
    rules: {
      // Hook de hidratación que viene con la plantilla de Expo.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]);
