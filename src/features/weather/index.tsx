import { BooleanSetting } from '@/Settings/BooleanSetting';
import FeatureGroup from '@/FeatureGroup';
import { getHtml } from '@/DOM';
import { LLFG } from 'i18n';
import { SelectSetting } from '@/Settings/SelectSetting';
import { stringify } from './util/units';
import { TextSetting } from '@/Settings/TextSetting';
import { timeToString } from '@/localeString';
import wttrIn from './providers/wttrIn';
import {
    getWeatherEmoji,
    isUnknownWeather,
    type WeatherCondition,
} from './util/condition';
import { NavbarItem, type NavbarItemComponent } from '@/Components';

const LL = LLFG('weather');

const CITY =
    __UNI__ === 'cau' ?
        { display: 'Kiel', name: 'kiel', lat: 54.3388, lon: 10.1225 }
    :   { display: 'Lübeck', name: 'luebeck', lat: 53.8655, lon: 10.6866 };

export interface Weather {
    condition: WeatherCondition;
    temperature: { actual: number; feel: number };
    wind: { direction: number; speed: number };
    visibility: number;
    humidity: number;
    pressure: number;
    cloudCover: number;
    precipitation: number;
    time: ReturnType<Date['toISOString']>; // needs to be an ISO string as otherwise GM_setValue cannot store it
}

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
 * Gets the current unit system
 * @returns the current unit system
 */
const currentUnit = () =>
    units.value as unknown as 'metric' | 'scientific' | 'imperial';

const navbarText = <div className="nav-link">🌈</div>;

const tooltipContent = <div></div>;
const tooltip = (
    <div>
        <b>{CITY.display}</b>
        {tooltipContent}
    </div>
);

/**
 * Returns an arrow matching the wind direction
 * @param degrees - the degrees
 * @returns the arrow for this direction
 */
const windDirectionToArrow = (degrees: number) =>
    ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'][Math.round(degrees / 45) % 8];

/**
 * Sets the content of the navbar tooltip
 * @param content - the content
 */
const setTooltipContent = (
    content: Parameters<HTMLDivElement['append']>[0]
) => {
    // empty the tooltip
    tooltipContent.innerHTML = '';
    tooltipContent.append(content);

    navbarItem.dataset.originalTitle = navbarItem.title = getHtml(tooltip);
};

let navbarItem: NavbarItemComponent;

/**
 * Updates the weather using given provider.
 */
const updateWeather = async () => {
    if (!navbarItem) return;

    // indicate that we're in a waiting state
    navbarText.textContent = '🌈';
    setTooltipContent('⏳️');

    let weather: Weather;
    if (provider.value === 'wttrIn') {
        weather = await wttrIn(CITY.name);
    } else return;

    const weatherEmoji = getWeatherEmoji(weather.condition);

    // set the navbar content
    navbarText.textContent = weatherEmoji;

    if (isUnknownWeather(weather.condition)) {
        setTooltipContent(`${weatherEmoji} ${LL.unknownWeather()}`);
        return;
    }

    if (tempInNav.value) {
        if (feelLikeTempInNav.value) {
            navbarText.textContent += ` ${stringify(weather.temperature.feel, 'temperature', currentUnit())}`;
        } else {
            navbarText.textContent += ` ${stringify(weather.temperature.actual, 'temperature', currentUnit())}`;
        }
    }

    const date = new Date(weather.time);

    setTooltipContent(
        <>
            🌡️:&nbsp;
            {stringify(
                weather.temperature.actual,
                'temperature',
                currentUnit()
            )}
            &nbsp;(
            {stringify(weather.temperature.feel, 'temperature', currentUnit())})
            <br />
            🪁:&nbsp;
            {stringify(weather.wind.speed, 'speed', currentUnit())}
            &nbsp;({windDirectionToArrow(weather.wind.direction)})
            <br />
            💦:&nbsp;
            {stringify(weather.precipitation, 'distanceMm', currentUnit())}
            <br />
            <br />
            <small>
                {LL.settings.provider.options[provider.value]()}&nbsp;⋅&nbsp;
                {timeToString(date, false)}
            </small>
        </>
    );
};

/**
 * Reloads the weather feature. Starts/ends all update processes and adds/removes the elements from DOM
 */
const reload = () => {
    if (!enabled.value) {
        navbarItem?.remove();
        return;
    }

    navbarItem ??= (
        <NavbarItem
            order={800}
            data-toggle="tooltip"
            data-placement="bottom"
            data-html="true"
        >
            {navbarText}
        </NavbarItem>
    ) as NavbarItemComponent;
    navbarItem.put();

    void updateWeather();
};

const settings = new Set([
    enabled,
    tempInNav,
    feelLikeTempInNav,
    units,
    provider,
    ...apiKeys.values(),
]);
settings.forEach(setting => setting.onChange(reload));

export default FeatureGroup.register({
    settings,
    onload: reload,
    onunload: reload,
});
