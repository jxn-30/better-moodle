import { defineConfig } from 'vite';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import UserscriptFrameworkPlugin from './tooling/framework';

const performanceStops = new Map<string, bigint>();
/**
 * Adds a performance measurement point with the given ID.
 * @param id - The identifier for the performance stop.
 * @returns void
 */
const addPerfStop = (id: string) =>
    performanceStops.set(id, process.hrtime.bigint());

addPerfStop('start');

export default defineConfig({
    plugins: [
        paraglideVitePlugin({
            project: './src/i18n/project.inlang',
            outdir: './src/i18n/paraglide',
            // Nur baseLocale als Strategie – wir überschreiben getLocale() selbst in i18n.ts
            strategy: ['baseLocale'],
            emitTsDeclarations: true,
        }),

        UserscriptFrameworkPlugin({
            jsx: 'jsx-dom',
            env: {
                /**
                 * Generates a glob pattern for the speiseplan to import relevant canteens.
                 * @param ctx - The Vite plugin context object.
                 * @returns The resolved glob pattern.
                 */
                VITE_SPEISEPLAN_CANTEEN_GLOB: ctx =>
                    ctx.paths.toPOSIX(
                        `${ctx.paths.featureBase.replace(ctx.paths.root, '')}/speiseplan/canteens/${ctx.configId}.ts`
                    ),
                /**
                 * Generates a glob pattern for the speiseplan to import relevant parsers.
                 * @param ctx - The Vite plugin context object.
                 * @returns The resolved glob pattern.
                 */
                VITE_SPEISEPLAN_PARSER_GLOB: ctx =>
                    ctx.paths.toPOSIX(
                        `${ctx.paths.featureBase.replace(ctx.paths.root, '')}/speiseplan/parsers/${ctx.configId}.ts`
                    ),
            },
            performanceStops,
        }),
    ],
});

addPerfStop('config');
