export const enum WeatherCondition {
    UNKNOWN,

    CLEAR,
    FEW_CLOUDS,
    SCATTERED_CLOUDS,
    BROKEN_CLOUDS,
    OVERCAST_CLOUDS,

    MIST,
    FOG,
    FREEZING_FOG,
    DUST,
    SAND,
    HAZE,
    SMOKE,
    VOLCANIC_ASH,

    WIND,
    SQUALLS,
    TORNADO,

    LIGHT_SNOW,
    MODERATE_SNOW,
    HEAVY_SNOW,

    LIGHT_RAIN,
    MODERATE_RAIN,
    HEAVY_RAIN,

    LIGHT_DRIZZLE,
    MODERATE_DRIZZLE,
    HEAVY_DRIZZLE,

    LIGHT_SLEET,
    MODERATE_SLEET,

    LIGHT_THUNDERSTORM,
    MODERATE_THUNDERSTORM,
    HEAVY_THUNDERSTORM,

    LIGHT_FREEZING_RAIN,
    MODERATE_FREEZING_RAIN,

    LIGHT_FREEZING_DRIZZLE,
    MODERATE_FREEZING_DRIZZLE,
    HEAVY_FREEZING_DRIZZLE,

    LIGHT_RAIN_SHOWERS,
    MODERATE_RAIN_SHOWERS,
    HEAVY_RAIN_SHOWERS,

    LIGHT_SLEET_SHOWERS,
    MODERATE_SLEET_SHOWERS,

    LIGHT_DRIZZLE_SHOWERS,
    MODERATE_DRIZZLE_SHOWERS,
    HEAVY_DRIZZLE_SHOWERS,

    LIGHT_SNOW_SHOWERS,
    MODERATE_SNOW_SHOWERS,
    HEAVY_SNOW_SHOWERS,

    LIGHT_HAIL_SHOWERS,
    MODERATE_HAIL_SHOWERS,

    LIGHT_THUNDERSTORM_WITH_DRIZZLE,
    MODERATE_THUNDERSTORM_WITH_DRIZZLE,
    HEAVY_THUNDERSTORM_WITH_DRIZZLE,

    LIGHT_THUNDERSTORM_WITH_RAIN,
    MODERATE_THUNDERSTORM_WITH_RAIN,
    HEAVY_THUNDERSTORM_WITH_RAIN,

    LIGHT_THUNDERSTORM_WITH_SNOW,
    MODERATE_THUNDERSTORM_WITH_SNOW,

    MODERATE_THUNDERSTORM_WITH_HAIL,
    HEAVY_THUNDERSTORM_WITH_HAIL,

    MODERATE_THUNDERSTORM_WITH_RAIN_SHOWERS,

    EXTREME_SNOW,
    EXTREME_RAIN,

    PATCHY_RAIN_NEARBY,
    PATCHY_SNOW_NEARBY,
    PATCHY_SLEET_NEARBY,
    PATCHY_FREEZING_DRIZZLE_NEARBY,
    THUNDERY_OUTBREAKS_NEARBY,
}

