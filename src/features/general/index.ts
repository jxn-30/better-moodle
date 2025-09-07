import { BooleanSetting } from '@/Settings/BooleanSetting';
import FeatureGroup from '@/FeatureGroup';
import { languages } from 'i18n';
import { SelectSetting } from '@/Settings/SelectSetting';
import settingsStyle from '!/settings.module.scss';

export const updateNotification = new BooleanSetting(
    'updateNotification',
    true
).addAlias('general.updateNotification');
const languageSetting = new SelectSetting('language', 'auto', [
    'auto',
    ...Array.from(languages.entries()).map(([locale, { name, flag }]) => ({
        key: locale,
        title: `${flag} ${name}`,
    })),
])
    .addAlias('general.language')
    .requireReload();

export const highlightNewSettings = new BooleanSetting(
    'newSettings.highlight',
    true
).addAlias('general.highlightNewSettings');
export const newSettingsTooltip = new BooleanSetting(
    'newSettings.tooltip',
    true
)
    .addAlias('general.highlightNewSettings.navbar')
    .requireReload();

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

/**
 * Updates the hidden state of fun settings.
 * @returns void
 */
const updateFunSettingsHiddenState = () =>
    void hideFunSettings
        .awaitReady()
        .then(() =>
            document.body.classList.toggle(
                settingsStyle.hideFunSettings,
                hideFunSettings.value
            )
        );
const hideFunSettings = new BooleanSetting('hideFunSettings', true).onInput(
    updateFunSettingsHiddenState
);

const features = new Set<string>([
    'fullWidth',
    'externalLinks',
    'truncatedTexts',
    'leftSecondaryNav',
    'prideLogo',
    'googlyEyes',
]);

if (__UNI__ === 'cau') {
    features.add('cauNavbar');
}

/**
 * Updates the hidden state of all settings.
 */
const updateAllStates = () => {
    updateDisabledHiddenState();
    updateFunSettingsHiddenState();
};

export default FeatureGroup.register({
    settings: new Set([
        updateNotification,
        languageSetting,
        highlightNewSettings,
        newSettingsTooltip,
        hideDisabledSettings,
        hideFunSettings,
    ]),
    features,
    onload: updateAllStates,
    onunload: updateAllStates,
});
