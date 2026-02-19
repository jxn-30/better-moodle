import { polyfillsCopyright } from '../utils/copyright';
import type { Context } from '../context';
import type { Plugin } from 'vite';
import legacy from '@vitejs/plugin-legacy';

// we need to make it an iife, otherwise global scope would be altered
// this would cause e.g. that Moodles global `M` would not be useable without using
// `unsafeWindow.M` as the core-js resource would have overwritten `M` in the userscripts scope.
/**
 * @param ctx
 * @param raw
 */
const getPolyfillsCode = (ctx: Context, raw: string) =>
    `
${polyfillsCopyright(ctx)}
(() => {${raw}})();
    `.trim();

const includedPolyfills = new Set<string>();

/**
 * @param imports
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
 *
 */
export const includedPolyfillsList = () =>
    includedPolyfills.values().toArray().toSorted();

/**
 * @param ctx
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
     * @param options
     * @param bundle
     */
    generatePlugin.generateBundle = async function (options, bundle) {
        if ('handler' in generateBundleOrig) {
            throw new Error(
                'Legacy-plugin cannot be altered if generateBundle'
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
