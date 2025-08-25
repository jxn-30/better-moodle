/* eslint-disable jsdoc/require-jsdoc */

// Relevant / used properties only
interface TooltipConfig {
    trigger?: string;
    title?: string;
    template?: string;
}

export class ThemeBoostBootstrapTooltipClass {
    constructor(element: HTMLElement, config: TooltipConfig);

    getTipElement(): HTMLElement;
    show(): void;
    hide(): void;
    update(): void;
    dispose(): void;
}

// Eh, this seems pretty hacky?
// well, it's the only way we achieved working types tbh
type ThemeBoostBootstrapTooltip = new (
    ...args: ConstructorParameters<typeof ThemeBoostBootstrapTooltipClass>
) => ThemeBoostBootstrapTooltipClass;

export default ThemeBoostBootstrapTooltip;
