// types found out by reading the moodle source code
// may be incomplete at some points

import CoreCustomMenuItem from './_templates/core/custom_menu_item';
import CoreMoreMenuChildren from './_templates/core/moremenu_children';

export type Context = string | number | Context[] | Record<string, Context>;

export default interface CoreTemplates {
    renderForPromise<Template extends keyof ContextMap>(
        templateName: Template,
        context: ContextMap[Template],
        themeName?: string
    ): Promise<{ html: string; js: string }>;
    renderPix(key: string, component: string, title?: string): Promise<string>;
    runTemplateJS(js: string): void;
}

interface FormElement<ElementContext> {
    label?: string;
    required?: boolean;
    advanced?: boolean;
    error?: string;
    element: ElementContext;
}

interface ContextMap extends Record<string, Context> {
    'block_myoverview/course-action-menu': {
        isfavourite: boolean;
        hidden: boolean;
    };

    'core/block': {
        showskiplink: boolean;
        title: string;
        skipid: string;
        id: string;
        hidden: boolean;
        class: string;
        hascontrols: boolean;
        ariarole: string;
        type: string;
        blockinstanceid: number;
        arialabel: string;
        controls: string;
        content: string;
        footer: string;
        annotation: string;
    };
    'core/custom_menu_item': CoreCustomMenuItem;
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

    // context dependencies are left out here on purpose
    'core_form/element-autocomplete-inline': FormElement<{
        frozen?: boolean;
        multiple?: boolean;
        nameraw?: string; // required if multiple is truthy, otherwise ignored
        name: string;
        id: string;
        iderror: string;
        attributes?: string;
        options: {
            value: string;
            selected?: boolean;
            html?: string;
            text: string;
        }[];
        tags: boolean; // do we want to allow new entries?
        ajax?: string;
        placeholder: string;
        casesensitive: boolean;
        showsuggestions: boolean;
        noselectionstring: string;
    }>;
}
