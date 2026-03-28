import * as args from './args';
import * as browsers from './browsers';
import * as connects from './connects';
import * as constants from './constants';
import * as features from './features';
import * as requires from './requires';
import * as subpaths from './subpaths';
import * as urls from './urls';
import fs from 'node:fs/promises';
import {
    authors,
    config,
    globalConfig,
    metaFileName,
    polyfillsFileName,
    scriptFileName,
} from './config';
import { dependencies, devDependencies, version } from '../../package.json';

// Populate connects
// Global connects
connects.add(globalConfig.connects['']);
// Config connects
connects.add(config.connects ?? []);
// Feature connects of included features and FeatureGroups
Object.entries(globalConfig.connects).forEach(([feature, connectArray]) => {
    if (features.isEnabled(feature)) connects.add(connectArray);
});

// Populate requires
// Extra files bundled we don't want to have in the main script
requires.add(polyfillsFileName);
// For features
if (features.isEnabled('darkmode')) {
    requires.add(
        `https://unpkg.com/darkreader@${dependencies.darkreader}/darkreader.js`,
        await fs.readFile(subpaths.resolve('darkreader'))
    );
}

// Populate global constants. Remember to also set them in src/vite-env.d.ts
constants.setConstant('__GITHUB_USER__', config.github.user);
constants.setConstant('__GITHUB_REPO__', config.github.repo);
constants.setConstant('__GITHUB_URL__', urls.githubUrl);
constants.setConstant('__GITHUB_BRANCH__', config.github.branch ?? 'main');
constants.setConstant('__VERSION__', version);
constants.setConstant('__PREFIX__', globalConfig.prefix);
constants.setConstant('__UNI__', args.configFile);
constants.setConstant('__MOODLE_VERSION__', config.moodleVersion);
constants.setConstant('__MOODLE_URL__', config.moodleUrl);
constants.setConstant('__FEATURE_GROUPS__', features.orderedFeatures);
constants.setConstant('__USERSCRIPT_CONNECTS__', connects.list());
constants.setConstant('__ICS_PARSER_DOMAIN__', urls.icsParserDomain);
constants.setConstant('__MIN_SUPPORTED_BROWSERS__', browsers.minVersions);
constants.setConstant('__UA_REGEX__', browsers.uaRegExp.source);
constants.setConstant('__UA_REGEX_FLAGS__', browsers.uaRegExp.flags);

// create copyright strings
const copyright = `
This is Better-Moodle; Version ${version}; Built for ${config.uniName} (${config.moodleUrl}).
Copyright (c) 2023-${new Date().getFullYear()} Jan (@jxn-30), Yorik (@YorikHansen) and contributors.
All rights reserved.
Licensed under the MIT License (MIT).
Source-Code: ${urls.githubUrl}
`.trim();

const polyfillsCopyright = `
This is Polyfills for Better-Moodle; Version ${version}; Built for ${config.uniName} (${config.moodleUrl}).
Polyfills are provided by core-js@${devDependencies['core-js']}. Copyright (c) to the maintainers and contributors.
Better-Moodle Copyright (c) 2023-${new Date().getFullYear()} Jan (@jxn-30), Yorik (@YorikHansen) and contributors.
All rights reserved.
Licensed under the MIT License (MIT).
Source-Code: ${urls.githubUrl}
`.trim();

export const BuildContext = {
    // Meta
    configId: args.configFile,
    args,
    prefix: globalConfig.prefix,
    version,

    // Paths
    paths: subpaths,

    // URLs
    urls,

    // Build options
    dist: {
        script: scriptFileName,
        meta: metaFileName,
        polyfills: polyfillsFileName,
    },

    // copyright
    copyright: { script: copyright, polyfills: polyfillsCopyright },

    // Browsers
    browsers: browsers.browsers,
    targets: browsers.targets,

    // Features and fixes
    featureGroups: features.enabledGroups,
    features: features.enabledFeatures,
    fixes: config.fixes?.toSorted() ?? [],
    featureListMarkdown: features.markdown,

    // Userscript data
    userscript: {
        name: `🎓️ ${config.uniName}: better-moodle`,
        namespace: config.namespace,
        version,
        authors,
        description: config.description,
        homepage: urls.homepage,
        icon: urls.icon,
        updateURL: urls.updateUrl,
        downloadURL: urls.downloadUrl,
        match: urls.match,
        connect: connects.list(),
        require: requires, // requires will be extended during build process (polyfills)
    },

    // Vite define map
    GLOBAL_CONSTANTS: constants.getConstants(),
    GLOBAL_CONSTANTS_STRINGIFIED: constants.getConstantsStringified(),
} as const;

export type Context = typeof BuildContext;
