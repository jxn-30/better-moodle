import { BooleanSetting } from '#lib/Settings/BooleanSetting';
import Feature from '#lib/Feature';
import hideStyleEl from './hideSelfEnrolHint.scss?style';

const hide = new BooleanSetting('hide', false).addAlias(
    'courses.hideSelfEnrolHint'
);

/**
 * Adds or removes the style based on the settings value
 */
const reload = () => {
    if (hide.value) document.head.append(hideStyleEl);
    else hideStyleEl.remove();
};

hide.onInput(reload);

export default Feature.register({
    settings: new Set([hide]),
    onload: reload,
    onunload: reload,
});
