import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import eslintPluginImport from 'eslint-plugin-import';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    plugins: {
      import: eslintPluginImport,
    },
    rules: {
      // Add or override any rules you need here
      'prettier/prettier': 'error',
      'import/no-unresolved': 'error',
    },
  },
);