/// <reference types="vite/client" />
/// <reference types="vite-plugin-monkey/client" />
/// <reference types="vite-plugin-monkey/global" />
/// <reference types="jsx-dom/index" />
/// <reference types="darkreader" />

/* global jsxDom:readonly */

// constants defined in the config file
declare const __GITHUB_USER__: string;
declare const __GITHUB_REPO__: string;
declare const __GITHUB_URL__: string;
declare const __GITHUB_BRANCH__: string;
declare const __VERSION__: string;
declare const __PREFIX__: string;
declare const __UNI__: string;
declare const __MOODLE_VERSION__: 400 | 401 | 402 | 403 | 404 | 405;
declare const __MOODLE_URL__: string;
declare const __UA_REGEX__: string;
declare const __UA_REGEX_FLAGS__: string;

// DarkReader is included via @require and thus globally available
declare const DarkReader: DarkReader;

declare type JSXElement = jsxDom.ReactElement;

// env variables defined in the .env file or in vite config
interface ImportMetaEnv {
    readonly VITE_FEATURES_BASE: string;
    readonly VITE_INCLUDE_FEATURE_GROUPS_GLOB: string;
    readonly VITE_INCLUDE_FEATURES_GLOB: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
