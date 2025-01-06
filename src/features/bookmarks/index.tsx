import { BooleanSetting } from '@/Settings/BooleanSetting';
import FeatureGroup from '@/FeatureGroup';
import { PREFIX } from '@/helpers';

const enabled = new BooleanSetting('enabled', false);

enabled.disabledIf(enabled, '==', false);

const storageKey = 'bookmarks';
const oldStorageKey = PREFIX(storageKey);

console.log(storageKey, oldStorageKey);

export default FeatureGroup.register({
    settings: new Set([enabled]),
});
