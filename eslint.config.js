import globals from 'globals';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import userscripts from 'eslint-plugin-userscripts';

/** @type {FlatConfig[]} */
export default [
    {
        ignores: ['node_modules/*', '.yarn/*', 'dist/*', 'src/style/*.d.ts'],
    },
    js.configs.recommended,
    prettier,
    {
        name: 'better-moodle general ESLint config',
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'script',
            globals: {
                ...globals.browser,
                ...globals.es2021,
            },
            parserOptions: {
                ecmaFeatures: {
                    globalReturn: true,
                },
            },
        },
        rules: {
            'array-callback-return': ['error'],
            'block-scoped-var': 'warn',
            'curly': ['warn', 'multi-line'],
            'dot-notation': ['warn', { allowKeywords: true }],
            'default-case-last': 'error',
            'guard-for-in': 'error',
            'no-caller': 'warn',
            'no-constant-binary-expression': 'error',
            'no-duplicate-imports': ['error', { includeExports: true }],
            'no-eval': 'error',
            'no-extra-bind': 'warn',
            'no-implicit-coercion': [
                'error',
                {
                    allow: ['!!'],
                },
            ],
            'no-implicit-globals': 'error',
            'no-implied-eval': 'warn',
            'no-lone-blocks': 'warn',
            'no-loop-func': 'error',
            'no-multi-str': 'warn',
            'no-octal-escape': 'error',
            'no-param-reassign': 'error',
            'no-proto': 'warn',
            'no-return-assign': 'warn',
            'no-self-compare': 'error',
            'no-sequences': 'error',
            'no-template-curly-in-string': 'warn',
            'no-undef': 'warn',
            'no-unmodified-loop-condition': 'error',
            'no-unreachable-loop': 'error',
            'no-unused-expressions': 'error',
            'no-useless-call': 'warn',
            'no-useless-concat': 'warn',
            'no-useless-rename': 'error',
            'no-useless-return': 'warn',
            'no-var': 'error',
            'no-with': 'warn',
            'object-shorthand': ['error', 'always', { avoidQuotes: true }],
            'prefer-arrow-callback': 'error',
            'prefer-const': 'error',
            'prefer-regex-literals': [
                'error',
                {
                    disallowRedundantWrapping: true,
                },
            ],
            'prefer-rest-params': 'error',
            'prefer-spread': 'error',
            'prefer-template': 'error',
            'sort-imports': [
                'warn',
                {
                    allowSeparatedGroups: true,
                    ignoreCase: true,
                    memberSyntaxSortOrder: [
                        'none',
                        'all',
                        'single',
                        'multiple',
                    ],
                },
            ],
            'yoda': [
                'error',
                'never',
                {
                    exceptRange: true,
                },
            ],
        },
    },
    {
        name: 'set sourceType to module for eslint.config.js',
        files: ['eslint.config.js'],
        languageOptions: {
            sourceType: 'module',
        },
    },
    {
        name: 'userscript extended config',
        ...userscripts.configs.recommended,
        files: ['*.user.js'],
        plugins: {
            userscripts,
        },
        languageOptions: {
            globals: {
                uneval: 'readonly',
                unsafeWindow: 'readonly',
                GM_info: 'readonly',
                GM: 'readonly',
                GM_addStyle: 'readonly',
                GM_addElement: 'readonly',
                GM_cookie: 'readonly',
                GM_deleteValue: 'readonly',
                GM_listValues: 'readonly',
                GM_getValue: 'readonly',
                GM_download: 'readonly',
                GM_log: 'readonly',
                GM_registerMenuCommand: 'readonly',
                GM_unregisterMenuCommand: 'readonly',
                GM_openInTab: 'readonly',
                GM_setValue: 'readonly',
                GM_addValueChangeListener: 'readonly',
                GM_removeValueChangeListener: 'readonly',
                GM_xmlhttpRequest: 'readonly',
                GM_webRequest: 'readonly',
                GM_getTab: 'readonly',
                GM_saveTab: 'readonly',
                GM_getTabs: 'readonly',
                GM_setClipboard: 'readonly',
                GM_notification: 'readonly',
                GM_getResourceText: 'readonly',
                GM_getResourceURL: 'readonly',
            },
        },
    },
];
