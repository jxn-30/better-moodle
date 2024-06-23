import * as fs from 'node:fs';
import * as path from 'node:path';
import Config from './configs/_config';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';
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

const includedFeatures =
    'includeFeatures' in config ? config.includeFeatures : [];
const includedFeatureGroups = new Set<string>();
includedFeatures.forEach(feature => {
    if (feature.includes('.')) {
        includedFeatureGroups.add(feature.split('.')[0]);
    } else {
        includedFeatureGroups.add(feature);
    }
});
const excludedFeatures =
    'excludeFeatures' in config ?
        config.excludeFeatures.filter(f => f !== 'general') // disallow excluding the general group
    :   [];
const excludedFeatureGroups = excludedFeatures.filter(f => !f.includes('.'));

const featuresBase = '/src/features/';
const featureGroupsImportGlob = `${featuresBase}${
    includedFeatureGroups.size ?
        `@(general|${Array.from(includedFeatureGroups).join('|')})`
    : excludedFeatureGroups.length ? `!(${excludedFeatureGroups.join('|')})`
    : '*'
}/index.ts`;

/**
 * get a list of features that should be used in the brace expansion
 * @param list - the list of features
 * @returns the brace expansion string
 */
const getFeatureImports = (list: string[]) =>
    list
        .map(feature =>
            feature.match(/\./) ?
                feature.replace('.', '/')
            :   `${feature}/!(index)`
        )
        .join(',');
const featuresImportGlob = `${featuresBase}${
    // multiple features included => use brace expansion
    includedFeatures.length > 1 ? `{${getFeatureImports(includedFeatures)}}`
        // only a single feature included => brace expansion would not work at all
    : includedFeatures.length === 1 ? getFeatureImports(includedFeatures)
        // TODO: how can we create a glob that works for excluding specific features instead of only feature groups?
        // this glob is 100% wrong atm
        // maybe we have to read all files and then create a glob from the non-excluded?
    : excludedFeatures.length ? `!(${getFeatureImports(excludedFeatures)})`
    : '*/!(index)'
}.ts`;

// @ts-expect-error because process.env may also include undefined values
dotenv.populate(process.env, {
    VITE_FEATURES_BASE: featuresBase,
    VITE_INCLUDE_FEATURE_GROUPS_GLOB: featureGroupsImportGlob,
    VITE_INCLUDE_FEATURES_GLOB: featuresImportGlob,
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
