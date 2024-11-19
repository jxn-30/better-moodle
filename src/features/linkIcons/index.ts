import FeatureGroup from '@/FeatureGroup';
import { BooleanSetting } from '@/Settings/BooleanSetting';
import type Setting from '@/Setting';

const settings = new Set<Setting>();

let external: BooleanSetting;
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
        else {
            void import('./style/external.scss?inline').then(
                ({ default: style }) => (externalStyle = GM_addStyle(style))
            );
        }
    } else externalStyle?.remove();

    // mail
    if (mail.value) {
        if (mailStyle) document.head.append(mailStyle);
        else {
            void import('./style/mail.scss?inline').then(
                ({ default: style }) => (mailStyle = GM_addStyle(style))
            );
        }
    } else mailStyle?.remove();
};

export default FeatureGroup.register({
    settings,
    onload,
});
