import { type Context } from '../context/index.ts';
import createPlugin from './createPlugin.ts';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { type PluginOption } from 'vite';

/**
 * Creates a plugin that compiles translations and stubs paraglide runtime
 * @param ctx - the build context
 * @returns paraglide plugin and runtime resolver plugin
 */
export default function (ctx: Context): PluginOption[] {
    const PROJECT_DIR = ctx.paths.inlangPath; // './src/i18n/project.inlang';
    const OUT_DIR = ctx.paths.paraglidePath; // './src/i18n/paraglide';

    const paraglidePlugin = paraglideVitePlugin({
        project: PROJECT_DIR,
        outdir: OUT_DIR,
        // We implement a custom getLocale() so we need no strategy in here.
        strategy: [],
        outputStructure: 'message-modules',
        emitTsDeclarations: true,
        isServer: 'false',
        disableAsyncLocalStorage: true,
    });

    const runtimeResolver = createPlugin('i18n-runtime-resolver', {
        enforce: 'pre',
        /**
         * Redirects paraglide runtime to custom stubs when using them within messages
         * @param source - the path to runtime
         * @param importer - the path that imports runtime
         * @returns the stubs path if necessary, otherwise undefined
         */
        resolveId: (source, importer) => {
            // Is the runtime being imported by a message?
            if (source.includes('runtime') && importer?.startsWith(OUT_DIR)) {
                // Then use our paraglide i18n as a stub for the runtime
                return ctx.paths.resolve('#i18n-p');
            }
            return undefined;
        },
    });

    return [paraglidePlugin, runtimeResolver];
}
