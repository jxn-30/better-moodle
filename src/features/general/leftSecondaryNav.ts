import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import leftStyle from './leftSecondaryNav.module.scss';
import { ready } from '@/DOM';

const enabled = new BooleanSetting('enabled', __UNI__ === 'cau');

/**
 * Do the DOM operations required to set or unset pulling the secondary nav to the left.
 * @param state - Whether to pull left or not.
 */
const setPullLeft = async (state: boolean) => {
    await ready();

    document.body.classList.toggle(leftStyle.pulled, state);
};

/**
 * Sets or removes the classes that pulls the secondary nav to the left based on settings state.
 * @returns void
 */
const onload = () => void setPullLeft(enabled.value);

enabled.onInput(onload);

/**
 * Disables pull-left-mode.
 * @returns void
 */
const onunload = () => void setPullLeft(false);

export default Feature.register({
    settings: new Set([enabled]),
    onload,
    onunload,
});
