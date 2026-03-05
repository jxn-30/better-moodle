import { type Context } from '../context';
import createPlugin from './createPlugin';
import { type Importer } from 'sass-embedded';
import path from 'node:path';
import { type Plugin, type UserConfig } from 'vite';

const CONSTANTS_FILE = 'global:constants.scss';

/**
 * Converts a variables object to a string of SCSS variables.
 * @param vars - The variables object to convert.
 * @returns A string containing SCSS variables in the format $name: value;.
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
 * Creates an importer for global constants in SCSS.
 * @param globalConstants - The global constants from the context.
 * @returns An importer object that provides the global constants as SCSS variables.
 */
const getImporter = (
    globalConstants: Context['GLOBAL_CONSTANTS']
): Importer => ({
    /**
     * Urlifies the constants imports, otherwise forwards to standard importer.
     * @param url - The URL to canonicalize.
     * @returns Null or the urlified import.
     */
    canonicalize(url: string) {
        if (url === CONSTANTS_FILE) {
            return new URL(url);
        }
        return null;
    },
    /**
     * Returns a scss string with global constants as scss import.
     * @param canonicalUrl - The canonicalized URL.
     * @returns The constants declarations, or null if not matching the constants file.
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
 * Create a function that generates a scoped class or id based on filename (feature).
 * @param ctx - The Vite plugin context object.
 * @param ctx.prefix - The base prefix for scoping.
 * @param ctx.paths - The paths object used to derive the feature name.
 * @returns The function to generate a scoped name.
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
 * Creates a SCSS plugin for the Vite framework.
 * @param ctx - The Vite plugin context object.
 * @returns The resolved plugin configuration for Vite.
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
         * Configures the SCSS use for vite.
         * @returns The css configuration created by the plugin.
         */
        config() {
            return { css: config };
        },
    });
}
