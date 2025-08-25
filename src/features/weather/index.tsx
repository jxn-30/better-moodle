import { BooleanSetting } from '@/Settings/BooleanSetting';
import FeatureGroup from '@/FeatureGroup';
import { FIVE_MINUTES } from '@/times';
import { getHtml } from '@/DOM';
import { Modal } from '@/Modal';
import openMeteo from './providers/openMeteo';
import openWeatherMap from './providers/openWeatherMap';
import { PREFIX } from '@/helpers';
import { SelectSetting } from '@/Settings/SelectSetting';
import { stringify } from './util/units';
import { TextSetting } from '@/Settings/TextSetting';
import visualCrossing from './providers/visualCrossing';
import wttrIn from './providers/wttrIn';
import { BETTER_MOODLE_LANG, LLFG } from 'i18n';
import {
    getWeatherEmoji,
    unknownWeather,
    type WeatherCondition,
} from './util/condition';
import { NavbarItem, type NavbarItemComponent } from '@/Components';
import { percent, timeToString } from '@/localeString';

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
    meta: {
        providerURL: string;
        requestURL: string;
        time: ReturnType<Date['toISOString']>; // needs to be an ISO string as otherwise GM_setValue cannot store it
    };
}

export interface WeatherResponse {
    cached: boolean;
    value: Weather;
}

type Provider = keyof (typeof LL)['providers'];

const providersWithoutAPIKey: Provider[] = ['wttrIn', 'openMeteo'];
const providersWithAPIKey: Provider[] = ['visualCrossing', 'openWeatherMap'];

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

const providerOptions = providersWithoutAPIKey.map(p => ({
    key: p,
    title: LL.providers[p]() as string,
}));
providersWithAPIKey.forEach(p =>
    providerOptions.push({
        key: p,
        title: `${LL.providers[p]()} (${LL.apiKeyRequired()})`,
    })
);
const provider = new SelectSetting('provider', 'wttrIn', providerOptions)
    .addAlias('weatherDisplay.provider')
    .disabledIf(enabled, '!=', true);

