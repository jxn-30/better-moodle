import { PromisedRequire } from '../../types/require';
import { readyCallback } from './DOM';

/**
 * Awaits the DOM to be ready and then imports the modules. Imports the modules immediately if DOM is already ready and thus requirejs already available.
 * @param modules - the modules to be imported
 * @param callback - the function that is to be called once the modules are imported
 * @returns void
 */
export const require: typeof requirejs = (modules, callback) =>
    readyCallback(() => requirejs(modules, callback));

/**
 * Awaits the DOM to be ready and then imports the modules. Imports the modules immediately if DOM is already ready and thus requirejs already available.
 * @param modules - the modules to be imported
 * @returns a promise that resolves with the imported modules
 */
export const requirePromise: PromisedRequire = modules =>
    new Promise(resolve => require(modules, (...res) => resolve(res)));
