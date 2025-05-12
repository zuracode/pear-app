import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import { defineConfig } from '@eslint/config-helpers';
import importPlugin from 'eslint-plugin-import';
import js from '@eslint/js';

export default defineConfig([
    js.configs.recommended,
    prettier,
    prettierPlugin,
    {
        plugins: {
            import: importPlugin,
        },
        ignores: ['node_modules/**'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                Pear: 'readonly',
                require: true,
                module: true,
                console: true,
                global: 'readonly',
                exports: true,
                setTimeout: 'readonly',
                setInterval: 'readonly',
                clearTimeout: 'readonly',
                clearInterval: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-console': 'off',
            'prettier/prettier': 'error',
            'import/no-unresolved': 'error',
            'import/named': 'error',
            'import/namespace': 'error',
            'import/default': 'error',
            'import/export': 'error',
        },
    },
]);
