/* eslint-disable jsdoc/require-jsdoc */

// Relevant / used properties only
export interface TooltipConfig {
    trigger?: string;
    title?: string;
    template?: string;
    html?: boolean;
    placement?: 'top' | 'right' | 'bottom' | 'left'; // Moodle >= 500
}

export default class ThemeBoostBootstrapTooltipClass {
    constructor(
        element: HTMLElement,
        confi?: TooltipConfig
    ): ThemeBoostBootstrapTooltipClass;

    getTipElement(): HTMLElement; // Moodle < 500
    _getTipElement(): HTMLElement; // Moodle >= 500
    show(): void;
    hide(): void;
    update(): void;
    dispose(): void;

    setContent(content: Record<string, string | Element>): void; // Maybe Moodle >= 500?

    static getInstance(
        element: string | Element
    ): ThemeBoostBootstrapTooltipClass | null | undefined;
}
