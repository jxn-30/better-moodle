import { type Context } from './tooling/context';
import { createImportExport } from './tooling/utils/importBuilder';
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

/**
 * A virtual file that forwards the build-specific Speiseplan canteens list
 * @param ctx - build context
 * @returns content of the virtual file
 */
const speiseplanCanteensImport = (ctx: Context) =>
    createImportExport(
        `${ctx.paths.featureBase}/speiseplan/canteens/${ctx.configId}.ts`,
        { default: 'canteens' }
    );
/**
 * A virtual file that forwards the build-specific Speiseplan parser
 * @param ctx - build context
 * @returns content of the virtual file
 */
const speiseplanParserImport = (ctx: Context) =>
    createImportExport(
        `${ctx.paths.featureBase}/speiseplan/parsers/${ctx.configId}.ts`,
        { default: 'parse' }
    );

export default defineConfig({
    plugins: [
        UserscriptFrameworkPlugin({
            jsx: 'jsx-dom',
            virtualFiles: {
                'speiseplan-canteens': speiseplanCanteensImport,
                'speiseplan-parser': speiseplanParserImport,
            },
            performanceStops,
        }),
    ],
});

addPerfStop('config');
