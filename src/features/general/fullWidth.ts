import { BooleanSetting } from '../../_lib/Settings/BooleanSetting';
import Feature from '../../_lib/Feature';

const enabled = new BooleanSetting('enabled', true).onInput(() =>
    enabled.feature?.reload()
);

/**
 * Do the DOM operations required to set or unset full width.
 * @param state - Whether to set full width or not.
 */
const setFullWidth = (state: boolean) => {
    document.body.classList.toggle('limitedwidth', !state);
    window.dispatchEvent(new Event('resize'));
};

/**
 * Sets or removes the classes that limit width.
 * @returns void
 */
const onload = () => setFullWidth(enabled.value);

/**
 * Disables fullwidth-mode.
 * @returns void
 */
const onunload = () => setFullWidth(false);

export default Feature.register({
    settings: new Set([enabled]),
    onload,
    onunload,
});
