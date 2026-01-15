import fastGlob from 'fast-glob';
import type { Plugin } from 'vite';

// Wörkaround for
// * https://github.com/microsoft/TypeScript/issues/61321
// * https://github.com/microsoft/TypeScript/pull/62138
declare global {
    interface RegExpConstructor {
        escape(str: string): string;
    }
}

const prefix = 'better-moodle:import:';

/**
 * Creates an import string for a path
 * @param path - the path to import from
 * @returns a valid js import
 */
const importStr = (path: string) => `import ${JSON.stringify(path)};`;
/**
 * Creates an import string for a path to import the default with a specific name
 * @param path - the path to import from
 * @param name - the name to import the default as
 * @returns a valid js import
 */
const importDefaultStr = (path: string, name: string) =>
    `import { default as ${name} } from ${JSON.stringify(path)};`;
/**
 * Creates a stringified object where each key is an identifier to the correct value
 * @param items - the items the object should contain
 * @returns a valid stringified js object
 */
const simpleObjectStr = (items: string[]) =>
    `{${items.map(item => `${JSON.stringify(item)}: ${item},`).join('')}}`;

/**
 * Creates the plugin that handles importing the fixes
 * @param base - the base path where all fixes live in
 * @param fixes - a list of the fixes that should be included
 * @returns the plugin that imports the fixes
 */
const fixImporterPlugin = (base: string, fixes: string[]): Plugin => {
    const toBeReplaced = 'import.meta.fixes()';
    const replacerRegex = new RegExp(RegExp.escape(toBeReplaced), 'g');

    const fixImports = fixes
        .toSorted()
        .map(fix => importStr(`${base}${fix}`))
        .join('');

    return {
        name: `${prefix}fixes`,
        transform: {
            filter: { code: toBeReplaced },
            /**
             * This transformer handles importing the fixes
             * @param src - the source code which contains the import
             * @returns the source code with fixes imports
             */
            handler(src) {
                return fixImports + src.replace(replacerRegex, '');
            },
        },
    };
};

/**
 * Creates the plugin that handles importing featureGroups and features
 * @param base - the base path where all features live in
 * @param featureGroups - a set of identifiers of featureGroups that should be included
 * @param features - a set of identifiers of features that should be included
 * @returns the plugin that imports the featureGroups and features
 */
const featureImporterPlugin = (
    base: string,
    featureGroups: Set<string>,
    features: Set<string>
): Plugin => {
    const featureGroupsToBeReplaced = 'import.meta.featureGroups';
    const featureGroupsReplacerRegex = new RegExp(
        RegExp.escape(featureGroupsToBeReplaced),
        'g'
    );
    const featuresToBeReplaced = 'import.meta.features';
    const featuresReplacerRegex = new RegExp(
        RegExp.escape(featuresToBeReplaced),
        'g'
    );

    const featureGroupIds = featureGroups.values().toArray().toSorted();
    const featureGroupImports = featureGroupIds
        .map(group => importDefaultStr(`${base}${group}`, group))
        .join('');
    const featureGroupObject = simpleObjectStr(featureGroupIds);

    const featureGlobParts = features
        .values()
        .map(feat =>
            feat.includes('.') ? feat.replace('.', '/') : `${feat}/!(index)`
        )
        .toArray()
        .join(',');
    const featureGlob = `.${base}{${featureGlobParts}}.{ts,tsx}`;
    const featureIds = fastGlob
        .sync(featureGlob)
        .map(f =>
            f
                .replace(`.${base}`, '')
                .replace(/\//g, '_')
                .replace(/\.tsx?$/, '')
        )
        .toSorted();
    const featureImports = featureIds
        .map(feat => importDefaultStr(base + feat.replace(/_/g, '/'), feat))
        .join('');
    const featureObject = simpleObjectStr(featureIds);

    return {
        name: `${prefix}features`,
        transform: {
            filter: {
                code: {
                    include: [featureGroupsToBeReplaced, featuresToBeReplaced],
                },
            },
            /**
             * This transformer handles importing featureGroups and features
             * @param src - the source code which contains the imports
             * @returns the source cohe with featureGroups and features imports as well as their import objects
             */
            handler(src) {
                return (
                    featureGroupImports +
                    featureImports +
                    src
                        .replace(featureGroupsReplacerRegex, featureGroupObject)
                        .replace(featuresReplacerRegex, featureObject)
                );
            },
        },
    };
};

/**
 * Creates basic importer plugin, consisting of multiple helper plugins
 * @param featureBase - the base path where all features live in
 * @param featureGroups - a set of identifiers of featureGroups that should be included
 * @param features - a set of identifiers of features that should be included
 * @param fixesBase - the base path where all fixes live in
 * @param fixes - a list of the fixes that should be included
 * @returns A list of the plugins that are included
 */
export default function (
    featureBase: string,
    featureGroups: Set<string>,
    features: Set<string>,
    fixesBase: string,
    fixes: string[] = []
): Plugin[] {
    // The plugin for fixes needs to be first so that the imports will not be before feature-imports and featureGroup-imports
    return [
        fixImporterPlugin(fixesBase, fixes),
        featureImporterPlugin(featureBase, featureGroups, features),
    ];
}
