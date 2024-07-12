// @ts-check
import globals from 'globals';
import eslintJs from '@eslint/js';


export default [
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  eslintJs.configs.recommended,
  {
    rules: {
      'no-unused-vars': ['warn', { 'args': 'all', 'argsIgnorePattern': '^_' }],
      'no-undef': 'warn',
      'no-console': 'warn',
    },
  }
];