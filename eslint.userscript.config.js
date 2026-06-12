import globals from 'globals';
import prettier from 'eslint-config-prettier/flat';
import stylistic from '@stylistic/eslint-plugin';
import userscripts from 'eslint-plugin-userscripts';

// A custom rule that converts !0 to true and !1 to false.
// The build process outputs this minified form and there seems no way to prevent this specific feature.
const noBooleanShorthandFix = context => ({
    UnaryExpression(node) {
        if (
            node.operator === '!' &&
            node.argument.type === 'Literal' &&
            (node.argument.value === 0 || node.argument.value === 1)
        ) {
            context.report({
                node,
                message: 'Use boolean literal instead of !{{val}}',
                data: { val: node.argument.value },
                fix(fixer) {
                    return fixer.replaceText(
                        node,
                        node.argument.value === 0 ? 'true' : 'false'
                    );
                },
            });
        }
    },
});
const noBooleanShorthandRule = {
    meta: { fixable: 'code' },
    create: noBooleanShorthandFix,
};

export default [
    prettier,
    {
        plugins: {
            'local': {
                rules: { 'no-boolean-shorthand': noBooleanShorthandRule },
            },
            'userscripts': { rules: userscripts.rules },
            '@stylistic': stylistic,
        },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'script',
            globals: {
                ...globals.browser,
                ...globals.es2024,
                ...globals.greasemonkey,
            },
            parserOptions: {
                exmaFeatures: { globalReturn: true },
                allowAwaitOutsideFunction: true,
            },
        },
        rules: {
            ...userscripts.configs.recommended.rules,
            // These are the rules that Tampermonkey uses
            // https://github.com/Tampermonkey/tampermonkey/issues/1686#issuecomment-1403657330
            'curly': [1, 'multi-line'],
            'dot-location': 0,
            'dot-notation': [1, { allowKeywords: true }],
            'no-caller': 1,
            'no-case-declarations': 2,
            'no-div-regex': 0,
            'no-empty-pattern': 2,
            'no-eq-null': 0,
            'no-eval': 1,
            'no-extra-bind': 1,
            'no-fallthrough': 1,
            'no-implicit-globals': 2,
            'no-implied-eval': 1,
            'no-lone-blocks': 1,
            'no-loop-func': 1,
            'no-multi-spaces': 1,
            'no-multi-str': 1,
            'no-native-reassign': 1,
            'no-octal-escape': 2,
            'no-octal': 2,
            'no-proto': 1,
            'no-redeclare': 2,
            'no-return-assign': 1,
            // 'no-sequences': 1, // we do have several comma operators in use due to polyfills. Any way to remove them?
            'no-undef': 1,
            'no-useless-call': 1,
            'no-useless-concat': 1,
            'no-with': 1,
            // custom additional rules
            'local/no-boolean-shorthand': 1, // { create: noBooleanShorthand },
            'no-var': 1,
            'prefer-const': 1,
            '@stylistic/quotes': [
                1,
                'single',
                { avoidEscape: true, allowTemplateLiterals: 'avoidEscape' },
            ],
        },
    },
];
