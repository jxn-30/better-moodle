import { BooleanSetting } from '@/Settings/BooleanSetting';
import externalCSS from './style/external.scss?inline';
import FeatureGroup from '@/FeatureGroup';
import mailCSS from './style/mail.scss?inline';
import type Setting from '@/Setting';

const settings = new Set<Setting>();

let external: BooleanSetting;
// this feature exists natively in UzL-Moodle.
if (__UNI__ !== 'uzl') {
    external = new BooleanSetting('external', true).onInput(() => onload());
    settings.add(external);
}

const mail = new BooleanSetting('mail', true).onInput(() => onload());
settings.add(mail);

let externalStyle: HTMLElement;
let mailStyle: HTMLElement;

/**
 * Adds the event listener that handles the mouseover event
 */
const onload = () => {
    // external
    if (external?.value) {
        if (externalStyle) document.head.append(externalStyle);
        else externalStyle = GM_addStyle(externalCSS);
    } else externalStyle?.remove();

    // mail
    if (mail.value) {
        if (mailStyle) document.head.append(mailStyle);
        else mailStyle = GM_addStyle(mailCSS);
    } else mailStyle?.remove();
};

export default FeatureGroup.register({ settings, onload });
