import { BooleanSetting } from '../../_lib/Settings/BooleanSetting';
import FeatureGroup from '../../_lib/FeatureGroup';
import Setting from '../../_lib/Setting';

const settings = new Set<Setting>();
settings.add(new BooleanSetting('updateNotification', true));

const features = new Set<string>([
    'fullWidth',
    'externalLinks',
    'truncatedTexts',
]);

export default FeatureGroup.register({
    settings,
    features,
});