// We need these translations in this file because otherwise esbuild would not inline the large enum
const i18nDe = {
    [WeatherCondition.UNKNOWN]:
        'Ich bin verwirrt, mir ist das Wetter nicht bekannt :(',

    [WeatherCondition.CLEAR]: 'Klarer Himmel',
    [WeatherCondition.FEW_CLOUDS]: 'Wenige Wolken',
    [WeatherCondition.SCATTERED_CLOUDS]: 'Vereinzelte Wolken',
    [WeatherCondition.BROKEN_CLOUDS]: 'Zerstreute Wolken',
    [WeatherCondition.OVERCAST_CLOUDS]: 'Bedeckter Himmel',

    [WeatherCondition.MIST]: 'Nebel',
    [WeatherCondition.FOG]: 'Nebel',
    [WeatherCondition.FREEZING_FOG]: 'Gefrierender Nebel',
    [WeatherCondition.DUST]: 'Staub',
    [WeatherCondition.SAND]: 'Sand',
    [WeatherCondition.HAZE]: 'Dunst',
    [WeatherCondition.SMOKE]: 'Rauch',
    [WeatherCondition.VOLCANIC_ASH]: 'Vulkanasche',

    [WeatherCondition.WIND]: 'Wind',
    [WeatherCondition.SQUALLS]: 'Windböen',
    [WeatherCondition.TORNADO]: 'Tornado',

    [WeatherCondition.LIGHT_SNOW]: 'Leichter Schnee',
    [WeatherCondition.MODERATE_SNOW]: 'Schnee',
    [WeatherCondition.HEAVY_SNOW]: 'Starker Schnee',

    [WeatherCondition.LIGHT_RAIN]: 'Leichter Regen',
    [WeatherCondition.MODERATE_RAIN]: 'Regen',
    [WeatherCondition.HEAVY_RAIN]: 'Starker Regen',

    [WeatherCondition.LIGHT_DRIZZLE]: 'Leichter Nieselregen',
    [WeatherCondition.MODERATE_DRIZZLE]: 'Nieselregen',
    [WeatherCondition.HEAVY_DRIZZLE]: 'Starker Nieselregen',

    [WeatherCondition.LIGHT_SLEET]: 'Leichter Schneeregen',
    [WeatherCondition.MODERATE_SLEET]: 'Schneeregen',

    [WeatherCondition.LIGHT_THUNDERSTORM]: 'Leichtes Gewitter',
    [WeatherCondition.MODERATE_THUNDERSTORM]: 'Gewitter',
    [WeatherCondition.HEAVY_THUNDERSTORM]: 'Starkes Gewitter',

    [WeatherCondition.LIGHT_FREEZING_RAIN]: 'Leichter gefrierender Regen',
    [WeatherCondition.MODERATE_FREEZING_RAIN]: 'Gefrierender Regen',

    [WeatherCondition.LIGHT_FREEZING_DRIZZLE]:
        'Leichter gefrierender Nieselregen',
    [WeatherCondition.MODERATE_FREEZING_DRIZZLE]: 'Gefrierender Nieselregen',
    [WeatherCondition.HEAVY_FREEZING_DRIZZLE]:
        'Starker gefrierender Nieselregen',

    [WeatherCondition.LIGHT_RAIN_SHOWERS]: 'Leichte Regenschauer',
    [WeatherCondition.MODERATE_RAIN_SHOWERS]: 'Regenschauer',
    [WeatherCondition.HEAVY_RAIN_SHOWERS]: 'Starke Regenschauer',

    [WeatherCondition.LIGHT_SLEET_SHOWERS]: 'Leichte Schneeregen-Schauer',
    [WeatherCondition.MODERATE_SLEET_SHOWERS]: 'Schneeregen-Schauer',

    [WeatherCondition.LIGHT_DRIZZLE_SHOWERS]: 'Leichte Nieselregen-Schauer',
    [WeatherCondition.MODERATE_DRIZZLE_SHOWERS]: 'Nieselregen-Schauer',
    [WeatherCondition.HEAVY_DRIZZLE_SHOWERS]: 'Starke Nieselregen-Schauer',

    [WeatherCondition.LIGHT_SNOW_SHOWERS]: 'Leichte Schneeschauer',
    [WeatherCondition.MODERATE_SNOW_SHOWERS]: 'Schneeschauer',
    [WeatherCondition.HEAVY_SNOW_SHOWERS]: 'Starke Schneeschauer',

    [WeatherCondition.LIGHT_HAIL_SHOWERS]: 'Leichte Hagelschauer',
    [WeatherCondition.MODERATE_HAIL_SHOWERS]: 'Hagelschauer',

    [WeatherCondition.LIGHT_THUNDERSTORM_WITH_DRIZZLE]:
        'Leichtes Gewitter mit Nieselregen',
    [WeatherCondition.MODERATE_THUNDERSTORM_WITH_DRIZZLE]:
        'Gewitter mit Nieselregen',
    [WeatherCondition.HEAVY_THUNDERSTORM_WITH_DRIZZLE]:
        'Starkes Gewitter mit Nieselregen',

    [WeatherCondition.LIGHT_THUNDERSTORM_WITH_RAIN]:
        'Leichtes Gewitter mit Regen',
    [WeatherCondition.MODERATE_THUNDERSTORM_WITH_RAIN]: 'Gewitter mit Regen',
    [WeatherCondition.HEAVY_THUNDERSTORM_WITH_RAIN]:
        'Starkes Gewitter mit Regen',

    [WeatherCondition.LIGHT_THUNDERSTORM_WITH_SNOW]:
        'Leichtes Gewitter mit Schnee',
    [WeatherCondition.MODERATE_THUNDERSTORM_WITH_SNOW]: 'Gewitter mit Schnee',

    [WeatherCondition.MODERATE_THUNDERSTORM_WITH_HAIL]: 'Gewitter mit Hagel',
    [WeatherCondition.HEAVY_THUNDERSTORM_WITH_HAIL]:
        'Starkes Gewitter mit Hagel',

    [WeatherCondition.MODERATE_THUNDERSTORM_WITH_RAIN_SHOWERS]:
        'Gewitter mit Hagelschauern',

    [WeatherCondition.EXTREME_SNOW]: 'Schneesturm',
    [WeatherCondition.EXTREME_RAIN]: 'Extremer Regen',

    [WeatherCondition.PATCHY_RAIN_NEARBY]: 'Vereinzelt Regen in der Nähe',
    [WeatherCondition.PATCHY_SNOW_NEARBY]: 'Vereinzelt Schnee in der Nähe',
    [WeatherCondition.PATCHY_SLEET_NEARBY]:
        'Vereinzelt Schneeregen in der Nähe',
    [WeatherCondition.PATCHY_FREEZING_DRIZZLE_NEARBY]:
        'Vereinzelt gefrierender Nieselregen in der Nähe',
    [WeatherCondition.THUNDERY_OUTBREAKS_NEARBY]: 'Gewitter in der Nähe',
} satisfies Record<WeatherCondition, string>;
const i18nEn = {
    [WeatherCondition.UNKNOWN]: 'I am confused, the weather is unknown :(',

    [WeatherCondition.CLEAR]: 'Clear sky',
    [WeatherCondition.FEW_CLOUDS]: 'Few clouds',
    [WeatherCondition.SCATTERED_CLOUDS]: 'Scattered clouds',
    [WeatherCondition.BROKEN_CLOUDS]: 'Broken clouds',
    [WeatherCondition.OVERCAST_CLOUDS]: 'Overcast clouds',

    [WeatherCondition.MIST]: 'Mist',
    [WeatherCondition.FOG]: 'Fog',
    [WeatherCondition.FREEZING_FOG]: 'Freezing fog',
    [WeatherCondition.DUST]: 'Dust',
    [WeatherCondition.SAND]: 'Sand',
    [WeatherCondition.HAZE]: 'Haze',
    [WeatherCondition.SMOKE]: 'Smoke',
    [WeatherCondition.VOLCANIC_ASH]: 'Volcanic ash',

    [WeatherCondition.WIND]: 'Wind',
    [WeatherCondition.SQUALLS]: 'Squalls',
    [WeatherCondition.TORNADO]: 'Tornado',

    [WeatherCondition.LIGHT_SNOW]: 'Light snow',
    [WeatherCondition.MODERATE_SNOW]: 'Snow',
    [WeatherCondition.HEAVY_SNOW]: 'Heavy snow',

    [WeatherCondition.LIGHT_RAIN]: 'Light rain',
    [WeatherCondition.MODERATE_RAIN]: 'Regen',
    [WeatherCondition.HEAVY_RAIN]: 'Heavy rain',

    [WeatherCondition.LIGHT_DRIZZLE]: 'Light drizzle',
    [WeatherCondition.MODERATE_DRIZZLE]: 'Drizzle',
    [WeatherCondition.HEAVY_DRIZZLE]: 'Heavy drizzle',

    [WeatherCondition.LIGHT_SLEET]: 'Light sleet',
    [WeatherCondition.MODERATE_SLEET]: 'Sleet',

    [WeatherCondition.LIGHT_THUNDERSTORM]: 'Light thunderstorm',
    [WeatherCondition.MODERATE_THUNDERSTORM]: 'Thunderstorm',
    [WeatherCondition.HEAVY_THUNDERSTORM]: 'Heavy thunderstorm',

    [WeatherCondition.LIGHT_FREEZING_RAIN]: 'Light freezing rain',
    [WeatherCondition.MODERATE_FREEZING_RAIN]: 'Freezing rain',

    [WeatherCondition.LIGHT_FREEZING_DRIZZLE]: 'Light freezing drizzle',
    [WeatherCondition.MODERATE_FREEZING_DRIZZLE]: 'Freezing drizzle',
    [WeatherCondition.HEAVY_FREEZING_DRIZZLE]: 'Heavy freezing drizzle',

    [WeatherCondition.LIGHT_RAIN_SHOWERS]: 'Light rain showers',
    [WeatherCondition.MODERATE_RAIN_SHOWERS]: 'Rain showes',
    [WeatherCondition.HEAVY_RAIN_SHOWERS]: 'Heavy rain showers',

    [WeatherCondition.LIGHT_SLEET_SHOWERS]: 'Light sleet showers',
    [WeatherCondition.MODERATE_SLEET_SHOWERS]: 'Sleet showes',

    [WeatherCondition.LIGHT_DRIZZLE_SHOWERS]: 'Light drizzle showers',
    [WeatherCondition.MODERATE_DRIZZLE_SHOWERS]: 'Drizzle showers',
    [WeatherCondition.HEAVY_DRIZZLE_SHOWERS]: 'Heavy drizzle showers',

    [WeatherCondition.LIGHT_SNOW_SHOWERS]: 'Light snow showes',
    [WeatherCondition.MODERATE_SNOW_SHOWERS]: 'Snow showers',
    [WeatherCondition.HEAVY_SNOW_SHOWERS]: 'Heaby snow showers',

    [WeatherCondition.LIGHT_HAIL_SHOWERS]: 'Light hail shower',
    [WeatherCondition.MODERATE_HAIL_SHOWERS]: 'Hail shower',

    [WeatherCondition.LIGHT_THUNDERSTORM_WITH_DRIZZLE]:
        'Light thunderstorm with drizzle',
    [WeatherCondition.MODERATE_THUNDERSTORM_WITH_DRIZZLE]:
        'Thunderstorm with drizzle',
    [WeatherCondition.HEAVY_THUNDERSTORM_WITH_DRIZZLE]:
        'Heavy thunderstorm with drizzle',

    [WeatherCondition.LIGHT_THUNDERSTORM_WITH_RAIN]:
        'Light thunderstorm with rain',
    [WeatherCondition.MODERATE_THUNDERSTORM_WITH_RAIN]:
        'Thunderstorm with rain',
    [WeatherCondition.HEAVY_THUNDERSTORM_WITH_RAIN]:
        'Heavy thunderstorm with rain',

    [WeatherCondition.LIGHT_THUNDERSTORM_WITH_SNOW]:
        'Light thunderstorm with snow',
    [WeatherCondition.MODERATE_THUNDERSTORM_WITH_SNOW]:
        'Thunderstorm with snow',

    [WeatherCondition.MODERATE_THUNDERSTORM_WITH_HAIL]:
        'Thunderstorm with hail',
    [WeatherCondition.HEAVY_THUNDERSTORM_WITH_HAIL]:
        'Heavy thunderstorm with hail',

    [WeatherCondition.MODERATE_THUNDERSTORM_WITH_RAIN_SHOWERS]:
        'Thunderstorm with rain showers',

    [WeatherCondition.EXTREME_SNOW]: 'Blizzard',
    [WeatherCondition.EXTREME_RAIN]: 'Extreme rain',

    [WeatherCondition.PATCHY_RAIN_NEARBY]: 'Patchy rain nearby',
    [WeatherCondition.PATCHY_SNOW_NEARBY]: 'Patchy snow nearby',
    [WeatherCondition.PATCHY_SLEET_NEARBY]: 'Patchy sleet nearby',
    [WeatherCondition.PATCHY_FREEZING_DRIZZLE_NEARBY]:
        'Patchy freezing drizzle nearby',
    [WeatherCondition.THUNDERY_OUTBREAKS_NEARBY]: 'Thundery outbreaks nearby',
} satisfies typeof i18nDe;
export const i18n = { de: i18nDe, en: i18nEn };

