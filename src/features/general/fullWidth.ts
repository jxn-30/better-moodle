import { BooleanSetting } from '../../_lib/Settings/BooleanSetting';
import Feature from '../../_lib/Feature';
import fullWidthStyle from './fullWidth.module.scss';

const enabled = new BooleanSetting('enabled', true).onInput(() => {
    // TODO: this.feature.reload() once `this` set
    enabled.feature?.reload();
});

/**
 * Adds a class to the body that enables full-width mode.
 */
const onload = () => {
    if (enabled.value) {
        document.body.classList.add(fullWidthStyle.fullWidth);
    }
};

/**
 * Removes a class to the body that enables full-width mode.
 * @returns the result of the operation
 */
const onunload = () => document.body.classList.remove(fullWidthStyle.fullWidth);

export default Feature.register({
    settings: new Set([enabled]),
    onload,
    onunload,
});
