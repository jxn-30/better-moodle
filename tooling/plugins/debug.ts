import createPlugin from './createPlugin';
import { type PluginOption } from 'vite';
import { type Context } from '../context';

export default function(ctx: Context): PluginOption {
    // This plugin should be enabled in debug mode only
    console.log(process.env, process.env.DEBUG);
    if (!process.env.DEBUG) return false;

    return createPlugin('debug', {
        writeBundle() {
            // Get the list (and order) of imported modules, relative to project root.
            // This allows checking if all files are included in the bundle and none of them is missed.
            const importsList = this.getModuleIds().map(mod => mod.replace(ctx.paths.root, '')).toArray();
            console.log(`imported ${importsList.length} files`, importsList);
        }
    })
}
