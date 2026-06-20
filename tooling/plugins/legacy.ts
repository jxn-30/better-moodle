import type { Context } from '../context';
import createPlugin from './createPlugin';
import type { PluginOption } from 'vite';
import { polyfillsCopyright } from '../utils/copyright';
import legacy, { detectPolyfills } from '@vitejs/plugin-legacy';

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
${polyfillsCopyright(ctx, includedPolyfillsList())}
(() => {${raw}})();
    `.trim();

const includedPolyfills = new Set<string>();

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
        modernPolyfills: true,
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

    const listPlugin = createPlugin('vite:legacy-list-polyfills', {
        /**
         * Collects the polyfills included by \@vitejs/plugin-legacy
         * @param _ - Vite build options
         * @param bundle - The bundle object containing chunks and assets.
         */
        async generateBundle(_, bundle) {
            for (const [fileName, chunkOrAsset] of Object.entries(bundle)) {
                if (
                    chunkOrAsset.type !== 'chunk' ||
                    !fileName.startsWith('core-') ||
                    chunkOrAsset.name !== 'core'
                ) {
                    continue;
                }

                await detectPolyfills(
                    chunkOrAsset.code,
                    ctx.browsers,
                    {},
                    includedPolyfills
                );
                return;
            }
        },
    });

    if (ctx.args.produceSingleFile) {
        return plugins.toSpliced(generatePluginIndex + 1, 0, listPlugin);
    }

    ctx.userscript.require.add(ctx.dist.polyfills);

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

    return plugins.toSpliced(
        generatePluginIndex + 1,
        0,
        listPlugin,
        externalizePlugin
    );
}
