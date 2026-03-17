import type { Context } from '../context';
import createPlugin from './createPlugin';
import legacy from '@vitejs/plugin-legacy';
import type { PluginOption } from 'vite';
import { polyfillsCopyright } from '../utils/copyright';

// we need to make it an iife, otherwise global scope would be altered
// this would cause e.g. that Moodles global `M` would not be useable without using
// `unsafeWindow.M` as the core-js resource would have overwritten `M` in the userscripts scope.
/**
 * Generates polyfill code for the Vite plugin.
 * @param ctx - The Vite plugin context object.
 * @param raw - The source code string to be processed.
 * @returns The generated polyfill code wrapped in an IIFE.
 */
const getPolyfillsCode = (ctx: Context, raw: string) =>
    `
${polyfillsCopyright(ctx)}
(() => {${raw}})();
    `.trim();

const includedPolyfills = new Set<string>();

/**
 * Processes imports to collect polyfill modules.
 * Mutates the state of included polyfills.
 * @param imports - An array of module paths to analyze.
 */
const getPolyfillsFromImports = (imports: string[]) => {
    includedPolyfills.clear();

    imports
        .filter(
            mod => mod.includes('/core-js/modules/') && !mod.startsWith('\0')
        )
        .map(file => file.replace(/^.*(?=core-js\/modules\/)/, ''))
        .filter((file, _, list) => {
            if (
                file.includes('es.') &&
                list.includes(file.replace('es.', 'esnext.'))
            ) {
                return false;
            }
            return true;
        })
        .toSorted()
        .forEach(polyfill => includedPolyfills.add(polyfill));
};

/**
 * Returns the sorted list of included polyfill modules.
 * @returns An array of polyfill module names.
 */
export const includedPolyfillsList = () =>
    includedPolyfills.values().toArray().toSorted();

/**
 * Vite plugin for handling polyfill generation in legacy builds.
 * @param ctx - The Vite plugin context object.
 * @returns An array of Vite plugins configured for polyfill handling.
 * @throws {Error} If the legacy plugin is not found or lacks required hooks.
 */
export default function (ctx: Context): PluginOption {
    const plugins = legacy({
        modernTargets: ctx.browsers,
        modernPolyfills: true, // vorher auslesen, damit wirs für später wissen?
        renderLegacyChunks: false,
        renderModernChunks: true,
    });

    const generatePluginIndex = plugins.findIndex(
        ({ name }) => name === 'vite:legacy-generate-polyfill-chunk'
    );

    if (generatePluginIndex === -1) {
        throw new Error(
            "We couldn't enhance the legacy plugin because we couldn't find it."
        );
    }

    const externalizePlugin = createPlugin(
        'vite:legacy-externalize-polyfill-chunk',
        {
            /**
             * Wraps the generated polyfills into an IIFE and ensures, they are emitted in an extra file.
             * @param _ - Vite build options.
             * @param bundle - The bundle object containing chunks and assets.
             */
            generateBundle(_, bundle) {
                for (const [fileName, chunkOrAsset] of Object.entries(bundle)) {
                    if (
                        chunkOrAsset.type !== 'chunk' ||
                        !fileName.startsWith('polyfills-') ||
                        chunkOrAsset.name !== 'polyfills'
                    ) {
                        continue;
                    }

                    getPolyfillsFromImports(chunkOrAsset.moduleIds);

                    const output = getPolyfillsCode(ctx, chunkOrAsset.code);

                    this.emitFile({
                        type: 'asset',
                        fileName: ctx.dist.polyfills,
                        source: output,
                    });

                    delete bundle[fileName];
                }
            },
        }
    );

    plugins.splice(generatePluginIndex + 1, 0, externalizePlugin);

    return plugins;
}
