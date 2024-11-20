import FeatureGroup from '@/FeatureGroup';
import { BooleanSetting } from '@/Settings/BooleanSetting';
import type Setting from '@/Setting';
import externalCSS from './style/external.scss?inline';
import mailCSS from './style/mail.scss?inline';

const settings = new Set<Setting>();

let external: BooleanSetting;
if (__UNI__ !== 'uzl') { // this feature exists natively in UzL-Moodle.
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

export default FeatureGroup.register({
    settings,
    onload,
});
