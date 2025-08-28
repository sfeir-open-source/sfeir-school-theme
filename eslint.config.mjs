import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
    { files: ['src/**/*.{js,mjs,cjs,ts}'] },
    { ignores: ['dist/**/*', 'demo/web_modules/**/*'] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    { rules: { 'sort-imports': ['error'] } },
];
