// @ts-check
import globals from 'globals';
import eslintJs from '@eslint/js';


export default [
  {
    languageOptions: {
      ecmaVersion: 'latest', // Ensure latest ECMAScript support
      sourceType: 'module', // Enable ES Modules
      globals: {
        ...globals.node,
      },
    },
  },
  {
    extends: [eslintJs.configs.recommended], // Apply recommended ESLint rules
    rules: {
      'no-unused-vars': ['warn', { 'args': 'all', 'argsIgnorePattern': '^_' }],
      'no-undef': 'warn',
      'no-console': 'warn',
    },
  }
];