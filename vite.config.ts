import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import boxen from 'boxen';
import browserslist from 'browserslist';
import type Config from './configs/_config';
import { createHash } from 'crypto';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import fastGlob from 'fast-glob';
import globalConfig from './configs/_global.json';
import icsParserConfig from './ics-parser/wrangler.json';
import legacy from '@vitejs/plugin-legacy';
import monkey from 'vite-plugin-monkey';
import pluginTerser from '@rollup/plugin-terser';
import { resolveToEsbuildTarget } from 'esbuild-plugin-browserslist';
import { getUserAgentRegex as uaRegex } from 'browserslist-useragent-regexp';
import { dependencies, version } from './package.json';

const _PERF_START = process.hrtime.bigint();

const PREFIX = globalConfig.prefix;

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
const includedNonDefaultFeaturesByConfig =
    'includeNonDefaultFeatures' in config ?
        new Set<string>(config.includeNonDefaultFeatures)
    :   new Set<string>();

const disabledByVersion = new Set<string>();
Object.entries(globalConfig.enabledFrom).forEach(([version, features]) => {
    if (config.moodleVersion < parseInt(version)) {
        features.forEach(feature => disabledByVersion.add(feature));
    }
});
Object.entries(globalConfig.disabledFrom).forEach(([version, features]) => {
    if (config.moodleVersion >= parseInt(version)) {
        features.forEach(feature => disabledByVersion.add(feature));
    }
});
const disabledByDefault = new Set<string>(globalConfig.defaultDisabled);

