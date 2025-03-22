import { requirePromise } from '@/require.js';
import CoreTemplates, { Context } from '#/require.js/core/templates';

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
        const { promise, resolve } = Promise.withResolvers<void>();

        /**
         * Checks if moodles storage validation has completed.
         * storage validation may clear the storage and thus delete our template.
         * @returns void
         */
        const check = () => {
            if (M.util.complete_js.flat().includes('core/storage_validation')) {
                return resolve();
            }
            setTimeout(check, 100);
        };
        check();

        await promise;

        const templateName = `${__PREFIX__}/${name}`;
        storage.set(
            `core_template/${config.templaterev}:${config.theme}/${templateName}`,
            template
        );
        return templates.renderForPromise(templateName, context);
    });

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
