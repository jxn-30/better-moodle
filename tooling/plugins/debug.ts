import { type Context } from '../context';
import createPlugin from './createPlugin';
import { type PluginOption } from 'vite';

/**
 * A plugin to log some debug information, if vite is called in debug mode
 * @param ctx - the build context
 * @returns false if not in debug mode, otherwise a plugin that logs debug information
 */
export default function (ctx: Context): PluginOption {
    // This plugin should be enabled in debug mode only
    if (!process.env.DEBUG) return false;

    return createPlugin('debug', {
        /**
         * Log information once all files have been written
         */
        writeBundle() {
            // Get the list (and order) of imported modules, relative to project root.
            // This allows checking if all files are included in the bundle and none of them is missed.
            const importsList = Array.from(this.getModuleIds()).map(mod =>
                mod.replace(ctx.paths.root, '')
            );
            console.log(`imported ${importsList.length} files`, importsList);
        },
    });
}