export const unknownWeather = WeatherCondition.UNKNOWN;

const conditionsByEmoji = new Map<string, Set<WeatherCondition>>([
    ['❓', new Set([WeatherCondition.UNKNOWN])],

    ['☀️', new Set([WeatherCondition.CLEAR])],
    ['🌤️', new Set([WeatherCondition.FEW_CLOUDS])],
    ['⛅', new Set([WeatherCondition.SCATTERED_CLOUDS])],
    ['🌥️', new Set([WeatherCondition.BROKEN_CLOUDS])],
    ['☁️', new Set([WeatherCondition.OVERCAST_CLOUDS])],

    [
        '🌫️',
        new Set([
            WeatherCondition.MIST,
            WeatherCondition.FOG,
            WeatherCondition.FREEZING_FOG,
            WeatherCondition.HAZE,
            WeatherCondition.SMOKE,
        ]),
    ],
    [
        '🌪️',
        new Set([
            WeatherCondition.DUST,
            WeatherCondition.SAND,
            WeatherCondition.TORNADO,
        ]),
    ],
    ['🌋', new Set([WeatherCondition.VOLCANIC_ASH])],

    ['🌬️', new Set([WeatherCondition.WIND, WeatherCondition.SQUALLS])],

    [
        '🌨️',
        new Set([
            WeatherCondition.LIGHT_SNOW,
            WeatherCondition.MODERATE_SNOW,
            WeatherCondition.LIGHT_SLEET,
            WeatherCondition.MODERATE_SLEET,
            WeatherCondition.LIGHT_SNOW_SHOWERS,
            WeatherCondition.MODERATE_SNOW_SHOWERS,
            WeatherCondition.HEAVY_SNOW_SHOWERS,
            WeatherCondition.LIGHT_SLEET_SHOWERS,
            WeatherCondition.MODERATE_SLEET_SHOWERS,
            WeatherCondition.LIGHT_THUNDERSTORM_WITH_SNOW,
            WeatherCondition.MODERATE_THUNDERSTORM_WITH_SNOW,
            WeatherCondition.MODERATE_THUNDERSTORM_WITH_HAIL,
            WeatherCondition.HEAVY_THUNDERSTORM_WITH_HAIL,
            WeatherCondition.PATCHY_SNOW_NEARBY,
        ]),
    ],
    [
        '❄️',
        new Set([WeatherCondition.HEAVY_SNOW, WeatherCondition.EXTREME_SNOW]),
    ],

    [
        '🌦️',
        new Set([
            WeatherCondition.LIGHT_RAIN,
            WeatherCondition.LIGHT_DRIZZLE,
            WeatherCondition.LIGHT_RAIN_SHOWERS,
            WeatherCondition.LIGHT_DRIZZLE_SHOWERS,
            WeatherCondition.PATCHY_RAIN_NEARBY,
            WeatherCondition.LIGHT_THUNDERSTORM_WITH_DRIZZLE,
            WeatherCondition.LIGHT_THUNDERSTORM_WITH_RAIN,
        ]),
    ],
    [
        '🌧️',
        new Set([
            WeatherCondition.MODERATE_RAIN,
            WeatherCondition.HEAVY_RAIN,
            WeatherCondition.MODERATE_DRIZZLE,
            WeatherCondition.HEAVY_DRIZZLE,
            WeatherCondition.MODERATE_RAIN_SHOWERS,
            WeatherCondition.HEAVY_RAIN_SHOWERS,
            WeatherCondition.MODERATE_DRIZZLE_SHOWERS,
            WeatherCondition.HEAVY_DRIZZLE_SHOWERS,
            WeatherCondition.LIGHT_FREEZING_RAIN,
            WeatherCondition.MODERATE_FREEZING_RAIN,
            WeatherCondition.LIGHT_FREEZING_DRIZZLE,
            WeatherCondition.MODERATE_FREEZING_DRIZZLE,
            WeatherCondition.HEAVY_FREEZING_DRIZZLE,
            WeatherCondition.PATCHY_SLEET_NEARBY,
            WeatherCondition.PATCHY_FREEZING_DRIZZLE_NEARBY,
            WeatherCondition.MODERATE_THUNDERSTORM_WITH_DRIZZLE,
            WeatherCondition.HEAVY_THUNDERSTORM_WITH_DRIZZLE,
            WeatherCondition.MODERATE_THUNDERSTORM_WITH_RAIN,
            WeatherCondition.HEAVY_THUNDERSTORM_WITH_RAIN,
            WeatherCondition.MODERATE_THUNDERSTORM_WITH_RAIN_SHOWERS,
            WeatherCondition.LIGHT_HAIL_SHOWERS,
            WeatherCondition.MODERATE_HAIL_SHOWERS,
        ]),
    ],

    [
        '🌩️',
        new Set([
            WeatherCondition.LIGHT_THUNDERSTORM,
            WeatherCondition.LIGHT_THUNDERSTORM_WITH_DRIZZLE,
            WeatherCondition.LIGHT_THUNDERSTORM_WITH_RAIN,
            WeatherCondition.LIGHT_THUNDERSTORM_WITH_SNOW,
        ]),
    ],
    [
        '⛈️',
        new Set([
            WeatherCondition.MODERATE_THUNDERSTORM,
            WeatherCondition.HEAVY_THUNDERSTORM,
            WeatherCondition.MODERATE_THUNDERSTORM_WITH_DRIZZLE,
            WeatherCondition.HEAVY_THUNDERSTORM_WITH_DRIZZLE,
            WeatherCondition.MODERATE_THUNDERSTORM_WITH_RAIN,
            WeatherCondition.HEAVY_THUNDERSTORM_WITH_RAIN,
            WeatherCondition.MODERATE_THUNDERSTORM_WITH_SNOW,
            WeatherCondition.MODERATE_THUNDERSTORM_WITH_HAIL,
            WeatherCondition.HEAVY_THUNDERSTORM_WITH_HAIL,
            WeatherCondition.MODERATE_THUNDERSTORM_WITH_RAIN_SHOWERS,
            WeatherCondition.THUNDERY_OUTBREAKS_NEARBY,
        ]),
    ],

    ['🌊', new Set([WeatherCondition.EXTREME_RAIN])],
]);

