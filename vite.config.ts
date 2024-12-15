import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import browserslist from 'browserslist';
import Config from './configs/_config';
import { createHash } from 'crypto';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import fastGlob from 'fast-glob';
import monkey from 'vite-plugin-monkey';
import { resolveToEsbuildTarget } from 'esbuild-plugin-browserslist';
import { dependencies, version } from './package.json';

const _PERF_START = process.hrtime.bigint();

const PREFIX = 'better-moodle';

const configFile =
    process.argv
        .find(arg => arg.startsWith('--config='))
        ?.replace('--config=', '') ??
    new Error('No config specified. Please set a config with --config=...');

if (configFile instanceof Error) throw configFile;

const config = JSON.parse(
    await fs.readFile(`./configs/${configFile}.json`, 'utf-8')
) as Config;

const githubUrl = `https://github.com/${config.github.user}/${config.github.repo}`;
const releaseDownloadUrl = `${githubUrl}/releases/latest/download`;

const featuresBase = '/src/features/';
const allFeatureGroups = fastGlob
    .sync(`.${featuresBase}*/index.{ts,tsx}`)
    .map(f => f.replace(`.${featuresBase}`, '').replace(/\/index\.tsx?$/, ''));
const allFeatures = fastGlob
    .sync(`.${featuresBase}*/!(index).{ts,tsx}`)
    .map(f =>
        f
            .replace(`.${featuresBase}`, '')
            .replace(/\.tsx?$/, '')
            .replace('/', '.')
    )
    // anything with more than one dot is not a feature but an extra file
    .filter(f => /^[^.]+\.[^.]+$/.test(f));

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

const featureMd = Array.from(
    allIncludedFeatureGroups.values().map(
        group =>
            `* ${group}${Array.from(
                allIncludedFeatures
                    .values()
                    .filter(feat => feat.startsWith(`${group}.`))
                    .map(feat => `\n  * ${feat}`)
            ).join('')}`
    )
).join('\n');

// brace expansion wouldn't work with a single element only
if (allIncludedFeatureGroups.size === 1) {
    allIncludedFeatureGroups.add(crypto.randomUUID());
}

const featureGroupsGlob = `${featuresBase}{${Array.from(allIncludedFeatureGroups.values()).join(',')}}/index.{ts,tsx}`;

// brace expansion wouldn't work with no elements or a single element only
while (allIncludedFeatures.size <= 1) {
    allIncludedFeatures.add(crypto.randomUUID());
}

const featureGlob = `${featuresBase}{${Array.from(allIncludedFeatures.values())
    .map(f => (f.includes('.') ? f.replace('.', '/') : `${f}/!(index)`))
    .join(',')}}.{ts,tsx}`;

// @ts-expect-error because process.env may also include undefined values
dotenv.populate(process.env, {
    VITE_FEATURES_BASE: featuresBase,
    VITE_INCLUDE_FEATURE_GROUPS_GLOB: featureGroupsGlob,
    VITE_INCLUDE_FEATURES_GLOB: featureGlob,
});

const requires: string[] = [];

if (allIncludedFeatureGroups.has('darkmode')) {
    requires.push(
        `https://unpkg.com/darkreader@${dependencies.darkreader}/darkreader.js#sha512=${createHash(
            'sha512'
        )
            .update(
                await fs.readFile('./node_modules/darkreader/darkreader.js')
            )
            .digest('hex')}`
    );
}

