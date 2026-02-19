import { defineConfig } from 'vite';
import UserscriptFrameworkPlugin from './tooling/framework';

const performanceStops = new Map<string, bigint>();
/**
 * @param id
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
                 * @param ctx
                 */
                VITE_SPEISEPLAN_CANTEEN_GLOB: ctx =>
                    `${ctx.paths.featureBase.replace(ctx.paths.root, '')}/speiseplan/canteens/${ctx.configId}.ts`,
                /**
                 * @param ctx
                 */
                VITE_SPEISEPLAN_PARSER_GLOB: ctx =>
                    `${ctx.paths.featureBase.replace(ctx.paths.root, '')}/speiseplan/parsers/${ctx.configId}.ts`,
            },
            performanceStops,
        }),
    ],
});

addPerfStop('config');
