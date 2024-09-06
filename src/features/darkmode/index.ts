import { BooleanSetting } from '../../_lib/Settings/BooleanSetting';
import FeatureGroup from '../../_lib/FeatureGroup';
import Setting from '../../_lib/Setting';

console.log("we're loading the darkmode feature group");

const settings = new Set<Setting>();
settings.add(new BooleanSetting('enabled', true));
settings.add(new BooleanSetting('brightness', true));
settings.add(new BooleanSetting('contrast', true));
settings.add(new BooleanSetting('greyscale', true));
settings.add(new BooleanSetting('sepia', true));
settings.add(new BooleanSetting('preview', true));

export default FeatureGroup.register({
    settings,
    /**
     * TODO
     */
    init(this) {
        console.log('init', this.id);
    },

    /**
     * TODO
     */
    onload(this) {
        console.log('load', this.id);
    },

    /**
     * TODO
     */
    onunload(this) {
        console.log('unload', this.id);
    },
});
