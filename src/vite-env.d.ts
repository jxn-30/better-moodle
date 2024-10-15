/// <reference types="vite/client" />
/// <reference types="vite-plugin-monkey/client" />
/// <reference types="vite-plugin-monkey/global" />
/// <reference types="jsx-dom/index" />
/// <reference types="darkreader" />

// constants defined in the config file
declare const __GITHUB_USER__: string;
declare const __GITHUB_REPO__: string;
declare const __GITHUB_URL__: string;
declare const __VERSION__: string;
declare const __PREFIX__: string;

// DarkReader is included via @require and thus globally available
declare const DarkReader: DarkReader;

// env variables defined in the .env file or in vite config
interface ImportMetaEnv {
    readonly VITE_FEATURES_BASE: string;
    readonly VITE_INCLUDE_FEATURE_GROUPS_GLOB: string;
    readonly VITE_INCLUDE_FEATURES_GLOB: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
