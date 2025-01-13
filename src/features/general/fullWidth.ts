import './fullWidth.scss';
import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import { ready } from '@/DOM';

const enabled = new BooleanSetting('enabled', true).addAlias(
    'general.fullwidth'
);

/**
 * Do the DOM operations required to set or unset full width.
 * @param state - Whether to set full width or not.
 */
const setFullWidth = async (state: boolean) => {
    await ready();

    document.body.classList.toggle('limitedwidth', !state);
    document
        .getElementById('page-header')
        ?.classList.toggle('header-maxwidth', !state);
    window.dispatchEvent(new Event('resize'));
};

/**
 * Sets or removes the classes that limit width.
 * @returns void
 */
const onload = () => void setFullWidth(enabled.value);

enabled.onInput(() => void setFullWidth(enabled.value));

/**
 * Disables fullwidth-mode.
 * @returns void
 */
const onunload = () => void setFullWidth(false);

export default Feature.register({
    settings: new Set([enabled]),
    onload,
    onunload,
});
