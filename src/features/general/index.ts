import { BooleanSetting } from '../../_lib/Settings/BooleanSetting';
import FeatureGroup from '../../_lib/FeatureGroup';
import { languages } from '../../i18n/i18n';
import { SelectSetting } from '../../_lib/Settings/SelectSetting';

const updateNotification = new BooleanSetting('updateNotification', true);
const languageSetting = new SelectSetting('language', 'auto', [
    'auto',
    ...Array.from(languages.entries()).map(([locale, { name, flag }]) => ({
        key: locale,
        title: `${flag} ${name}`,
    })),
]).requireReload();

const features = new Set<string>([
    'fullWidth',
    'externalLinks',
    'truncatedTexts',
]);

export default FeatureGroup.register({
    settings: new Set([updateNotification, languageSetting]),
    features,
});
