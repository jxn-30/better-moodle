import { BooleanSetting } from '../../_lib/Settings/BooleanSetting';
import Feature from '../../_lib/Feature';

export default Feature.register({
    settings: [new BooleanSetting('externalLinks', true)],
    /**
     *
     */
    init(this) {
        console.log('init', this.id);
    },
});
