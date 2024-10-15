import './darkmode.scss';
import { debounce } from '../../_lib/helpers';
import { DynamicThemeFix } from 'darkreader';
import FeatureGroup from '../../_lib/FeatureGroup';
import fixes from './fixes.scss?inline';
import { SelectSetting } from '../../_lib/Settings/SelectSetting';
import Setting from '../../_lib/Setting';
import { SliderSetting } from '../../_lib/Settings/SliderSetting';

/**
 * Updates the Dark Reader style based on the settings
 */
const updateDarkReaderMode = () => {
    if (mode.value === 'off') {
        DarkReader.auto(false);
        DarkReader.disable();
        return;
    }

    const darkReaderSettings = {
        brightness: brightness.value,
        contrast: contrast.value,
        grayscale: grayscale.value,
        sepia: sepia.value,
    };

    const themeFix = {
        css: fixes,
        invert: [],
        disableStyleSheetsProxy: false,
        ignoreImageAnalysis: [],
        ignoreInlineStyle: [],
    } satisfies DynamicThemeFix;

    if (mode.value === 'auto') {
        DarkReader.auto(darkReaderSettings, themeFix);
    } else {
        DarkReader.auto(false);
        DarkReader.enable(darkReaderSettings, themeFix);
    }
};

const debouncedUpdateDarkReaderMode = debounce(updateDarkReaderMode, 100);

const mode = new SelectSetting('mode', 'off', ['off', 'on', 'auto']).onChange(
    debouncedUpdateDarkReaderMode
);
const brightness = new SliderSetting('brightness', 100, {
    min: 0,
    max: 150,
    step: 1,
    labels: 7,
})
    .disabledIf(mode, '==', 'off')
    .onChange(debouncedUpdateDarkReaderMode);
const contrast = new SliderSetting('contrast', 100, {
    min: 0,
    max: 150,
    step: 1,
    labels: 7,
})
    .disabledIf(mode, '==', 'off')
    .onChange(debouncedUpdateDarkReaderMode);
const grayscale = new SliderSetting('grayscale', 0, {
    min: 0,
    max: 100,
    step: 1,
    labels: 6,
})
    .disabledIf(mode, '==', 'off')
    .onChange(debouncedUpdateDarkReaderMode);
const sepia = new SliderSetting('sepia', 0, {
    min: 0,
    max: 100,
    step: 1,
    labels: 6,
})
    .disabledIf(mode, '==', 'off')
    .onChange(debouncedUpdateDarkReaderMode);

const settings = new Set<Setting>([
    mode,
    brightness,
    contrast,
    grayscale,
    sepia,
]);

/**
 * Loads and inits DarkReader once all settings are ready
 * @returns void
 */
const onload = () =>
    void Promise.all(
        Array.from(settings.values()).map(setting => setting.awaitReady())
    ).then(updateDarkReaderMode);

export default FeatureGroup.register({
    settings,
    onload,
});
