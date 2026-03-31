import { type Context } from '../context';
import createPlugin from './createPlugin';
import { type FrameworkConfig } from '../framework';
import { type PluginOption } from 'vite';

/**
 * Creates a Vite plugin to create and handle virtual files
 * @param ctx - the Vite plugin context object
 * @param files - A record of files with their content
 * @returns The plugin
 */
export default function (
    ctx: Context,
    files: FrameworkConfig['virtualFiles']
): PluginOption {
    if (!files || Object.keys(files).length === 0) return false;

    const fileNames = new Set<string>();
    const importStrings = new Map<string, string>();
    Object.entries(files).forEach(([file, content]) => {
        const fileName = `virtual:${file}`;
        fileNames.add(fileName);
        if (typeof content === 'string') {
            importStrings.set(`\0${fileName}`, content);
        } else importStrings.set(`\0${fileName}`, content(ctx));
    });

    return createPlugin('virtual-files', {
        /**
         * Resolves the virtual import ID to a resolved path.
         * @param source - The source ID to resolve.
         * @returns The resolved ID if the source matches one of the virtual public IDs, otherwise undefined.
         */
        resolveId(source) {
            if (fileNames.has(source)) return `\0${source}`;
            return undefined;
        },
        /**
         * Loads the virtual module content as an import string.
         * @param id - The ID of the module to load.
         * @returns The import string if the ID matches one of the resolved virtual IDs, otherwise null.
         */
        load(id) {
            if (importStrings.has(id)) return importStrings.get(id);
            return null;
        },
    });
}
