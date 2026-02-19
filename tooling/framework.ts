import { type Context, BuildContext as ctx } from './context';
import alterConfigPlugin, {
    type ESBuildJSXConfigs,
} from './plugins/alterConfig';
import dotenv from 'dotenv';
import i18nResolverPlugin from './plugins/i18nResolver';
import importFixesPlugin from './plugins/importFixes';
import importFeaturesPlugin from './plugins/importFeatures';
import mustacheMinifyPlugin from './plugins/mustacheLoader';
import scssPlugin from './plugins/scss';
import userscriptPlugin from './plugins/userscript';
import terserPlugin from './plugins/terser';
import legacyPlugin from './plugins/legacy';
import postBuildFormatPlugin from './plugins/postBuildFormat';
import buildStatsPlugin from './plugins/buildStats';
import type { PluginOption } from 'vite';

type EnvValue = string | ((ctx: Context) => string);

export interface FrameworkConfig {
    jsx?: false | keyof ESBuildJSXConfigs;
    env?: Record<`VITE_${string}`, EnvValue>;
    performanceStops: Map<string, bigint>;
}

/**
 * A Plugin constructor function extending the config
 * @param config
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

        // for debugging purposes!
        /*{
            name: 'userscript:debug',
            writeBundle() {
                this.getModuleIds().forEach(mod => console.log(mod, this.getModuleInfo(mod)));
            }
        }*/
    ];
}
