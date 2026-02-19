import createPlugin from './createPlugin';
import { type Context } from '../context';
import path from 'node:path';
import { type Plugin, type UserConfig } from 'vite';
import { type Importer } from 'sass-embedded';

const CONSTANTS_FILE = 'global:constants.scss';

/**
 * @param vars
 */
const toScssVariables = (vars: Record<string, unknown>) =>
    Object.entries(vars)
        // Only strings an numbers will be "exported" to scss
        .filter(
            ([, value]) =>
                typeof value === 'string' || typeof value === 'number'
        )
        .map(([name, value]) => {
            const normalizedName = name.replace(/^_+|_+$/g, '');
            return `$${normalizedName}: ${JSON.stringify(value)};`;
        })
        .join('\n');

/**
 * @param globalConstants
 */
const getImporter = (
    globalConstants: Context['GLOBAL_CONSTANTS']
): Importer => ({
    /**
     * Urlifies the constants imports, otherwise forwards to standard importer
     * @param url - the url to canonicalize
     * @returns null or the urlified import
     */
    canonicalize(url: string) {
        if (url === CONSTANTS_FILE) {
            return new URL(url);
        }
        return null;
    },
    /**
     * Creates a scss string with global constants
     * @param canonicalUrl
     * @returns the contents with style
     */
    load(canonicalUrl) {
        if (canonicalUrl.href === CONSTANTS_FILE) {
            return {
                contents: toScssVariables(globalConstants),
                syntax: 'scss',
            };
        }
        return null;
    },
});

/**
 * @param prefix
 * @param prefix.prefix
 * @param prefix.paths
 */
const generateScopedName =
    ({ prefix, paths }: Context) =>
    /**
     * Generates a scoped class or id based on filename (feature)
     * @param name - the class or id that is to be scoped
     * @param filename - the filename this class or id lives in to extract the feature from
     * @returns the scoped class or id
     */
    (name: string, filename: string) => {
        const feat = path
            .relative(paths.root, filename)
            .replace(
                /^src\/(style|features)\/|(\/?style|\/?index)?\.module\.(scss|sass)$/g,
                ''
            ) // extract feature name
            .replace(/[^a-zA-Z0-9_-]/g, '-') // replace invalid characters with hyphen
            .replace(/-+/g, '-'); // reduce multiple hyphens to a single one

        // create new classname out of prefix, feature and old className
        const className = `${prefix}_${feat}__${name}`;

        return className.replace(/_{3,}/g, '__'); // reduce 3+ underscores to 2
    };

/**
 * @param ctx
 */
export default function (ctx: Context): Plugin {
    const config = {
        preprocessorOptions: {
            scss: {
                additionalData: `@use ${JSON.stringify(CONSTANTS_FILE)} as global;`,
                importers: [getImporter(ctx.GLOBAL_CONSTANTS)],
            },
        },
        modules: {
            scopeBehaviour: 'global',
            exportGlobals: false,
            hashPrefix: ctx.prefix,
            localsConvention: 'camelCaseOnly',
            generateScopedName: generateScopedName(ctx),
        },
    } satisfies UserConfig['css'];

    return createPlugin('scss', {
        /**
         *
         */
        config() {
            return { css: config };
        },
    });
}
