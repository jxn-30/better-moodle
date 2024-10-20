import { BooleanSetting } from '../../_lib/Settings/BooleanSetting';
import FeatureGroup from '../../_lib/FeatureGroup';
import { languages } from '../../i18n/i18n';
import { SelectSetting } from '../../_lib/Settings/SelectSetting';
import settingsStyle from '../../style/settings.module.scss';

// TODO: Implement updateNotification
const updateNotification = new BooleanSetting('updateNotification', true);
const languageSetting = new SelectSetting('language', 'auto', [
    'auto',
    ...Array.from(languages.entries()).map(([locale, { name, flag }]) => ({
        key: locale,
        title: `${flag} ${name}`,
    })),
]).requireReload();

/**
 * Updates the hidden state of disabled settings.
 * @returns void
 */
const updateDisabledHiddenState = () =>
    void hideDisabledSettings
        .awaitReady()
        .then(() =>
            document.body.classList.toggle(
                settingsStyle.hideDisabledSettings,
                hideDisabledSettings.value
            )
        );

const hideDisabledSettings = new BooleanSetting(
    'hideDisabledSettings',
    true
).onInput(updateDisabledHiddenState);

const features = new Set<string>([
    'fullWidth',
    'externalLinks',
    'truncatedTexts',
]);

export default FeatureGroup.register({
    settings: new Set([
        updateNotification,
        languageSetting,
        hideDisabledSettings,
    ]),
    features,
    onload: updateDisabledHiddenState,
    onunload: updateDisabledHiddenState,
});
