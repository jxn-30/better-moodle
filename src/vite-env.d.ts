/// <reference types="vite/client" />
/// <reference types="vite-plugin-monkey/client" />
/// <reference types="vite-plugin-monkey/global" />

// constants defined in the config file
declare const __GITHUB_USER__: string;
declare const __GITHUB_REPO__: string;
declare const __GITHUB_URL__: string;
declare const __VERSION__: string;
declare const __PREFIX__: string;

// env variables defined in the .env file or in vite config
interface ImportMetaEnv {
    readonly VITE_INCLUDE_FEATURES_GLOB: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}