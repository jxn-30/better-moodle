import { BooleanSetting } from '@/Settings/BooleanSetting';
import externalStyle from './style/external.scss?style';
import FeatureGroup from '@/FeatureGroup';
import mailStyle from './style/mail.scss?style';
import phoneStyle from './style/phone.scss?style';
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

/**
 * Adds the event listener that handles the mouseover event
 */
const onload = () => {
    // external
    if (external?.value) {
        document.head.append(externalStyle);
    } else externalStyle.remove();

    // mail
    if (mail.value) {
        document.head.append(mailStyle);
    } else mailStyle.remove();

    // mphone
    if (phone.value) {
        document.head.append(phoneStyle);
    } else phoneStyle.remove();
};

export default FeatureGroup.register({ settings, onload });
