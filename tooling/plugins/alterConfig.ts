import createPlugin from './createPlugin';
import type { Context } from '../context';
import type { FrameworkConfig } from '../framework';
import type { ESBuildOptions, Plugin, UserConfig } from 'vite';

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
 * @param config
 * @param ctx
 */
export default function (config: FrameworkConfig, ctx: Context): Plugin {
    const esbuildJSXConfig = config.jsx ? esbuildJSXConfigs[config.jsx] : null;

    return createPlugin('base-config', {
        enforce: 'pre',
        /**
         *
         */
        config(): UserConfig {
            return {
                build: {
                    minify: 'esbuild',
                    cssMinify: false,
                    target: ctx.targets,
                },
                esbuild: {
                    minifyWhitespace: true,
                    minifyIdentifiers: false,
                    minifySyntax: false,
                    ...esbuildJSXConfig,
                },
                define: ctx.GLOBAL_CONSTANTS_STRINGIFIED,
            };
        },
    });
}
