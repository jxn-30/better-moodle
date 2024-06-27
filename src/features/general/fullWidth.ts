import { BooleanSetting } from '../../_lib/Settings/BooleanSetting';
import Feature from '../../_lib/Feature';
import fullWidthStyle from './fullWidth.module.scss';
import Setting from '../../_lib/Setting';

const settings = new Set<Setting>();
settings.add(new BooleanSetting('enabled', true));

/**
 * Adds a class to the body that enables full-width mode.
 * @returns the result of the operation
 */
const onload = () => document.body.classList.add(fullWidthStyle.fullWidth);

/**
 * Removes a class to the body that enables full-width mode.
 * @returns the result of the operation
 */
const onunload = () => document.body.classList.remove(fullWidthStyle.fullWidth);

export default Feature.register({
    settings,
    onload,
    onunload,
});
