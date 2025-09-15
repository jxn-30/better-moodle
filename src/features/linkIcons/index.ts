import { BooleanSetting } from '@/Settings/BooleanSetting';
import externalCSS from './style/external.scss?inline';
import FeatureGroup from '@/FeatureGroup';
import mailStyleEl from './style/mail.scss?style';
import phoneStyleEl from './style/phone.scss?style';
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
    if (mail.value) document.head.append(mailStyleEl);
    else mailStyleEl.remove();

    // mphone
    if (phone.value) document.head.append(phoneStyleEl);
    else phoneStyleEl.remove();
};

export default FeatureGroup.register({ settings, onload });
