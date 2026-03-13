import * as sass from 'sass-embedded';
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

type JSValue =
    | boolean
    | number
    | string
    | JSValue[]
    | { [key: string | number]: JSValue };

/**
 * Converts a sass value to its corresponding JS value
 * @param value - a sass value
 * @returns a serializable JS version of the sass value
 * @throws {Error} if converting is not available (yet) for the sass values' type
 */
const sassValueToJS = (value: sass.Value): JSValue => {
    // boolean
    if (value instanceof sass.SassBoolean) return value.value;
    // color
    if (value instanceof sass.SassColor) {
        return value.toString();
        /* // This doesn't work with alpha values yet, needs to be improved at latest when needed.
        const red = value.channel('red', {space: 'rgb'}).toString(16);
        const green = value.channel('green', {space: 'rgb'}).toString(16);
        const blue = value.channel('blue', {space: 'rgb'}).toString(16);
        const alpha = value.channel('alpha');
        if (alpha) return `#${red}${green}${blue}${alpha}`.toUpperCase();
        return `#${red}${green}${blue}`.toUpperCase();
        */
    }
    // list
    if (value instanceof sass.SassList) {
        return value.asList.map(v => sassValueToJS(v)).toArray();
    }
    // map
    if (value instanceof sass.SassMap) {
        const jsObject: Record<string | number, JSValue> = {};
        Object.entries(value.contents.toJSON()).forEach(
            ([key, value]) => (jsObject[key] = sassValueToJS(value))
        );
        return jsObject;
    }
    // number
    if (value instanceof sass.SassNumber) {
        if (value.hasUnits) return value.toString();
        return value.value;
    }
    // string
    if (value instanceof sass.SassString) return value.text;

    // Fallback: throw
    throw new Error(
        `JSONifying a sass value of type ${JSON.stringify(
            value.constructor.name
        )} seems not to be implemented yet :(`
    );
};

/**
 * Turns a sass value into a sass string, representing the stringified sass value
 * @param root0 - a list of sass values where the first one is processed
 * @param root0."0" - the sass value that should be stringified
 * @returns the stringified version of the sass value, as a sass string
 */
const sassValueToJSON = ([arg]: sass.Value[]) =>
    new sass.SassString(JSON.stringify(sassValueToJS(arg)));

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
                functions: { 'JSON($value)': sassValueToJSON },
            },
        },
        modules: {
            scopeBehaviour: 'global',
            exportGlobals: false,
            hashPrefix: ctx.prefix,
            localsConvention: 'camelCaseOnly',
            generateScopedName: generateScopedName(ctx),
            /**
             * The getJSON method for postcss-modules, parsing imported variables if necessary
             * @param fileName - the file imported, including possible query parameters
             * @param modules - the exported content of the style file
             */
            getJSON: (fileName, modules) => {
                if (fileName.endsWith('.module.scss?json')) {
                    Object.entries(modules).forEach(([key, value]) => {
                        // JSON strings will be enclosed in single quotes for a reason that surely is obvious but we didn't find it yet
                        const sanitizedValue = value.replace(/^'|'$/g, '');
                        // actually, this would be a JSValue but Types say that it can only be a string (for some reason)
                        modules[key] = JSON.parse(sanitizedValue) as string;
                    });
                }
            },
        },
    } satisfies UserConfig['css'];

    return createPlugin('scss', {
        /**
         * Configures the SCSS use for vite.
         * @returns The css configuration created by the plugin.
         */
        config() {
            // If we are testing the userscript, we need also need to alter test config
            if (process.env.VITEST && process.env.VITEST_USERSCRIPT) {
                return {
                    css: config,
                    test: {
                        css: {
                            include: /.+/,
                            modules: {
                                ...config.modules,
                                classNameStrategy: 'scoped',
                            },
                        },
                    },
                };
            }
            return { css: config };
        },
    });
}
