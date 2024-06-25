import * as fs from 'node:fs';
import * as path from 'node:path';
import Config from './configs/_config';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import fastGlob from 'fast-glob';
import monkey from 'vite-plugin-monkey';
import { version } from './package.json';

const PREFIX = 'better-moodle';

const configFile =
    process.argv
        .find(arg => arg.startsWith('--config='))
        ?.replace('--config=', '') ??
    new Error('No config specified. Please set a config with --config=...');

if (configFile instanceof Error) throw configFile;

const config = JSON.parse(
    fs.readFileSync(`./configs/${configFile}.json`, 'utf-8')
) as Config;

const githubUrl = `https://github.com/${config.github.user}/${config.github.repo}`;
const releaseDownloadUrl = `${githubUrl}/releases/latest/download`;

const featuresBase = '/src/features/';
const allFeatureGroups = fastGlob
    .sync(`.${featuresBase}*/index.ts`)
    .map(f => f.replace(`.${featuresBase}`, '').replace('/index.ts', ''));
const allFeatures = fastGlob
    .sync(`.${featuresBase}*/!(index).ts`)
    .map(f =>
        f.replace(`.${featuresBase}`, '').replace('.ts', '').replace('/', '.')
    );

const allIncludedFeatureGroups = new Set<string>(['general']);
const allFullyIncludedFeatureGroups = new Set<string>();
const allIncludedFeatures = new Set<string>();

const includedFeaturesByConfig =
    'includeFeatures' in config ? config.includeFeatures : [];
const excludedFeaturesByConfig =
    'excludeFeatures' in config ? config.excludeFeatures : [];

if (includedFeaturesByConfig.length) {
    // add the features that are included by config
    includedFeaturesByConfig.forEach(feature => {
        if (feature.includes('.')) {
            // this is a feature, not a group
            allIncludedFeatures.add(feature);
            const group = feature.split('.')[0];
            allIncludedFeatureGroups.add(group);
        } else {
            // this is a group
            allIncludedFeatureGroups.add(feature);
            allFullyIncludedFeatureGroups.add(feature);
        }
    });
} else {
    // include all features
    allFeatureGroups.forEach(group => {
        allIncludedFeatureGroups.add(group);
        allFullyIncludedFeatureGroups.add(group);
    });
    allFeatures.forEach(feature => allIncludedFeatures.add(feature));

    // now exclude those excluded by config
    excludedFeaturesByConfig.forEach(feature => {
        // general group cannot be excluded
        if (feature === 'general') return;
        if (feature.includes('.')) {
            // this is a feature, not a group
            allIncludedFeatures.delete(feature);
            const group = feature.split('.')[0];
            allFullyIncludedFeatureGroups.delete(group);
        } else {
            // this is a group
            allFullyIncludedFeatureGroups.delete(feature);
            allIncludedFeatureGroups.delete(feature);
            allIncludedFeatures.forEach(f => {
                if (f.startsWith(`${feature}.`)) allIncludedFeatures.delete(f);
            });
        }
    });
}

// brace expansion wouldn't work with a single element only
if (allIncludedFeatureGroups.size === 1) {
    allIncludedFeatureGroups.add(crypto.randomUUID());
}

const featureGroupsGlob = `${featuresBase}{${Array.from(allIncludedFeatureGroups.values()).join(',')}}/index.ts`;

// this is a wörkaround as Set.prototype.union does not exist in Node < 22.0.0
const includedFeaturesAndGroups = new Set<string>(
    allFullyIncludedFeatureGroups
);
allIncludedFeatures.forEach(f => includedFeaturesAndGroups.add(f));

// brace expansion wouldn't work with no elements or a single element only
while (allIncludedFeatures.size <= 1) {
    allIncludedFeatures.add(crypto.randomUUID());
}

const featureGlob = `${featuresBase}{${Array.from(
    includedFeaturesAndGroups.values()
)
    .map(f => (f.includes('.') ? f.replace('.', '/') : `${f}/!(index)`))
    .join(',')}}.ts`;

// @ts-expect-error because process.env may also include undefined values
dotenv.populate(process.env, {
    VITE_FEATURES_BASE: featuresBase,
    VITE_INCLUDE_FEATURE_GROUPS_GLOB: featureGroupsGlob,
    VITE_INCLUDE_FEATURES_GLOB: featureGlob,
});

