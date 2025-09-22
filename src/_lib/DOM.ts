import { htmlToElements } from './helpers';
import { renderAsElement } from './templates';
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
        Promise.resolve(loadingSpinner.cloneNode(true) as HTMLElement)
    :   renderAsElement('core/loading', {}).then(spinner => {
            loadingSpinner = spinner as HTMLElement;
            return spinner.cloneNode(true) as HTMLElement;
        });

/**
 * Adds a template to the DOM and executes the JS.
 * @param element - the element to which the template should be added
 * @param template - the template to add
 * @param template.html - the HTML template
 * @param template.js - JS of the template
 * @param action - where to put the template in relation to the element
 * @param preprocess - a function to preprocess the added elements. Will be executed before the element is added to the DOM.
 * @returns a promise that resolves to the added elements
 * @throws {Error} if the element is not found
 */
export const putTemplate = async <ReturnType extends Element[]>(
    element: HTMLElement | string,
    template: { html: string; js: string },
    action: 'append' | 'prepend' | 'before' | 'after' | 'replaceWith',
    preprocess?: (elements: ReturnType) => void
): Promise<ReturnType> => {
    const el =
        typeof element === 'string' ?
            document.querySelector<HTMLElement>(element)
        :   element;
    // el cannot be falsy if element was not a string but eslint does not know that
    // eslint-disable-next-line @typescript-eslint/no-base-to-string, @typescript-eslint/restrict-template-expressions
    if (!el) throw new Error(`Element ${element} not found`);
    const templateElements = Array.from(
        htmlToElements(template.html)
    ) as ReturnType;
    if (preprocess) preprocess(templateElements);
    el[action](...templateElements);
    const [templates, filterEvents] = await requirePromise([
        'core/templates',
        'core_filters/events',
    ] as const);
    templates.runTemplateJS(template.js);
    filterEvents.notifyFilterContentUpdated(templateElements);
    return templateElements;
};

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
