import { BooleanSetting } from '../../_lib/Settings/BooleanSetting';
import Feature from '../../_lib/Feature';
import Setting from '../../_lib/Setting';

const settings = new Set<Setting>();
settings.add(new BooleanSetting('amount', true));

export default Feature.register({
    settings,
    /**
     * TODO
     */
    init(this) {
        console.log('init', this.id);
    },
});
