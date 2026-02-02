import type { Context } from '#types/require.js/core/templates';
import type CoreTemplates from '#types/require.js/core/templates';
import { requirePromise } from '#lib/require.js';
import { htmlToElements, mdlJSComplete } from '#lib/helpers';

/**
 * OMG did Moothel just find a way to make Moodle render custom templates just by storing it hacky into the localstorage?
 * This method allows rendering custom mustache templates in Moodle.
 * @param name - The name of the template.
 * @param template - The mustache template (as a string) to render.
 * @param context - The context to render the template with.
 * @returns The result of renderForPromise as a promise.
 */
export const renderCustomTemplate = (
    name: string,
    template: string,
    context: Record<string, Context>
) =>
    requirePromise([
        'core/localstorage',
        'core/templates',
        'core/config',
    ] as const).then(async ([storage, templates, config]) => {
        await mdlJSComplete('core/storage_validation');

        const templateName = `${__PREFIX__}/${name}`;
        storage.set(
            `core_template/${config.templaterev}:${config.theme}/${templateName}`,
            template
        );
        return templates.renderForPromise(templateName, context);
    });

/**
 * This method allows rendering custom mustache templates in Moodle and returning the html elements.
 * @param name - The name of the template.
 * @param template - The mustache template (as a string) to render.
 * @param context - The context to render the template with.
 * @returns The html elements as a promise.
 */
export const renderCustomTemplateAsElements = (
    name: string,
    template: string,
    context: Record<string, Context>
) =>
    renderCustomTemplate(name, template, context).then(({ html }) =>
        htmlToElements(html)
    );

/**
 * Renders a template with the given context.
 * @param templateName - The name of the template.
 * @param context - The context to render the template with.
 * @param themeName - The name of the theme to render the template with.
 * @returns The result of renderForPromise as a promise.
 */
export const render: CoreTemplates['renderForPromise'] = (
    templateName,
    context,
    themeName
) =>
    requirePromise(['core/templates'] as const).then(([templates]) =>
        templates.renderForPromise(templateName, context, themeName)
    );

type RenderAsElements = (
    ...args: Parameters<CoreTemplates['renderForPromise']>
) => Promise<HTMLCollection | NodeListOf<Element>>;
/**
 * Renders a template with a given context and returns the html elements.
 * @param templateName - The name of the template.
 * @param context - The context to render the template with.
 * @param themeName - The name of the theme to render the template with.
 * @returns The html elements as a promise.
 */
export const renderAsElements: RenderAsElements = (
    templateName,
    context,
    themeName
) =>
    render(templateName, context, themeName).then(({ html }) =>
        htmlToElements(html)
    );

type RenderAsElement = (
    ...args: Parameters<CoreTemplates['renderForPromise']>
) => Promise<Element>;
/**
 * Renders a template with a given context and returns the first html element.
 * @param templateName - The name of the template.
 * @param context - The context to render the template with.
 * @param themeName - The name of the theme to render the template with.
 * @returns The first html element as a promise.
 */
export const renderAsElement: RenderAsElement = (
    templateName,
    context,
    themeName
) =>
    renderAsElements(templateName, context, themeName).then(
        elements => elements.item(0)!
    );

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
