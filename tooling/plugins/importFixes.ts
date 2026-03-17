import { type Context } from '../context';
import createPlugin from './createPlugin';
import { type PluginOption } from 'vite';

const VIRTUAL_PUBLIC_ID = 'virtual:fixes';
const VIRTUAL_RESOLVED_ID = `\0${VIRTUAL_PUBLIC_ID}`;

/**
 * Creates a Vite plugin to handle virtual import fixes.
 * @param ctx - The Vite plugin context object.
 * @returns The plugin configuration object.
 */
export default function (ctx: Context): PluginOption {
    const importString = ctx.fixes
        .map(fix => `import ${JSON.stringify(`#fixes/${fix}`)};`)
        .join('');

    return createPlugin('import-fixes', {
        /**
         * Resolves the virtual import ID to a resolved path.
         * @param source - The source ID to resolve.
         * @returns The resolved ID if the source matches the virtual public ID, otherwise undefined.
         */
        resolveId(source) {
            if (source === VIRTUAL_PUBLIC_ID) return VIRTUAL_RESOLVED_ID;
            return undefined;
        },
        /**
         * Loads the virtual module content as an import string.
         * @param id - The ID of the module to load.
         * @returns The import string if the ID matches the resolved virtual ID, otherwise null.
         */
        load(id) {
            if (id === VIRTUAL_RESOLVED_ID) return importString;
            return null;
        },
    });
}
