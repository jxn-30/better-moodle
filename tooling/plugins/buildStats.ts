import { type Context } from '../context';
import createPlugin from './createPlugin';
import type { FrameworkConfig } from '../framework';
import fs from 'node:fs/promises';
import { includedPolyfillsList } from './legacy';
import path from 'node:path';

/**
 * Creates a build statistics plugin for the Vite framework.
 * This plugin writes performance data and configuration details to files during the build process.
 * @param cfg - The framework configuration object
 * @param ctx - The build context object containing metadata
 * @returns The plugin object with the build hook
 */
export default function (cfg: FrameworkConfig, ctx: Context) {
    return createPlugin('build-stats', {
        apply: 'build',
        /**
         * Writes build statistics to files during the build process.
         * This method records performance metrics, configuration data, and build artifacts.
         * @param options - The options object containing build paths
         * @param options.dir - The output directory for statistics files
         */
        async writeBundle(options) {
            const dir = options.dir;

            if (!dir) return;

            const prefix = '.stats_';

            const featuresFile = path.join(dir, `${prefix}features.md`);
            const perfConfFile = path.join(dir, `${prefix}perf_conf`);
            const perfBuildFile = path.join(dir, `${prefix}perf_build`);
            const perfTotalFile = path.join(dir, `${prefix}perf_total`);
            const polyfillsListFile = path.join(dir, `${prefix}polyfills.md`);

            const timeConfig = {
                minute: '2-digit',
                second: '2-digit',
                fractionalSecondDigits: 3,
            } as const;

            /**
             * Calculates the duration between two timestamps in nanoseconds.
             * @param start - Start timestamp in nanoseconds
             * @param end - End timestamp in nanoseconds
             * @returns The duration in nanoseconds
             */
            const getDur = (start: bigint, end: bigint) => end - start;
            /**
             * Converts a duration in nanoseconds to a human-readable string.
             * @param dur - Duration in nanoseconds
             * @returns Formatted time string (e.g., "00:00.000")
             */
            const getDurString = (dur: bigint) =>
                new Date(Number(dur / 1_000_000n)).toLocaleTimeString(
                    'en',
                    timeConfig
                );

            const configDur = getDur(
                cfg.performanceStops.get('start')!,
                cfg.performanceStops.get('config')!
            );

            await Promise.all([
                fs.writeFile(featuresFile, ctx.featureListMarkdown),
                fs.writeFile(perfConfFile, getDurString(configDur)),
                fs.writeFile(
                    polyfillsListFile,
                    includedPolyfillsList()
                        .map(polyfill => `* ${polyfill}`)
                        .join('\n')
                ),
            ]);

            const totalDur = getDur(
                cfg.performanceStops.get('start')!,
                process.hrtime.bigint()
            );
            const buildDur = totalDur - configDur;

            await Promise.all([
                fs.writeFile(perfBuildFile, getDurString(buildDur)),
                fs.writeFile(perfTotalFile, getDurString(totalDur)),
            ]);
        },
    });
}
