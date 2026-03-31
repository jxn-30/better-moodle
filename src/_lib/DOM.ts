import { renderAsElement } from './templates';

/* eslint-disable jsdoc/require-returns-check */
/**
 * Awaits the DOM to be ready and resolves the promise or resolves immediately if DOM is already ready.
 * @returns a promise that resolves once DOM is ready
 */
export const ready = (): Promise<void> =>
    new Promise<void>(resolve => {
        if (document.readyState !== 'loading') resolve();
        else {
            document.addEventListener('DOMContentLoaded', () => resolve(), {
                once: true,
            });
        }
    });
/* eslint-enable jsdoc/require-returns-check */

const loadingSpinners = new Map<string, Promise<HTMLElement>>();

/**
 * Renders a loading spinner from the moodle native template
 * @returns the rendered template
 */
const renderLoadingSpinner = () =>
    renderAsElement('core/loading', {}) as Promise<HTMLElement>;

/**
 * Clones the default loading spinner or creates it if needed
 * @returns the cloned loading spinner
 */
const cloneLoadingSpinner = () =>
    loadingSpinners
        .getOrInsertComputed('', renderLoadingSpinner)
        .then(spinner => spinner.cloneNode(true) as HTMLElement);

/**
 * Returns a loading spinner element or renders it if it's not available yet.
 * @param key - the key for using a cached loading spinner
 * @returns a promise that resolves to a loading spinner element
 */
export const getLoadingSpinner = (key: string) =>
    loadingSpinners.getOrInsertComputed(key, cloneLoadingSpinner);

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