const apiKeys = new Map<string, TextSetting>();
providersWithAPIKey.forEach(providerKey => {
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
const windDegreesToDirection = (degrees: number) =>
    ({
        'de': ['N', 'NO', 'O', 'SO', 'S', 'SW', 'W', 'NW'],
        'en-gb': ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
    })[BETTER_MOODLE_LANG][Math.round(degrees / 45) % 8];

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

    navbarItem.dataset.originalTitle = getHtml(tooltip);
};

let navbarItem: NavbarItemComponent;

let detailsModal: Modal;
const detailsModalTBody = <tbody></tbody>;
const detailsModalBody = (
    <table className="table table-striped table-hover m-0">
        {detailsModalTBody}
    </table>
) as HTMLTableElement;
const detailsModalFooter = (
    <span className="mr-auto"></span>
) as HTMLSpanElement;

/**
 * Sets the navbar item to a warning about the abscence of an API-Key
 * @param provider - the name of the provider this warning happens for
 */
const showInvalidAPIKey = (provider: string) => {
    navbarText.textContent = '🔒';
    setTooltipContent(
        <>
            <strong>{LL.apiKeyRequired()}</strong>
            <br />
            {LL.apiKeyWarning({ provider })}
        </>
    );
};

/**
 * Sets the navbar item to a warning that indicates an error while fetching the weather
 * @param error - the error that is thrown while fetching the weather
 */
const showError = (error: Error) => {
    navbarText.textContent = '❌';
    setTooltipContent(
        <>
            {LL.fetchError()}
            <hr />
            <pre className="text-wrap word-break text-white text-left">
                {error.toString()}
            </pre>
        </>
    );
};

let updateTimeout: ReturnType<(typeof window)['setTimeout']>;
const updateWeatherChannelName = PREFIX('weather-update-weather');
const updateWeatherChannel = new BroadcastChannel(updateWeatherChannelName);
updateWeatherChannel.addEventListener('message', () => void updateWeather());

/**
 * Updates the weather using given provider.
 */
const updateWeather = async () => {
    if (!navbarItem) return;

    // indicate that we're in a waiting state
    // navbarText.textContent = '🌈'; // <- that is a little annoying as the navbar flickers when weather is updating
    setTooltipContent('⏳️');

    let response: WeatherResponse | null | void = null;
    if (provider.value === 'wttrIn') {
        response = await wttrIn(CITY.name).catch(showError);
    } else if (provider.value === 'openMeteo') {
        response = await openMeteo(CITY.lat, CITY.lon).catch(showError);
    } else if (provider.value === 'visualCrossing') {
        const apiKey = apiKeys.get('visualCrossing')?.value ?? '';
        if (!apiKey) showInvalidAPIKey(LL.providers.visualCrossing());
        else {
            response = await visualCrossing(CITY.name, apiKey).catch(showError);
        }
    } else if (provider.value === 'openWeatherMap') {
        const apiKey = apiKeys.get('openWeatherMap')?.value ?? '';
        if (!apiKey) showInvalidAPIKey(LL.providers.openWeatherMap());
        else {
            response = await openWeatherMap(CITY.lat, CITY.lon, apiKey).catch(
                showError
            );
        }
    } else return;

    // on error, cached should be true as we would otherwise get an infinite loop of broadcast message sendings on persistend errors
    const { value: weather, cached } = response ?? {
        value: undefined,
        cached: true,
    };

    // trigger the next update in 5 Minutes
    if (updateTimeout) clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => void updateWeather(), FIVE_MINUTES);

    // no weather (e.g. due to an error)? => abort
    if (!weather) {
        detailsModal?.unsetTrigger(navbarItem);
        detailsModal?.hide();
        return;
    }

    // if we reveiced an updated weather, send this to everyone else! :)
    if (!cached) updateWeatherChannel.postMessage('');

    const weatherEmoji = getWeatherEmoji(weather.condition);

    // set the navbar content
    navbarText.textContent = weatherEmoji;

    if (weather.condition === unknownWeather) {
        setTooltipContent(`${weatherEmoji} ${LL.conditions[unknownWeather]()}`);
        return;
    }

    if (tempInNav.value) {
        if (feelLikeTempInNav.value) {
            navbarText.textContent += ` ${stringify(weather.temperature.feel, 'temperature', currentUnit())}`;
        } else {
            navbarText.textContent += ` ${stringify(weather.temperature.actual, 'temperature', currentUnit())}`;
        }
    }

    const date = new Date(weather.meta.time);

    const weatherSummary = `${weatherEmoji} ${LL.conditions[weather.condition]()}`;

    setTooltipContent(
        <>
            <strong>{weatherSummary}</strong>
            <br />
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
            &nbsp;({windDegreesToDirection(weather.wind.direction)})
            <br />
            💦:&nbsp;
            {stringify(weather.precipitation, 'distanceMm', currentUnit())}
            <br />
            <br />
            <small>
                {LL.providers[provider.value]()}&nbsp;⋅&nbsp;
                {timeToString(date, false)}
            </small>
        </>
    );

    const modalTitle = `${weatherEmoji} ${LL.modal.title({ city: CITY.display })}`;

    detailsModal ??= new Modal({
        type: 'ALERT',
        title: modalTitle,
        body: detailsModalBody,
        bodyClass: ['table-responsive', 'p-0'],
        footer: detailsModalFooter,
        removeOnClose: false,
    }).setTrigger(navbarItem);

    void detailsModal
        .getTitle()
        .then(([title]) => (title.textContent = modalTitle));

    detailsModalTBody.replaceChildren(
        <tr>
            <th>{LL.modal.condition()}</th>
            <td>{weatherSummary}</td>
        </tr>,
        <tr>
            <th>
                {LL.modal.temperature()} ({LL.modal.temperatureFeelsLike()})
            </th>
            <td>
                {stringify(
                    weather.temperature.actual,
                    'temperature',
                    currentUnit()
                )}{' '}
                (
                {stringify(
                    weather.temperature.feel,
                    'temperature',
                    currentUnit()
                )}
                )
            </td>
        </tr>,
        <tr>
            <th>
                {LL.modal.wind()} ({LL.modal.windDirection()})
            </th>
            <td>
                {stringify(weather.wind.speed, 'speed', currentUnit())} (
                {windDegreesToDirection(weather.wind.direction)})
            </td>
        </tr>,
        <tr>
            <th>{LL.modal.visibility()}</th>
            <td>
                {stringify(weather.visibility, 'distanceKm', currentUnit())}
            </td>
        </tr>,
        <tr>
            <th>{LL.modal.humidity()}</th>
            <td>{percent(weather.humidity)}</td>
        </tr>,
        <tr>
            <th>{LL.modal.pressure()}</th>
            <td>{stringify(weather.pressure, 'pressure', currentUnit())}</td>
        </tr>,
        <tr>
            <th>{LL.modal.cloudCover()}</th>
            <td>{percent(weather.cloudCover)}</td>
        </tr>,
        <tr>
            <th>{LL.modal.precipitation()}</th>
            <td>
                {stringify(weather.precipitation, 'distanceMm', currentUnit())}
            </td>
        </tr>
    );

    detailsModalFooter.replaceChildren(
        <>
            {LL.modal.source()}:&nbsp;
            <a href={weather.meta.providerURL} target="_blank">
                {LL.providers[provider.value]()}
            </a>
            {' ⋅ '}
            {timeToString(date, false)}
            {' ⋅ '}
            <a href={weather.meta.requestURL} target="_blank">
                {LL.modal.raw()}
            </a>
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
