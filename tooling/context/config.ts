import type Config from '#_configs/_config.d.ts';
import { configFile } from './args';
import { configsBase } from './subpaths';
import globalConfig from '#_configs/_global.json';

// Subpath imports seem not to work when imported from node_modules.
// Vite stores temp files in node_modules, thus this import magically happens from within node_modules.
export const { default: config } = (await import(
    `file://${configsBase}/${configFile}.json`,
    { with: { type: 'json' } }
)) as { default: Config };

export const scriptFileName = `better-moodle-${configFile}.user.js`;
export const metaFileName = `better-moodle-${configFile}.meta.js`;
export const polyfillsFileName = `better-moodle-${configFile}-polyfills.js`;

const authorsSet = new Set<string>();
globalConfig.userscript.coreAuthors.forEach(author => authorsSet.add(author));
config.additionalAuthors?.forEach(author => authorsSet.add(author));
export const authors = authorsSet.values().toArray();

export { globalConfig };
