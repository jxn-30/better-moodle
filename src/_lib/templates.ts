import { Context } from '#/require.js/core/templates';
import { requirePromise } from '@/require.js';

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
    ] as const).then(([storage, templates, config]) => {
        const templateName = `${__PREFIX__}/${name}`;
        storage.set(
            `core_template/${config.templaterev}:${config.theme}/${templateName}`,
            template
        );
        return templates.renderForPromise(templateName, context);
    });
