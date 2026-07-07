import type { Context } from '../context';
import createPlugin from './createPlugin';
import type { FrameworkConfig } from '../framework';
import type { PluginOption, UserConfig } from 'vite';

const oxcJSXConfigs = {
    'jsx-dom': {
        jsxInject:
            'import { createElement, Fragment as createFragment } from "jsx-dom";',
        pragma: 'createElement',
        pragmaFrag: 'createFragment',
        runtime: 'classic',
    },
} as const;

export type OXCJSXConfigs = typeof oxcJSXConfigs;

/**
 * A plugin to alter the base vite config, such as build, oxc and define
 * @param config - the framework config
 * @param ctx - the build context
 * @returns a plugin, altering the base vite config
 */
export default function (config: FrameworkConfig, ctx: Context): PluginOption {
    const oxcJSXConfig = config.jsx ? oxcJSXConfigs[config.jsx] : null;

    const oxc = {
        // node_modules/vite/dist/node/index.d.ts:3165
        // include - no
        // exclude - no
        jsxInject: oxcJSXConfig?.jsxInject,
        // node_modules/rolldown/dist/shared/binding-zH1vcmbM.d.mts:1054
        // assumptions - no
        typescript: {
            jsxPragma: oxcJSXConfig?.pragma,
            jsxPragmaFrag: oxcJSXConfig?.pragmaFrag,
            optimizeConstEnums: true,
            optimizeEnums: true,
        },
        jsx:
            oxcJSXConfig ?
                {
                    runtime: oxcJSXConfig.runtime,
                    pragma: oxcJSXConfig.pragma,
                    pragmaFrag: oxcJSXConfig.pragmaFrag,
                }
            :   undefined,
        // define - no
        // decorator - no
        // plugins - no
    } as const;

    return createPlugin('base-config', {
        enforce: 'pre',
        /**
         * Alter the config
         * @returns the new config that shall be merged with existing config
         */
        config(): UserConfig {
            return {
                build: {
                    minify: 'oxc',
                    cssMinify: false,
                    target: ctx.targets,
                    rolldownOptions: {
                        // node_modules/rolldown/dist/shared/define-config-5HJ1b9vG.d.mts:3795
                        platform: 'browser',
                        treeshake: true,
                        experimental: { attachDebugInfo: 'full' },
                        transform: oxc,
                        optimization: { inlineConst: true },
                        tsconfig: true,
                        output: {
                            sourcemap: false,
                            minify: {
                                // node_modules/rolldown/dist/shared/binding-zH1vcmbM.d.mts:127
                                compress: {
                                    dropConsole: false,
                                    dropDebugger: true,
                                    unused: true,
                                    keepNames: { function: true, class: true },
                                    joinVars: false,
                                    sequences: false,
                                },
                                mangle: false,
                                codegen: { removeWhitespace: true }, // will have a comments option someday.
                            },
                            comments: {
                                legal: true,
                                annotation: false,
                                jsdoc: false,
                            },
                            topLevelVar: false,
                            minifyInternalExports: false,
                        },
                    },
                },
                oxc,
                define: ctx.GLOBAL_CONSTANTS_STRINGIFIED,
            };
        },
    });
}
