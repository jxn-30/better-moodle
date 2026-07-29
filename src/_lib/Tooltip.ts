import { require } from '#lib/require.js';
import type { TooltipConfig } from '#types/require.js/theme_boost/bootstrap/tooltip.d.ts';

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

/**
 * Updates a tooltips content
 * @param element - the element the tooltip is attached to
 * @param content - the new content
 * @returns void
 */
export const setTooltipContent = (element: HTMLElement, content: string) =>
    __MOODLE_VERSION__ >= 500 ?
        (element.dataset.bsOriginalTitle = content)
    :   (element.dataset.originalTitle = content);
