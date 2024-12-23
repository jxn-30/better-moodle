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
        Promise.resolve(loadingSpinner.cloneNode(true) as HTMLElement)
    :   requirePromise(['core/templates'] as const)
            .then(([templates]) =>
                templates.renderForPromise('core/loading', {})
            )
            .then(({ html }) => htmlToElements(html).item(0) as HTMLElement)
            .then(spinner => {
                loadingSpinner = spinner;
                return spinner.cloneNode(true) as HTMLElement;
            });

/**
 * Adds a template to the DOM and executes the JS.
 * @param element - the element to which the template should be added
 * @param template - the template to add
 * @param template.html - the HTML template
 * @param template.js - JS of the template
 * @param action - where to put the template in relation to the element
 * @returns a promise that resolves to the added elements
 * @throws if the element is not found
 */
export const putTemplate = async <ReturnType extends Element[]>(
    element: HTMLElement | string,
    template: { html: string; js: string },
    action: 'append' | 'prepend' | 'before' | 'after' | 'replaceWith'
): Promise<ReturnType> => {
    const el =
        typeof element === 'string' ?
            document.querySelector<HTMLElement>(element)
        :   element;
    if (!el) throw new Error('Element not found');
    const templateElements = Array.from(
        htmlToElements(template.html)
    ) as ReturnType;
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
 * @param element
 */
export const getHtml = (element: JSXElement) =>
    element instanceof DocumentFragment ?
        getDocumentFragmentHtml(element)
    :   element.outerHTML;
