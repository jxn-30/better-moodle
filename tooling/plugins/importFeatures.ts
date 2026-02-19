import createPlugin from './createPlugin';
import { type Context } from '../context';
import { type Plugin } from 'vite';

const VIRTUAL_FEAT_PUBLIC_ID = 'virtual:features';
const VIRTUAL_FEAT_RESOLVED_ID = `\0${VIRTUAL_FEAT_PUBLIC_ID}`;

const VIRTUAL_GROUP_PUBLIC_ID = 'virtual:featureGroups';
const VIRTUAL_GROUP_RESOLVED_ID = `\0${VIRTUAL_GROUP_PUBLIC_ID}`;

/**
 * @param ctx
 */
export default function (ctx: Context): Plugin[] {
    /**
     * @param base
     * @param item
     */
    const importString = (base: string, item: string) =>
        `import { default as ${item.replaceAll(
            '.',
            '_'
        )}} from ${JSON.stringify(`${base}/${item.replaceAll('.', '/')}`)};`;
    /**
     * @param item
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
             * @param source
             */
            resolveId(source) {
                if (source === VIRTUAL_GROUP_PUBLIC_ID) {
                    return VIRTUAL_GROUP_RESOLVED_ID;
                }
                return undefined;
            },
            /**
             * @param id
             */
            load(id) {
                if (id === VIRTUAL_GROUP_RESOLVED_ID) return groupFile;
                return null;
            },
        }),
        createPlugin('import-features', {
            /**
             * @param source
             */
            resolveId(source) {
                if (source === VIRTUAL_FEAT_PUBLIC_ID) {
                    return VIRTUAL_FEAT_RESOLVED_ID;
                }
                return undefined;
            },
            /**
             * @param id
             */
            load(id) {
                if (id === VIRTUAL_FEAT_RESOLVED_ID) return featFile;
                return null;
            },
        }),
    ];
}
