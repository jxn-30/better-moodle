import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import hideCSS from './hideSelfEnrolHint.scss?inline';

const hide = new BooleanSetting('hide', false).addAlias(
    'courses.hideSelfEnrolHint'
);

let hideStyle: HTMLElement;

/**
 * Adds or removes the style based on the settings value
 */
const reload = () => {
    if (hide.value) {
        if (hideStyle) document.head.append(hideStyle);
        else hideStyle = GM_addStyle(hideCSS);
    } else hideStyle?.remove();
};

hide.onInput(reload);

export default Feature.register({
    settings: new Set([hide]),
    onload: reload,
    onunload: reload,
});
