// @ts-check
import globals from 'globals';
import eslintJs from '@eslint/js';

export default [
  eslintJs.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest', // Ensure latest ECMAScript support
      sourceType: 'module', // Enable ES Modules
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // All unused vars = warn, except those starting with `_unused_` are ignored
      'no-unused-vars': ['warn', {
        vars: 'all',
        args: 'all',
        varsIgnorePattern: '^_unused_',
        argsIgnorePattern: '^_unused_',
      }],
      'no-undef': 'warn',
      'no-console': 'warn',
      'no-useless-escape': 'warn',
    },
  },
];
