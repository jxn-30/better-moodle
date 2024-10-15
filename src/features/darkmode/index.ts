import FeatureGroup from '../../_lib/FeatureGroup';
import { SelectSetting } from '../../_lib/Settings/SelectSetting';
import Setting from '../../_lib/Setting';
import { SliderSetting } from '../../_lib/Settings/SliderSetting';

const mode = new SelectSetting('mode', 'off', ['off', 'on', 'auto']);
const brightness = new SliderSetting('brightness', 100, {
    min: 0,
    max: 150,
    step: 1,
    labels: 7,
}).disabledIf(mode, '==', 'off');
const contrast = new SliderSetting('contrast', 100, {
    min: 0,
    max: 150,
    step: 1,
    labels: 7,
}).disabledIf(mode, '==', 'off');
const grayscale = new SliderSetting('grayscale', 0, {
    min: 0,
    max: 100,
    step: 1,
    labels: 6,
}).disabledIf(mode, '==', 'off');
const sepia = new SliderSetting('sepia', 0, {
    min: 0,
    max: 100,
    step: 1,
    labels: 6,
}).disabledIf(mode, '==', 'off');

const settings = new Set<Setting>([
    mode,
    brightness,
    contrast,
    grayscale,
    sepia,
]);

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
