import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import hideCSS from './hideSelfEnrolHint.scss?inline';

const hide = new BooleanSetting('hide', false);

let hideStyle: HTMLElement;

/**
 * Adds or removes the style based on the settings value
 */
const onload = () => {
    if (hide.value) {
        if (hideStyle) document.head.append(hideStyle);
        else hideStyle = GM_addStyle(hideCSS);
    } else onunload();
};

hide.onInput(() => onload());

/**
 * Removes the style
 */
const onunload = () => {
    hideStyle?.remove();
};

export default Feature.register({
    settings: new Set([hide]),
    onload,
    onunload,
});
