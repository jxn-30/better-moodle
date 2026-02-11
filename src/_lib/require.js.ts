import type { PromisedRequire } from '#types/require';
import { ready } from './DOM';

/**
 * Awaits the DOM to be ready and then imports the modules. Imports the modules immediately if DOM is already ready and thus requirejs already available.
 * @param modules - the modules to be imported
 * @returns a promise that resolves with the imported modules
 */
export const require: PromisedRequire = modules =>
    new Promise(
        resolve =>
            void ready().then(() =>
                requirejs(modules, (...res) => resolve(res))
            )
    );
