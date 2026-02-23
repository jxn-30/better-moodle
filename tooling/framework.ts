import buildStatsPlugin from './plugins/buildStats';
import debugPlugin from './plugins/debug';
import dotenv from 'dotenv';
import i18nResolverPlugin from './plugins/i18nResolver';
import importFeaturesPlugin from './plugins/importFeatures';
import importFixesPlugin from './plugins/importFixes';
import legacyPlugin from './plugins/legacy';
import mustacheMinifyPlugin from './plugins/mustacheLoader';
import type { PluginOption } from 'vite';
import postBuildFormatPlugin from './plugins/postBuildFormat';
import scssPlugin from './plugins/scss';
import terserPlugin from './plugins/terser';
import userscriptPlugin from './plugins/userscript';
import alterConfigPlugin, {
    type ESBuildJSXConfigs,
} from './plugins/alterConfig';
import { type Context, BuildContext as ctx } from './context';

type EnvValue = string | ((ctx: Context) => string);

export interface FrameworkConfig {
    jsx?: false | keyof ESBuildJSXConfigs;
    env?: Record<`VITE_${string}`, EnvValue>;
    performanceStops: Map<string, bigint>;
}

/**
 * A Framework that adds multiple plugins to vite
 * @param config - the framework config
 * @returns the list of plugins created by the framework
 */
export default function (config: FrameworkConfig): PluginOption[] {
    const env: Record<string, string> = {};
    Object.entries(config.env ?? {}).forEach(
        ([key, value]: [string, EnvValue]) => {
            if (typeof value === 'string') env[key] = value;
            else env[key] = value(ctx);
        }
    );

    // @ts-expect-error because process.env may also include undefined values
    dotenv.populate(process.env, env);

    return [
        alterConfigPlugin(config, ctx),

        i18nResolverPlugin(ctx),
        scssPlugin(ctx),

        importFeaturesPlugin(ctx),
        importFixesPlugin(ctx),
        mustacheMinifyPlugin(),

        terserPlugin(),
        legacyPlugin(ctx),

        userscriptPlugin(ctx),

        postBuildFormatPlugin(ctx),
        buildStatsPlugin(config, ctx),

        debugPlugin(ctx),
    ];
}
