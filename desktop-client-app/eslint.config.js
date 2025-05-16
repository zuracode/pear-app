import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import importPlugin from 'eslint-plugin-import';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

const defineConfig = (config) => config;

export default defineConfig([
    js.configs.recommended,
    prettier,
    prettierPlugin,
    {
        plugins: {
            import: importPlugin,
            react,
            'react-hooks': reactHooks,
        },
        ignores: ['node_modules/**'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                React: 'readonly',
                JSX: 'readonly',
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
        settings: {
            react: {
                version: 'detect', // Automatically detect React version
            },
            'import/resolver': {
                node: {
                    extensions: ['.js'], // Support React file extensions
                },
            },
        },
        rules: {
            // Your original rules
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-console': 'warn', // Changed to warn for React dev
            'prettier/prettier': 'error',
            'import/no-unresolved': ['error', { commonjs: true }],
            'import/named': 'error',
            'import/namespace': 'error',
            'import/default': 'error',
            'import/export': 'error',
            // React-specific rules
            'react/prop-types': 'off', // Disable if using TypeScript or not needed
            'react/jsx-uses-react': 'off', // Not needed with React 17+
            'react/react-in-jsx-scope': 'off', // Not needed with React 17+
            'react/no-unescaped-entities': 'error', // Enforce proper escaping in JSX
            'react/jsx-key': 'error', // Require keys in iterators
        },
    },
]);
