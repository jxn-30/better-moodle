import { renderAsElement } from './templates';

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
        Promise.resolve(loadingSpinner.cloneNode(true) as HTMLElement)
    :   renderAsElement('core/loading', {}).then(spinner => {
            loadingSpinner = spinner as HTMLElement;
            return spinner.cloneNode(true) as HTMLElement;
        });

/**
 * Get's the HTML of a document fragment.
 * @param fragment - the document fragment
 * @returns the HTML of the document fragment
 */
export const getDocumentFragmentHtml = (fragment: DocumentFragment) => {
    const div = document.createElement('div');
    div.append(fragment.cloneNode(true));
    return div.innerHTML;
};

/**
 * Gets the HTML of a JSXElement.
 * @param element - the element to get the HTML of
 * @returns the HTML as a string
 */
export const getHtml = (element: JSXElement | DocumentFragment) =>
    element instanceof DocumentFragment ?
        getDocumentFragmentHtml(element)
    :   element.outerHTML;
