import type { Context } from '../context';
import legacy from '@vitejs/plugin-legacy';
import type { Plugin } from 'vite';
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
export default function (ctx: Context): Plugin[] {
    const plugins = legacy({
        modernTargets: ctx.browsers,
        modernPolyfills: true, // vorher auslesen, damit wirs für später wissen?
        renderLegacyChunks: false,
        renderModernChunks: true,
    });

    const generatePlugin = plugins.find(
        ({ name }) => name === 'vite:legacy-generate-polyfill-chunk'
    );

    if (!generatePlugin) {
        throw new Error(
            "We couldn't enhance the legacy plugin because we couldn't find it."
        );
    }

    const generateBundleOrig = generatePlugin.generateBundle;

    if (!generateBundleOrig) {
        throw new Error(
            'The legacy-plugin does not have a generateBundle hook.'
        );
    }

    /**
     * Enhances the legacy plugin's generateBundle hook to handle polyfill generation.
     * It wraps the polyfills into an IIFE and ensures, they are emitted in an extra file.
     * @param options - Vite build options.
     * @param bundle - The bundle object containing chunks and assets.
     * @returns A promise resolving when the bundle is processed.
     */
    generatePlugin.generateBundle = async function (options, bundle) {
        if ('handler' in generateBundleOrig) {
            throw new Error(
                "Cannot enhance legacy plugin: its generateBundle hook uses the object form (has a 'handler' property)."
            );
        }

        const result = await generateBundleOrig.call(
            this,
            options,
            bundle,
            false
        );

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

        return result;
    };

    return plugins;
}
