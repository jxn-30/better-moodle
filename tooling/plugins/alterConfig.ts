import type { Context } from '../context';
import createPlugin from './createPlugin';
import type { FrameworkConfig } from '../framework';
import type { ESBuildOptions, PluginOption, UserConfig } from 'vite';

type ESBuildJSXConfig = Pick<
    ESBuildOptions,
    'jsxInject' | 'jsxFactory' | 'jsxFragment' | 'jsx'
>;

const esbuildJSXConfigs: Record<string, ESBuildJSXConfig> = {
    'jsx-dom': {
        jsxInject:
            'import { createElement, Fragment as createFragment } from "jsx-dom";',
        jsxFactory: 'createElement',
        jsxFragment: 'createFragment',
        jsx: 'transform',
    },
} as const;

export type ESBuildJSXConfigs = typeof esbuildJSXConfigs;

/**
 * A plugin to alter the base vite config, such as build, esbuild and define
 * @param config - the framework config
 * @param ctx - the build context
 * @returns a plugin, altering the base vite config
 */
export default function (config: FrameworkConfig, ctx: Context): PluginOption {
    const esbuildJSXConfig = config.jsx ? esbuildJSXConfigs[config.jsx] : null;

    console.log(esbuildJSXConfig);

    const oxc = {
        // node_modules/vite/dist/node/index.d.ts:3165
        // include - no
        // exclude - no
        jsxInject:
            'import { createElement, Fragment as createFragment } from "jsx-dom";',
        // node_modules/rolldown/dist/shared/binding-zH1vcmbM.d.mts:1054
        // assumptions - no
        typescript: {
            jsxPragma: 'createElement',
            jsxPragmaFrag: 'createFragment',
            optimizeConstEnums: true,
            optimizeEnums: true,
        },
        jsx: {
            runtime: 'classic',
            pragma: 'createElement',
            pragmaFrag: 'createFragment',
        },
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
                                mangle: {
                                    toplevel: false,
                                    keepNames: true,
                                    debug: false,
                                },
                                codegen: { removeWhitespace: true },
                            },
                            comments: {
                                legal: false,
                                annotation: false,
                                jsdoc: false,
                            },
                            topLevelVar: false,
                            minifyInternalExports: false,
                            keepNames: true,
                        },
                    },
                },
                oxc,
                define: ctx.GLOBAL_CONSTANTS_STRINGIFIED,
            };
        },
    });
}
