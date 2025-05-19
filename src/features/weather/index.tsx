import { BooleanSetting } from '@/Settings/BooleanSetting';
import FeatureGroup from '@/FeatureGroup';
import { getHtml } from '@/DOM';
import { SelectSetting } from '@/Settings/SelectSetting';
import { TextSetting } from '@/Settings/TextSetting';
import { WeatherCode } from './util/codes';
import wttrIn from './providers/wttrIn';
import { NavbarItem, type NavbarItemComponent } from '@/Components';

const CITY =
    __UNI__ === 'cau' ?
        { display: 'Kiel', name: 'kiel', lat: 54.3388, lon: 10.1225 }
    :   { display: 'Lübeck', name: 'luebeck', lat: 53.8655, lon: 10.6866 };

export interface Weather {
    code: WeatherCode;
    temperature: { actual: number; feel: number };
    wind: { direction: number; speed: number };
    visibility: number;
    humidity: number;
    pressure: number;
    cloudCover: number;
    precipitation: number;
    time: Date;
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

const tooltipContent = <div></div>;

const tooltip = (
    <div>
        <b>{CITY.display}</b>
        {tooltipContent}
    </div>
);

/**
 * Sets the content of the navbar tooltip
 * @param content - the content
 */
const setTooltipContent = (
    content: Parameters<HTMLDivElement['append']>[0]
) => {
    delete navbarItem.dataset.originalTitle;

    // empty the tooltip
    tooltipContent.innerHTML = '';
    tooltipContent.append(content);

    navbarItem.title = getHtml(tooltip);
};

let navbarItem: NavbarItemComponent;

/**
 * Updates the weather using given provider.
 */
const updateWeather = () => {
    if (!navbarItem) return;

    // indicate that we're in a waiting state
    setTooltipContent('⏳️');

    if (provider.value === 'wttrIn') {
        void wttrIn(CITY.name).then(console.log);
    }
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
            <div className="nav-link">🌈</div>
        </NavbarItem>
    ) as NavbarItemComponent;
    navbarItem.put();

    updateWeather();
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
