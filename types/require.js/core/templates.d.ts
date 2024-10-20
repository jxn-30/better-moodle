// types found out by reading the moodle source code
// may be incomplete at some points

import CoreMoreMenuChildren from './_templates/core/moremenu_children';

type Context = string | number | Context[] | Record<string, Context>;

export default interface CoreTemplates {
    renderForPromise<Template extends keyof ContextMap>(
        templateName: Template,
        context: ContextMap[Template],
        themeName?: string
    ): Promise<{ html: string; js: string }>;
    renderPix(key: string, component: string, title?: string): Promise<string>;
}

interface ContextMap extends Record<string, Context> {
    'core/loading': Record<string, never>;
    'core/moremenu_children': CoreMoreMenuChildren;
    'core_course/favouriteicon': { isfavourite: boolean; id: number };
    'core_form/element-header': {
        header: string;
        id: string;
        collapseable?: boolean;
        collapsed?: boolean;
        helpbutton?: string;
    };
}
