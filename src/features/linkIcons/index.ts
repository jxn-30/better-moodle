import { BooleanSetting } from '@/Settings/BooleanSetting';
import externalCSS from './style/external.scss?inline';
import FeatureGroup from '@/FeatureGroup';
import mailCSS from './style/mail.scss?inline';
import phoneCSS from './style/phone.scss?inline';
import type Setting from '@/Setting';

const settings = new Set<Setting>();

let external: BooleanSetting;
// this feature exists natively in UzL-Moodle.
if (__UNI__ !== 'uzl') {
    external = new BooleanSetting('external', true).onInput(() => onload());
    settings.add(external);
}

const mail = new BooleanSetting('mail', true).onInput(() => onload());
const phone = new BooleanSetting('phone', true).onInput(() => onload());
settings.add(mail).add(phone);

let externalStyle: HTMLElement;
let mailStyle: HTMLElement;
let phoneStyle: HTMLElement;

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

    // mphone
    if (phone.value) {
        if (phoneStyle) document.head.append(phoneStyle);
        else phoneStyle = GM_addStyle(phoneCSS);
    } else phoneStyle?.remove();
};

export default FeatureGroup.register({ settings, onload });
