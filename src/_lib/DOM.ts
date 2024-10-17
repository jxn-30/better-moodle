import { htmlToElements } from './helpers';
import { requirePromise } from './require.js';

/**
 * Awaits the DOM to be ready.
 */
export const ready = () =>
    new Promise<void>(resolve => readyCallback(() => resolve()));

/**
 * Awaits the DOM to be ready and then calls the callback or calls it immediately if DOM is already ready.
 * @param callback - the function that is to be called
 */
export const readyCallback = (callback: () => void) => {
    if (document.readyState !== 'loading') callback();
    else {
        document.addEventListener('DOMContentLoaded', callback, { once: true });
    }
};

let loadingSpinner: HTMLElement;

/**
 * Returns a loading spinner element or renders it if it's not available yet.
 * @returns a promise that resolves to a loading spinner element
 */
export const getLoadingSpinner = () =>
    loadingSpinner ?
        Promise.resolve(loadingSpinner.cloneNode(true))
    :   requirePromise(['core/templates'] as const)
            .then(([templates]) =>
                templates.renderForPromise('core/loading-spinner')
            )
            .then(({ html }) => htmlToElements(html).item(0) as HTMLElement)
            .then(spinner => {
                loadingSpinner = spinner;
                return spinner.cloneNode(true);
            });
