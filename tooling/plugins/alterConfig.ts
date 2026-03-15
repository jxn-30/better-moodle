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

    return createPlugin('base-config', {
        enforce: 'pre',
        /**
         * Alter the config
         * @returns the new config that shall be merged with existing config
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