// https://vitejs.dev/config/
export default defineConfig({
    esbuild: {
        jsxInject:
            'import {createElement, Fragment as createFragment} from "jsx-dom";',
        jsxFactory: 'createElement',
        jsxFragment: 'createFragment',
        jsx: 'transform',
    },
    build: {
        minify: false,
        cssMinify: false,
        target: 'es2022',
    },
    resolve: {
        alias: [
            {
                find: /^/,
                replacement: '',
                /**
                 * replaces unused i18n imports with a path to a file exporting empty translations
                 * @param source - the path imported exactly as written in the import statement
                 * @param importer - the path of the file importing the source
                 * @returns undefined if the import should be resolved by the default resolver, otherwise the path to the file with empty translations
                 */
                customResolver: (source, importer) => {
                    // returning undefined will fall back to default resolver
                    if (!importer) return undefined;

                    const undefinedPath = 'src/i18n/undefined.ts';

                    const sourcePath = path.relative(
                        __dirname,
                        path.resolve(path.dirname(importer), source)
                    );
                    const context = path.relative(__dirname, importer);

                    if (
                        sourcePath.match(
                            /^src\/features\/.*\/i18n(\/index(\.ts)?)?$/
                        )
                    ) {
                        // Ah! We're trying to load index translations for this feature group!
                        // hmm, is this feature group included?
                        const featureGroup = sourcePath.split('/')[2];
                        // if not, return the undefined path
                        if (!allIncludedFeatureGroups.has(featureGroup)) {
                            return undefinedPath;
                        }
                    }

                    if (context.match(/^src\/features\/.*\/i18n\/index\.ts$/)) {
                        // Ah! We're loading from a translation index file!
                        // hmm, is this feature included?
                        const featureGroup = context.split('/')[2];
                        const feature = sourcePath.split('/')[4];
                        // if not, return the undefined path
                        if (
                            !allIncludedFeatures.has(
                                `${featureGroup}.${feature}`
                            )
                        ) {
                            return undefinedPath;
                        }
                    }

                    // nothing special about the import, return undefined to fall back to default resolver
                    return undefined;
                },
            },
        ],
    },
    css: {
        modules: {
            scopeBehaviour: 'global',
            exportGlobals: false,
            hashPrefix: PREFIX,
            localsConvention: 'camelCaseOnly',
            /**
             * Generates a scoped class or id based on filename (feature)
             * @param name - the class or id that is to be scoped
             * @param filename - the filename this class or id lives in to extract the feature from
             * @returns the scoped class or id
             */
            generateScopedName: (name, filename) => {
                // extract feature name from filename
                const feat = path
                    .relative(__dirname, filename)
                    .replace(/^src\/style\/|\.module\.(scss|sass)$/g, '') // extract feature name
                    .replace(/[^a-zA-Z0-9_-]/, '-') // replace invalid characters with hyphen
                    .replace(/-+/g, '-'); // reduce multiple hyphens to a single one

                return `${PREFIX}_${feat}__${name.replace(/^_/, '')}`;
            },
        },
    },
    define: {
        __GITHUB_USER__: JSON.stringify(config.github.user),
        __GITHUB_REPO__: JSON.stringify(config.github.repo),
        __GITHUB_URL__: JSON.stringify(githubUrl),
        __VERSION__: JSON.stringify(version),
        __PREFIX__: JSON.stringify(PREFIX),
    },
    plugins: [
        monkey({
            entry: 'src/core.tsx',
            userscript: {
                'name': `🎓️ ${config.uniName}: better-moodle 2`,
                'namespace': config.namespace,
                version,
                'author': [
                    'Jan (jxn_30)', // core contributor
                    'Yorik (YorikHansen)', // core contributor
                    ...(config.additionalAuthors ?? []),
                ].join(', '),
                'description': config.description,
                'homepage': githubUrl,
                'homepageURL': githubUrl,
                'icon': config.icon,
                'updateURL': `${releaseDownloadUrl}/better-moodle.meta.js`,
                'downloadURL': `${releaseDownloadUrl}/better-moodle.user.js`,
                'match': `${config.moodleUrl}/*`,
                'run-at': 'document-body',
                'connect': config.connects,
            },
            clientAlias: 'GM',
            build: {
                fileName: 'better-moodle.user.js',
                metaFileName: 'better-moodle.meta.js',
                autoGrant: true,
            },
        }),
    ],
});
