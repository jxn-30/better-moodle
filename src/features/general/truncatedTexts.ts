import { BooleanSetting } from '../../_lib/Settings/BooleanSetting';
import Feature from '../../_lib/Feature';
import Setting from '../../_lib/Setting';

const settings = new Set<Setting>();
settings.add(new BooleanSetting('enabled', true));

export default Feature.register({
    settings,
});
