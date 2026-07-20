import { require } from '#lib/require.js';
import type {
    ThemeBoostBootstrapTooltipClass,
    TooltipConfig,
} from '#types/require.js/theme_boost/bootstrap/tooltip.d.ts';

export type Tooltip = ThemeBoostBootstrapTooltipClass;

/**
 * Creates a tooltip and ensures moodle compatibility
 * @param element - the element to add the tooltip to
 * @param config - the tooltip configuration
 * @returns a promise with the newly created tooltip
 */
export const createTooltip = (element: HTMLElement, config: TooltipConfig) =>
    require(['theme_boost/bootstrap/tooltip'] as const).then(([Tooltip]) => {
        const tooltip = new Tooltip(element, config);
        // With Moodle 500, the lib has been rewritten to get rid of jQuery :)
        if (__MOODLE_VERSION__ >= 500) {
            tooltip.getTipElement = tooltip._getTipElement.bind(tooltip);
        }
        return tooltip;
    });