if (includedFeaturesByConfig.length) {
    // add the features that are included by config
    includedFeaturesByConfig.forEach(feature => {
        if (feature.includes('.')) {
            // this is a feature, not a group
            const group = feature.split('.')[0];
            // this feature or its group is disabled due to moodle version restrictions
            if (
                disabledByVersion.has(feature) ||
                disabledByVersion.has(group)
            ) {
                return;
            }
            // this feature is disabled by default and not manually included by config
            if (
                disabledByDefault.has(feature) &&
                !includedNonDefaultFeaturesByConfig.has(feature)
            ) {
                return;
            }
            // this feature group is disabled by default and not manually included by config
            if (
                disabledByDefault.has(group) &&
                !includedNonDefaultFeaturesByConfig.has(group)
            ) {
                return;
            }
            allIncludedFeatures.add(feature);
            allIncludedFeatureGroups.add(group);
        } else {
            // this is a group
            // this group is disabled due to moodle version restrictions
            if (disabledByVersion.has(feature)) return;
            // this group is disabled by default and not manually included by config
            if (
                disabledByDefault.has(feature) &&
                !includedNonDefaultFeaturesByConfig.has(feature)
            ) {
                return;
            }
            allIncludedFeatureGroups.add(feature);
            allFullyIncludedFeatureGroups.add(feature);
        }
    });
} else {
    // include all features except the ones disabled by version
    allFeatureGroups.forEach(group => {
        // this group is disabled due to moodle version restrictions
        if (disabledByVersion.has(group)) return;
        // this feature group is disabled by default and not manually included by config
        if (
            disabledByDefault.has(group) &&
            !includedNonDefaultFeaturesByConfig.has(group)
        ) {
            return;
        }
        allIncludedFeatureGroups.add(group);
        allFullyIncludedFeatureGroups.add(group);
    });
    allFeatures.forEach(feature => {
        // this feature is disabled due to moodle version restrictions
        if (disabledByVersion.has(feature)) return;
        // this feature is disabled by default and not manually included by config
        if (
            disabledByDefault.has(feature) &&
            !includedNonDefaultFeaturesByConfig.has(feature)
        ) {
            return;
        }
        allIncludedFeatures.add(feature);
    });

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

// we're again adding random UUIDs to not have empty brace expansion
const fixesGlob = `/src/fixes/{${crypto.randomUUID()},${crypto.randomUUID()},${(config.fixes ?? []).join(',')}}.{ts, tsx}`;

// @ts-expect-error because process.env may also include undefined values
dotenv.populate(process.env, {
    VITE_FEATURES_BASE: featuresBase,
    VITE_INCLUDE_FEATURE_GROUPS_GLOB: featureGroupsGlob,
    VITE_INCLUDE_FEATURES_GLOB: featureGlob,
    VITE_INCLUDE_FIXES_GLOB: fixesGlob,

    // import globs defined for specific features
    VITE_SPEISEPLAN_CANTEEN_GLOB: `${featuresBase}speiseplan/canteens/${configFile}.ts`,
    VITE_SPEISEPLAN_PARSER_GLOB: `${featuresBase}speiseplan/parsers/${configFile}.ts`,
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

const supportedBrowsers = browserslist();

const minSupportedBrowserVersions = new Map<string, number>();
supportedBrowsers.forEach(browser => {
    const [id, version] = browser.split(' ');
    const browserId = { and_ff: 'firefox (android)' }[id] ?? id;
    const minVersion =
        minSupportedBrowserVersions.get(browserId) ?? Number.MAX_SAFE_INTEGER;
    minSupportedBrowserVersions.set(
        browserId,
        Math.min(Number(version), minVersion)
    );
});

const uaRegexp = uaRegex({ allowHigherVersions: true });
const connectsByFeatures = Object.entries(globalConfig.connects).flatMap(
    ([feature, connects]) =>
        (
            allIncludedFeatureGroups.has(feature) ||
            allIncludedFeatures.has(feature)
        ) ?
            connects
        :   []
);
const connects = Array.from(
    new Set([
        'better-moodle.dev',
        ...(config.connects ?? []),
        ...connectsByFeatures,
    ])
);

const orderedFeatureGroups = globalConfig.featureGroupOrder.filter(group =>
    allIncludedFeatureGroups.has(group)
);

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
    __FEATURE_GROUPS__: JSON.stringify(['general', ...orderedFeatureGroups]),
    __USERSCRIPT_CONNECTS__: JSON.stringify(connects),
    __ICS_PARSER_DOMAIN__: JSON.stringify(icsParserConfig.routes[0].pattern),
    // hacky way for Regular expresions atm
    // See https://github.com/evanw/esbuild/issues/4019 for workaround source and feature request
    __UA_REGEX__: JSON.stringify(
        uaRegexp.toString().replace(/^\/|\/[dgimsuvy]*$/g, '')
    ),
    __UA_REGEX_FLAGS__: JSON.stringify(uaRegexp.flags),
    __MIN_SUPPORTED_BROWSERS__: Object.fromEntries(minSupportedBrowserVersions),
};

const fileName = `better-moodle-${configFile}.user.js`;
const metaFileName = `better-moodle-${configFile}.meta.js`;

const copyrightContent = `
This is Better-Moodle; Version ${version}; Built for ${config.uniName} (${config.moodleUrl}).
Copyright (c) 2023-${new Date().getFullYear()} Jan (@jxn-30), Yorik (@YorikHansen) and contributors.
All rights reserved.
Licensed under the MIT License (MIT).
Source-Code: ${githubUrl}
`.trim();
const copyright = boxen(copyrightContent, {
    borderStyle: {
        topLeft: '/*!',
        topRight: '*',
        bottomLeft: ' *',
        bottomRight: '*/',
        top: '*',
        bottom: '*',
        left: '*',
        right: '*',
    },
    title: 'Copyright ©',
    padding: 1,
    width: Math.min(
        120, // The prettier max width for built file
        Math.max(...copyrightContent.split(/\n/).map(l => l.length)) + 8 // Max line width + padding + border
    ),
}).toString();

export default defineConfig({
    esbuild: {
        jsxInject:
            'import {createElement, Fragment as createFragment} from "jsx-dom";',
        jsxFactory: 'createElement',
        jsxFragment: 'createFragment',
        jsx: 'transform',
        minifyWhitespace: true,
        minifyIdentifiers: false,
        minifySyntax: false,
    },
    build: {
        minify: 'esbuild',
        cssMinify: false,
        target: Array.from(
            new Set(
                resolveToEsbuildTarget(supportedBrowsers, {
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
                find: /^i18n$/,
                replacement: path.resolve(__dirname, './src/i18n/i18n'),
            },
            {
                find: /^\+(?=\/)/,
                replacement: path.resolve(__dirname, './src/templates'),
            },
            {
                find: /^!(?=\/)/,
                replacement: path.resolve(__dirname, './src/style'),
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

                        // okay, if the translation file is not within an i18n folder, we must include
                        // this is e.g. for the weather condition translations
                        // maybe we can find a better way sometime
                        if (!sourcePath.includes('i18n')) return undefined;

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
                additionalData: '@use "global:constants.scss" as global;',
                importers: [
                    {
                        /**
                         * Urlifies the constants imports, otherwise forwards to standard importer
                         * @param url - the url to canonicalize
                         * @returns null or the urlified import
                         */
                        canonicalize(url: string) {
                            if (url === 'global:constants.scss') {
                                return new URL(url);
                            }
                            return null;
                        },
                        /**
                         * Creates a scss string with global constants
                         * @returns the contents with style
                         */
                        load() {
                            return {
                                contents: Object.entries(GLOBAL_CONSTANTS)
                                    .filter(([, value]) =>
                                        ['string', 'number'].includes(
                                            typeof value
                                        )
                                    )
                                    .map(
                                        ([name, value]) =>
                                            // we need to remove leading and trailing _, otherwise sass would make them private
                                            // https://sass-lang.com/documentation/at-rules/use/#private-members
                                            // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
                                            `$${name.replace(/^_+|_+$/g, '')}: ${value};`
                                    )
                                    .join('\n'),
                                syntax: 'scss',
                            };
                        },
                    },
                ],
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
        legacy({
            modernTargets: browserslist.loadConfig({ path: process.cwd() }),
            modernPolyfills: true,
            renderLegacyChunks: false,
            renderModernChunks: true,
        }),
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
                'icon': `https://icons.better-moodle.dev/${configFile}.png`,
                'updateURL': `${releaseDownloadUrl}/${metaFileName}`,
                'downloadURL': `${releaseDownloadUrl}/${fileName}`,
                'match': `${config.moodleUrl}/*`,
                'run-at': 'document-body',
                'connect': connects,
                'require': requires,
            },
            clientAlias: 'GM',
            build: { fileName, metaFileName, autoGrant: true },
            format: {
                /**
                 * Adds the copyright notice and a eslint global comment to the userscript
                 * @param uOptions - information about the userscript, also containing the header
                 * @returns the userscript header plus preamble
                 */
                generate(uOptions) {
                    return `
${uOptions.userscript}

${copyright}

/* global global, ActiveXObject, M, requirejs, DarkReader */
`.trim();
                },
            },
        }),
        {
            name: 'mustache-loader',
            /**
             * Minifies a mustache template a little.
             * @param src - the mustache template code
             * @param id - the import id of the template file
             * @returns null or the minified mustache template
             */
            transform(src, id) {
                if (!id.endsWith('.mustache?raw')) return null;
                return src
                    .replace(/\{\{!.*?\}\}/gs, '') // remove mustache comments
                    .replace(/\\n/g, '') // remove linebreaks
                    .replace(/ {3,}/g, '  '); // reduce white spaces to a maximum of 2. This may break at <pre> tags but that isn't an issue yet.
            },
        },
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
        pluginTerser({
            module: true,
            compress: {
                defaults: false,
                collapse_vars: true,
                computed_props: true,
                dead_code: true,
                directives: true,
                evaluate: true,
                keep_classnames: true,
                keep_fnames: true,
                keep_infinity: true,
                // lhs_constants: true, // does not exist in terser types?
                loops: true,
                passes: 5,
                properties: true,
                reduce_vars: true,
                side_effects: true,
                switches: true,
                typeofs: true,
                unused: true,
            },
            format: { comments: 'all', ecma: 2020 },
            mangle: false,
            ecma: 2020,
            keep_classnames: true,
            keep_fnames: true,
        }),
    ],
});

const _PERF_CONFIG = process.hrtime.bigint() - _PERF_START;
