import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Get the absolute file path of an import path, supports subpath imports
 * @param path - the import path
 * @returns the absolute file path of the resolved import
 */
export const resolve = (path: string) =>
    fileURLToPath(import.meta.resolve(path)); // import.meta.resolve returns a file:// url

/**
 * Converts a path into its corresponding POSIX form.
 * This is needed e.g. for globs
 * @param pathStr - a path in either Windows style, POSIX style or mixed.
 * @returns a valid POSIX path
 */
export const toPOSIX = (pathStr: string) =>
    pathStr.replaceAll(path.sep, path.posix.sep);

export const root = path.dirname(resolve('#_/package.json'));

export const configsBase = path.dirname(resolve('#_configs/_config.d.ts'));
export const featureBase = path.dirname(
    path.dirname(resolve('#feats/general/index.ts'))
);
export const styleBase = path.dirname(resolve('#style/index.module.scss'));
