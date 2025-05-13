import { BooleanSetting } from '@/Settings/BooleanSetting';
import FeatureGroup from '@/FeatureGroup';
import { SelectSetting } from '@/Settings/SelectSetting';
import { TextSetting } from '@/Settings/TextSetting';

const CITY =
    __UNI__ === 'cau' ?
        {
            name: 'kiel',
            lat: 54.3388,
            lon: 10.1225,
        }
    :   {
            name: 'luebeck',
            lat: 53.8655,
            lon: 10.6866,
        };

const enabled = new BooleanSetting('enabled', false).addAlias(
    'weatherDisplay.show'
);
const tempInNav = new BooleanSetting('tempInNav', true)
    .addAlias('weatherDisplay.showTempInNavbar')
    .disabledIf(enabled, '!=', true);
const feelLikeTempInNav = new BooleanSetting('feelLikeTempInNav', true)
    .addAlias('weatherDisplay.toggleFeelsLike')
    .disabledIf(enabled, '!=', true)
    .disabledIf(tempInNav, '!=', true);
const units = new SelectSetting('units', 'metric', [
    'metric',
    'scientific',
    'imperial',
])
    .addAlias('weatherDisplay.units')
    .disabledIf(enabled, '!=', true);
const provider = new SelectSetting('provider', 'wttrIn', [
    'wttrIn',
    'openMeteo',
    'visualCrossing',
    'openWeatherMap',
    'pirateWeather',
])
    .addAlias('weatherDisplay.provider')
    .disabledIf(enabled, '!=', true);

const apiKeys = new Map<string, TextSetting>();
['visualCrossing', 'openWeatherMap', 'pirateWeather'].forEach(providerKey => {
    const setting = new TextSetting(`api.${providerKey}`, '')
        .addAlias(`weatherDisplay.${providerKey}APIKey`)
        .disabledIf(enabled, '!=', true)
        .disabledIf(provider, '!=', providerKey);
    apiKeys.set(providerKey, setting);
});

/**
 * Reloads the weather feature. Starts/ends all update processes and adds/removes the elements from DOM
 */
const reload = () => {
    if (!enabled.value) return;
    console.log(CITY);
};

export default FeatureGroup.register({
    settings: new Set([
        enabled,
        tempInNav,
        feelLikeTempInNav,
        units,
        provider,
        ...apiKeys.values(),
    ]),
    onload: reload,
    onunload: reload,
});
