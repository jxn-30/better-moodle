import { type Context } from '../context';
import createPlugin from './createPlugin';
import type { FrameworkConfig } from '../framework';
import fs from 'node:fs/promises';
import { includedPolyfillsList } from './legacy';
import path from 'node:path';

/**
 * @param cfg
 * @param ctx
 */
export default function (cfg: FrameworkConfig, ctx: Context) {
    return createPlugin('build-stats', {
        apply: 'build',
        /**
         * @param options
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
             * @param start
             * @param end
             */
            const getDur = (start: bigint, end: bigint) => end - start;
            /**
             * @param dur
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
