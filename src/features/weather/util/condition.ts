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

/**
 * Returns if a certain condition is unknown.
 * We need this helper function to allow esbuild inline the enum
 * @param condition - the condition to check
 * @returns wether the condition is unknown
 */
export const isUnknownWeather = (condition: WeatherCondition) =>
    condition === WeatherCondition.UNKNOWN;

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

interface ProviderCodes {
    wttrIn: number;
}

/**
 * Get the weather condition of a weather code for a specific provider
 * We need this helper method within this file so that typescript will make WeatherCodes a const enum
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
    }
};
