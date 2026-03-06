import { type Context } from '../context';
import createPlugin from './createPlugin';
import { type Plugin } from 'vite';

const VIRTUAL_FEAT_PUBLIC_ID = 'virtual:features';
const VIRTUAL_FEAT_RESOLVED_ID = `\0${VIRTUAL_FEAT_PUBLIC_ID}`;

const VIRTUAL_GROUP_PUBLIC_ID = 'virtual:featureGroups';
const VIRTUAL_GROUP_RESOLVED_ID = `\0${VIRTUAL_GROUP_PUBLIC_ID}`;

/**
 * Creates a Vite plugin for handling virtual feature modules.
 * This plugin generates import statements and object exports for
 * feature and feature group modules, enabling lazy loading and
 * modular organization of feature-based code.
 * @param ctx - The build context object containing metadata
 * @returns The plugin object with the resolveId and load hooks
 */
export default function (ctx: Context): Plugin[] {
    /**
     * Generates an import string for a feature module.
     * This function constructs the import statement for a specific
     * feature or feature group.
     * @param base - The base path for the feature modules
     * @param item - The feature or feature group name
     * @returns The generated import statement
     */
    const importString = (base: string, item: string) =>
        `import { default as ${item.replaceAll(
            '.',
            '_'
        )}} from ${JSON.stringify(`${base}/${item.replaceAll('.', '/')}`)};`;
    /**
     * Generates an object entry for a feature or feature group.
     * This function creates the key-value pair for the exported object.
     * @param item - The feature or feature group name
     * @returns The object entry string
     */
    const objectItem = (item: string) => {
        const normalizedItem = item.replaceAll('.', '_');
        return `${JSON.stringify(normalizedItem)}: ${normalizedItem},`;
    };

    const groupImportString = ctx.featureGroups
        .values()
        .map(group => importString('#feats', group))
        .toArray()
        .join('');
    const groupObjectString = `{${ctx.featureGroups
        .values()
        .map(group => objectItem(group))
        .toArray()
        .join('')}}`;

    const groupFile = `${groupImportString}; export default ${groupObjectString}`;

    const featImportString = ctx.features
        .values()
        .map(feat => importString('#feats', feat))
        .toArray()
        .join('');
    const featObjectString = `{${ctx.features
        .values()
        .map(feat => objectItem(feat))
        .toArray()
        .join('')}}`;

    const featFile = `${featImportString}; export default ${featObjectString}`;

    return [
        createPlugin('import-feature-groups', {
            /**
             * Resolves module imports for featureGroup modules.
             * This function checks if the requested module is a virtual featureGroup module
             * and returns a resolved ID if it matches.
             * @param source - The module identifier being imported
             * @returns The resolved module ID or undefined
             */
            resolveId(source) {
                if (source === VIRTUAL_GROUP_PUBLIC_ID) {
                    return VIRTUAL_GROUP_RESOLVED_ID;
                }
                return undefined;
            },
            /**
             * Loads the virtual module for featureGroup modules.
             * This function provides the exported object for featureGroup modules.
             * @param id - The resolved module ID
             * @returns The module content or null
             */
            load(id) {
                if (id === VIRTUAL_GROUP_RESOLVED_ID) return groupFile;
                return null;
            },
        }),
        createPlugin('import-features', {
            /**
             * Resolves module imports for feature modules.
             * This function checks if the requested module is a virtual feature module
             * and returns a resolved ID if it matches.
             * @param source - The module identifier being imported
             * @returns The resolved module ID or undefined
             */
            resolveId(source) {
                if (source === VIRTUAL_FEAT_PUBLIC_ID) {
                    return VIRTUAL_FEAT_RESOLVED_ID;
                }
                return undefined;
            },
            /**
             * Loads the virtual module for feature modules.
             * This function provides the exported object for feature modules.
             * @param id - The resolved module ID
             * @returns The module content or null
             */
            load(id) {
                if (id === VIRTUAL_FEAT_RESOLVED_ID) return featFile;
                return null;
            },
        }),
    ];
}
