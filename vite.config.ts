import { defineConfig } from 'vite';
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
        UserscriptFrameworkPlugin({
            jsx: 'jsx-dom',
            env: {
                /**
                 * Generates a glob pattern for the speiseplan to import relevant canteens.
                 * @param ctx - The Vite plugin context object.
                 * @returns The resolved glob pattern.
                 */
                VITE_SPEISEPLAN_CANTEEN_GLOB: ctx =>
                    `${ctx.paths.featureBase.replace(ctx.paths.root, '')}/speiseplan/canteens/${ctx.configId}.ts`,
                /**
                 * Generates a glob pattern for the speiseplan to import relevant parsers.
                 * @param ctx - The Vite plugin context object.
                 * @returns The resolved glob pattern.
                 */
                VITE_SPEISEPLAN_PARSER_GLOB: ctx =>
                    `${ctx.paths.featureBase.replace(ctx.paths.root, '')}/speiseplan/parsers/${ctx.configId}.ts`,
            },
            performanceStops,
        }),
    ],
});

addPerfStop('config');
