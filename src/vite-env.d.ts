/// <reference types="vite/client" />
/// <reference types="vite-plugin-monkey/client" />
/// <reference types="vite-plugin-monkey/global" />
/// <reference types="jsx-dom/index" />
/// <reference types="darkreader" />
/// <reference types="../types/window.d.ts" />

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
declare const __FEATURE_GROUPS__: string[];
declare const __USERSCRIPT_CONNECTS__: string[];
declare const __ICS_PARSER_DOMAIN__: string;
declare const __UA_REGEX__: string;
declare const __UA_REGEX_FLAGS__: string;
declare const __MIN_SUPPORTED_BROWSERS__: Record<string, number>;

// DarkReader is included via @require and thus globally available
declare const DarkReader: DarkReader;

declare type JSXElement = jsxDom.ReactElement;

// env variables defined in the .env file or in vite config
interface ImportMetaEnv {
    readonly VITE_FEATURES_BASE: string;
    readonly VITE_INCLUDE_FEATURE_GROUPS_GLOB: string;
    readonly VITE_INCLUDE_FEATURES_GLOB: string;
    readonly VITE_INCLUDE_FIXES_GLOB: string;

    readonly VITE_SPEISEPLAN_CANTEEN_GLOB: string;
    readonly VITE_SPEISEPLAN_PARSER_GLOB: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
