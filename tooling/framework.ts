import buildStatsPlugin from './plugins/buildStats.ts';
import debugPlugin from './plugins/debug.ts';
import dotenv from 'dotenv';
import i18nResolverPlugin from './plugins/i18nResolver.ts';
import importFeaturesPlugin from './plugins/importFeatures.ts';
import importFixesPlugin from './plugins/importFixes.ts';
import legacyPlugin from './plugins/legacy.ts';
import mustacheMinifyPlugin from './plugins/mustacheLoader.ts';
import type { PluginOption } from 'vite';
import postBuildFormatPlugin from './plugins/postBuildFormat.ts';
import scssPlugin from './plugins/scss.ts';
import terserPlugin from './plugins/terser.ts';
import userscriptPlugin from './plugins/userscript.ts';
import virtualFilesPlugin from './plugins/virtualFiles.ts';
import alterConfigPlugin, {
    type OXCJSXConfigs,
} from './plugins/alterConfig.ts';
import { type Context, BuildContext as ctx } from './context/index.ts';

type StringOrContextString = string | ((ctx: Context) => string);

export interface FrameworkConfig {
    jsx?: false | keyof OXCJSXConfigs;
    env?: Record<`VITE_${string}`, StringOrContextString>;
    virtualFiles?: Record<string, StringOrContextString>;
    performanceStops: Map<string, bigint>;
}

/**
 * A Framework that adds multiple plugins to vite
 * @param config - the framework config
 * @returns the list of plugins created by the framework
 */
export default function (config: FrameworkConfig): PluginOption {
    const env: Record<string, string> = {};
    Object.entries(config.env ?? {}).forEach(
        ([key, value]: [string, StringOrContextString]) => {
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
        virtualFilesPlugin(ctx, config.virtualFiles),
        mustacheMinifyPlugin(),

        terserPlugin(),
        legacyPlugin(ctx),

        userscriptPlugin(ctx),

        postBuildFormatPlugin(ctx),
        buildStatsPlugin(config, ctx),

        debugPlugin(ctx),
    ];
}
