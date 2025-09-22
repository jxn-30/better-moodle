import { requirePromise } from '@/require.js';
import CoreTemplates, { Context } from '#/require.js/core/templates';
import { htmlToElements, mdlJSComplete } from '@/helpers';

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
