import globals from 'globals';
import js from '@eslint/js';
import jsdoc from 'eslint-plugin-jsdoc';
import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';
import tsEslint from 'typescript-eslint';

export default [
    {
        ignores: [
            'node_modules/*',
            '.yarn/*',
            'dist/*',
            'src/style/*.d.ts',
            'redesign.user.js', // this is the legacy userscript, no linting here anymore
            '.postcssrc.cts',
        ],
    },
    js.configs.recommended,
    prettier,
    ...tsEslint.configs.recommendedTypeChecked,
    ...tsEslint.configs.stylisticTypeChecked,
    jsdoc.configs['flat/recommended-typescript'],
    {
        name: 'better-moodle general ESLint config',
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'script',
            globals: {
                ...globals.browser,
                ...globals.es2024,
                ...globals.greasemonkey,
                // globals existing within moodle
                requirejs: 'readonly',
                // jQuery exposes its namespace globally
                JQuery: 'readonly',
                // custom globals defined in vite config
                __GITHUB_USER__: 'readonly',
                __GITHUB_REPO__: 'readonly',
                __GITHUB_URL__: 'readonly',
                __GITHUB_BRANCH__: 'readonly',
                __VERSION__: 'readonly',
                __PREFIX__: 'readonly',
                __UNI__: 'readonly',
                __MOODLE_VERSION__: 'readonly',
                __MOODLE_URL__: 'readonly',
                __USERSCRIPT_CONNECTS__: 'readonly',
                __UA_REGEX__: 'readonly',
                __UA_REGEX_FLAGS__: 'readonly',
                __MIN_SUPPORTED_BROWSERS__: 'readonly',
                // DarkReader is included via @require
                DarkReader: 'readonly',
                // JSXElement is created via vite-env.d.ts
                JSXElement: 'readonly',
            },
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
                ecmaFeatures: {
                    globalReturn: true,
                },
            },
        },
        plugins: { 'jsx-a11y': pluginJsxA11y },
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
            'jsdoc/require-asterisk-prefix': 'warn',
            'jsdoc/no-blank-block-descriptions': 'warn',
            'jsdoc/no-blank-blocks': 'warn',
            'jsdoc/require-description': 'warn',
            'jsdoc/require-hyphen-before-param-description': 'warn',
            'jsdoc/require-jsdoc': [
                'warn',
                {
                    require: {
                        ArrowFunctionExpression: true,
                        ClassDeclaration: true,
                        ClassExpression: true,
                        FunctionDeclaration: true,
                        FunctionExpression: true,
                        MethodDefinition: true,
                    },
                },
            ],
            'jsdoc/require-throws': 'warn',
            'jsdoc/sort-tags': 'warn',
            ...pluginJsxA11y.configs.recommended.rules,
        },
    },
    {
        name: 'Allow node globals in vite config',
        files: ['vite.config.ts'],
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    {
        name: 'set sourceType to module for eslint.config.js',
        ...tsEslint.configs.disableTypeChecked,
        files: ['eslint.config.js'],
        languageOptions: {
            sourceType: 'module',
        },
    },
];