/**
 * Get's the emoji that represents a weather condition
 * @param condition - the condition to get the emoji for
 * @returns the representing emoji
 */
export const getWeatherEmoji = (condition: WeatherCondition) =>
    conditionsByEmoji
        .entries()
        .find(([, codes]) => codes.has(condition))?.[0] ?? '❓️';

// We need these to be within here instead of within the provider to allow typescript not to convert the enum to a JS object

const wttrInCodeToCondition = {
    113: WeatherCondition.CLEAR,
    116: WeatherCondition.FEW_CLOUDS,
    119: WeatherCondition.BROKEN_CLOUDS,
    122: WeatherCondition.OVERCAST_CLOUDS,
    143: WeatherCondition.MIST,
    176: WeatherCondition.PATCHY_RAIN_NEARBY,
    179: WeatherCondition.PATCHY_SNOW_NEARBY,
    182: WeatherCondition.PATCHY_SLEET_NEARBY,
    185: WeatherCondition.PATCHY_FREEZING_DRIZZLE_NEARBY,
    200: WeatherCondition.THUNDERY_OUTBREAKS_NEARBY,
    227: WeatherCondition.HEAVY_SNOW,
    230: WeatherCondition.EXTREME_SNOW,
    248: WeatherCondition.FOG,
    260: WeatherCondition.FREEZING_FOG,
    263: WeatherCondition.LIGHT_DRIZZLE_SHOWERS,
    266: WeatherCondition.LIGHT_DRIZZLE,
    281: WeatherCondition.MODERATE_FREEZING_DRIZZLE,
    284: WeatherCondition.HEAVY_FREEZING_DRIZZLE,
    293: WeatherCondition.LIGHT_RAIN_SHOWERS,
    296: WeatherCondition.LIGHT_RAIN,
    299: WeatherCondition.MODERATE_RAIN_SHOWERS,
    302: WeatherCondition.MODERATE_RAIN,
    305: WeatherCondition.HEAVY_RAIN_SHOWERS,
    308: WeatherCondition.HEAVY_RAIN,
    311: WeatherCondition.LIGHT_FREEZING_RAIN,
    314: WeatherCondition.MODERATE_FREEZING_RAIN,
    317: WeatherCondition.LIGHT_SLEET,
    320: WeatherCondition.MODERATE_SLEET,
    323: WeatherCondition.LIGHT_SNOW_SHOWERS,
    326: WeatherCondition.LIGHT_SNOW,
    329: WeatherCondition.MODERATE_SNOW_SHOWERS,
    332: WeatherCondition.MODERATE_SNOW,
    335: WeatherCondition.HEAVY_SNOW_SHOWERS,
    338: WeatherCondition.HEAVY_SNOW,
    350: WeatherCondition.MODERATE_SLEET,
    353: WeatherCondition.LIGHT_RAIN_SHOWERS,
    356: WeatherCondition.MODERATE_RAIN_SHOWERS,
    359: WeatherCondition.EXTREME_RAIN,
    362: WeatherCondition.LIGHT_SLEET_SHOWERS,
    365: WeatherCondition.MODERATE_SLEET_SHOWERS,
    368: WeatherCondition.LIGHT_SNOW_SHOWERS,
    371: WeatherCondition.MODERATE_SNOW_SHOWERS,
    374: WeatherCondition.LIGHT_HAIL_SHOWERS,
    377: WeatherCondition.MODERATE_HAIL_SHOWERS,
    386: WeatherCondition.LIGHT_THUNDERSTORM_WITH_RAIN,
    389: WeatherCondition.MODERATE_THUNDERSTORM_WITH_RAIN,
    392: WeatherCondition.LIGHT_THUNDERSTORM_WITH_SNOW,
    395: WeatherCondition.MODERATE_THUNDERSTORM_WITH_SNOW,
};