const GLOBAL_CONSTANTS = {
    __GITHUB_USER__: JSON.stringify(config.github.user),
    __GITHUB_REPO__: JSON.stringify(config.github.repo),
    __GITHUB_URL__: JSON.stringify(githubUrl),
    __GITHUB_BRANCH__: JSON.stringify(config.github.branch ?? 'main'),
    __VERSION__: JSON.stringify(version),
    __PREFIX__: JSON.stringify(PREFIX),
    __UNI__: JSON.stringify(configFile),
    __MOODLE_VERSION__: JSON.stringify(config.moodleVersion),
    __MOODLE_URL__: JSON.stringify(config.moodleUrl),
};

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
        target: Array.from(
            new Set(
                resolveToEsbuildTarget(browserslist(), {
                    printUnknownTargets: false,
                })
            )
        ),
    },
    resolve: {
        alias: [
            {
                find: /^@(?=\/)/,
                replacement: path.resolve(__dirname, './src/_lib'),
            },
            {
                find: /^#(?=\/)/,
                replacement: path.resolve(__dirname, './types'),
            },
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
                        /^src\/features\/.*\/i18n(\/index(\.ts)?)?$/.test(
                            sourcePath
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

                    if (/^src\/features\/.*\/i18n\/index\.ts$/.test(context)) {
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
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
                additionalData: Object.entries(GLOBAL_CONSTANTS)
                    .map(([name, value]) => `$${name}: ${value};`)
                    .join('\n'),
            },
        },
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
                    .replace(
                        /^src\/(style|features)\/|(\/?style|\/?index)?\.module\.(scss|sass)$/g,
                        ''
                    ) // extract feature name
                    .replace(/[^a-zA-Z0-9_-]/g, '-') // replace invalid characters with hyphen
                    .replace(/-+/g, '-'); // reduce multiple hyphens to a single one

                return `${PREFIX}_${feat}__${name.replace(/^_/, '')}`.replace(
                    /_{3,}/g,
                    '__'
                );
            },
        },
    },
    define: GLOBAL_CONSTANTS,
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
                'homepage': `${githubUrl}${config.github.branch ? `/tree/${config.github.branch}` : ''}`,
                'homepageURL': `${githubUrl}${config.github.branch ? `/tree/${config.github.branch}` : ''}`,
                'icon': config.icon,
                'updateURL': `${releaseDownloadUrl}/better-moodle.meta.js`,
                'downloadURL': `${releaseDownloadUrl}/better-moodle.user.js`,
                'match': `${config.moodleUrl}/*`,
                'run-at': 'document-body',
                'connect': config.connects,
                'require': requires,
            },
            clientAlias: 'GM',
            build: {
                fileName: `better-moodle-${configFile}.user.js`,
                metaFileName: `better-moodle-${configFile}.meta.js`,
                autoGrant: true,
            },
        }),
        {
            name: 'Better-Moodle-build-stats',
            apply: 'build',
            /**
             * Hooks into roolup writeBundle, executed as the very last step
             * @param options - the output options
             */
            writeBundle(options) {
                const _PERF_TOTAL = process.hrtime.bigint() - _PERF_START;
                const _PERF_BUILD = _PERF_TOTAL - _PERF_CONFIG;

                const base = options.dir;
                if (!base) return;

                const prefix = '.stats_';

                const featuresFile = path.join(base, `${prefix}features.md`);
                const perfConfFile = path.join(base, `${prefix}perf_conf`);
                const perfBuildFile = path.join(base, `${prefix}perf_build`);
                const perfTotalFile = path.join(base, `${prefix}perf_total`);

                const timeConfig = {
                    minute: '2-digit',
                    second: '2-digit',
                    fractionalSecondDigits: 3,
                } as const;

                void Promise.all([
                    fs.writeFile(featuresFile, featureMd),
                    fs.writeFile(
                        perfConfFile,
                        new Date(
                            Number(_PERF_CONFIG / 1_000_000n)
                        ).toLocaleTimeString([], timeConfig)
                    ),
                    fs.writeFile(
                        perfBuildFile,
                        new Date(
                            Number(_PERF_BUILD / 1_000_000n)
                        ).toLocaleTimeString([], timeConfig)
                    ),
                    fs.writeFile(
                        perfTotalFile,
                        new Date(
                            Number(_PERF_TOTAL / 1_000_000n)
                        ).toLocaleTimeString([], timeConfig)
                    ),
                ]);
            },
        },
    ],
});

const _PERF_CONFIG = process.hrtime.bigint() - _PERF_START;
