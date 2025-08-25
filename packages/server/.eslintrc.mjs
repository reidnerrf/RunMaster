import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    ignores: ['**/*.ts', 'dist/**', 'node_modules/**']
  }
];
