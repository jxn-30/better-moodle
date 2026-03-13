import { type Context } from '../context';
import createPlugin from './createPlugin';
import path from 'node:path';
import { type Plugin, type PluginOption } from 'vite';

const VIRTUAL_PUBLIC_ID = 'virtual:userscript-framework/i18n-undefined';
const VIRTUAL_RESOLVED_ID = `\0${VIRTUAL_PUBLIC_ID}`;

/**
 * Create a function that resolves module imports for i18n files.
 * The returned function checks if the requested module is a virtual i18n module
 * and returns a fallback ID if the translation is not available.
 * @param ctx - The build context object containing metadata
 * @returns the resolver function
 */
const resolveId =
    (ctx: Context): Plugin['resolveId'] =>
    (source, importer) => {
        if (!importer) return undefined;

        // For some reason, with vite@8, jsx-dom suddenly passed all checks and the undefined-i18n was about to be used instead.
        if (source === 'jsx-dom') return undefined;

        // TODO: Improve this to rely less on the exact i18n structure

        // Resolve virtual module itself
        if (source === VIRTUAL_PUBLIC_ID) return VIRTUAL_RESOLVED_ID;

        // Determine the absolute path of the imported file
        const sourcePath = path.resolve(path.dirname(importer), source);

        // Trying to load index translations? Only if the group is enabled!
        const indexRegex =
            /src\/features\/(?<featureGroup>[^/]+)\/i18n(\/index(\.tsx?)?)?$/;
        let indexMatch;
        if ((indexMatch = indexRegex.exec(sourcePath))) {
            const { featureGroup } = indexMatch.groups!;
            // dirname (/.../<feature>/i18n) -> dirname (/.../<feature>) -> basename (<feature>)
            // const featureGroup = path.basename(path.dirname(path.dirname(sourcePath)));

            // is enabled? => continue to next resolver
            if (ctx.featureGroups.has(featureGroup)) return undefined;

            // disabled => return the virtual module
            return VIRTUAL_RESOLVED_ID;
        }

        // Loading from an translation index file
        if (indexRegex.test(importer)) {
            // If the translation is not within an i18n folder, include it.
            // Used e.g. for weather condition translations
            // Improvements for this are still tbd
            if (!sourcePath.includes('i18n')) return undefined;

            const match =
                /src\/features\/(?<featureGroup>[^/]+)\/i18n\/(?<feature>[^/]+)(\.tsx?)?$/.exec(
                    sourcePath
                );

            const regexGroups = match?.groups;

            if (!regexGroups) return undefined;

            // is enabled? => continue to next resolver
            if (
                ctx.features.has(
                    `${regexGroups.featureGroup}.${regexGroups.feature}`
                )
            ) {
                return undefined;
            }

            // disabled => return the virtual module
            return VIRTUAL_RESOLVED_ID;
        }

        // This does not seem to be an import relevant for i18n, thus continue to next resolver
        return undefined;
    };

const undefinedI18nFile = `
export const de = undefined;
export const en = undefined;

export default { de, en };
`;

/**
 * Creates a Vite plugin for handling i18n (internationalization) resolution.
 * This plugin resolves virtual modules for translations of disabled features.
 * Disabled features will receive undefined translations, removing clutter and noise in the userscript.
 * @param ctx - The build context object containing metadata
 * @returns The plugin object with the resolveId and load hooks
 */
export default function (ctx: Context): PluginOption {
    // This plugin should be disabled in tests (because it breaks tests?)
    if (process.env.VITEST) return false;

    return createPlugin('i18n-resolver', {
        enforce: 'pre',
        resolveId: resolveId(ctx),
        /**
         * Loads the virtual module for disabled i18n files.
         * @param id - The resolved module ID
         * @returns The module content or null
         */
        load(id) {
            if (id !== VIRTUAL_RESOLVED_ID) return null;
            return undefinedI18nFile;
        },
    });
}