const openMeteoCodeToCondition = {
    0: WeatherCondition.CLEAR,
    1: WeatherCondition.FEW_CLOUDS,
    2: WeatherCondition.BROKEN_CLOUDS,
    3: WeatherCondition.OVERCAST_CLOUDS,
    45: WeatherCondition.FOG,
    48: WeatherCondition.FREEZING_FOG,
    51: WeatherCondition.LIGHT_DRIZZLE,
    53: WeatherCondition.MODERATE_DRIZZLE,
    55: WeatherCondition.HEAVY_DRIZZLE,
    56: WeatherCondition.LIGHT_FREEZING_DRIZZLE,
    57: WeatherCondition.MODERATE_FREEZING_DRIZZLE,
    61: WeatherCondition.LIGHT_RAIN,
    63: WeatherCondition.MODERATE_RAIN,
    65: WeatherCondition.HEAVY_RAIN,
    66: WeatherCondition.LIGHT_FREEZING_RAIN,
    67: WeatherCondition.MODERATE_FREEZING_RAIN,
    71: WeatherCondition.LIGHT_SNOW,
    73: WeatherCondition.MODERATE_SNOW,
    75: WeatherCondition.HEAVY_SNOW,
    77: WeatherCondition.MODERATE_FREEZING_DRIZZLE,
    80: WeatherCondition.LIGHT_RAIN_SHOWERS,
    81: WeatherCondition.MODERATE_RAIN_SHOWERS,
    82: WeatherCondition.HEAVY_RAIN_SHOWERS,
    85: WeatherCondition.MODERATE_SNOW_SHOWERS,
    86: WeatherCondition.HEAVY_SNOW_SHOWERS,
    95: WeatherCondition.MODERATE_THUNDERSTORM,
    96: WeatherCondition.MODERATE_THUNDERSTORM_WITH_HAIL,
    99: WeatherCondition.HEAVY_THUNDERSTORM_WITH_HAIL,
};

interface ProviderCodes {
    wttrIn: number;
    openMeteo: number;
}

/**
 * Get the weather condition of a weather code for a specific provider
 * We need this helper method within this file so that typescript will make WeatherCondition a const enum
 * @param provider - the provider to use
 * @param code - the code as returned by the provider
 * @returns the matching weather code
 */
export const codeToCondition = <Provider extends keyof ProviderCodes>(
    provider: Provider,
    code: ProviderCodes[Provider]
): WeatherCondition => {
    switch (provider) {
        case 'wttrIn':
            return (
                wttrInCodeToCondition[
                    code as keyof typeof wttrInCodeToCondition
                ] ?? WeatherCondition.UNKNOWN
            );
        case 'openMeteo':
            return (
                openMeteoCodeToCondition[
                    code as keyof typeof openMeteoCodeToCondition
                ] ?? WeatherCondition.UNKNOWN
            );
    }
    return WeatherCondition.UNKNOWN;
};
