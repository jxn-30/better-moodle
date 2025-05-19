import { cachedRequest } from '@/network';
import { FIVE_MINUTES } from '@/times';
import { type Weather } from '../index';
import { WeatherCondition } from '../util/condition';

// This is not the whole response but it contains all information needed
interface WttrInResponse {
    current_condition: {
        FeelsLikeC: `${number}`;
        FeelsLikeF: `${number}`;
        cloudcover: `${number}`;
        humidity: `${number}`;
        localObsDateTime: string;
        observation_time: string;
        precipInches: `${number}`;
        precipMM: `${number}`;
        pressure: `${number}`;
        pressureInches: `${number}`;
        temp_C: `${number}`;
        temp_F: `${number}`;
        uvIndex: `${number}`;
        visibility: `${number}`;
        visibilityMiles: `${number}`;
        weatherCode: `${number}`;
        winddir16Point: string;
        winddirDegree: `${number}`;
        windspeedKmph: `${number}`;
        windspeedMiles: `${number}`;
    }[];
}

const codeToCondition = {
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

/**
 * Retrieves the weather information from the API and extracts the relevant information
 * @param city - the city to get the weather for
 * @returns weather information
 */
export default (city: string): Promise<Weather> =>
    cachedRequest(
        `https://wttr.in/${city}?format=j1&lang`, // the &lang param is required to produce a valid response
        FIVE_MINUTES,
        'json',
        ({ current_condition: [weather] }: WttrInResponse) => {
            return {
                condition:
                    codeToCondition[
                        Number(
                            weather.weatherCode
                        ) as keyof typeof codeToCondition
                    ] ?? WeatherCondition.UNKNOWN,
                temperature: {
                    actual: Number(weather.temp_C),
                    feel: Number(weather.FeelsLikeC),
                },
                wind: {
                    direction: Number(weather.winddirDegree),
                    speed: Number(weather.windspeedKmph),
                },
                visibility: Number(weather.visibility),
                humidity: Number(weather.humidity),
                pressure: Number(weather.pressure),
                cloudCover: Number(weather.cloudcover),
                precipitation: Number(weather.precipMM),
                time: new Date(
                    `${weather.localObsDateTime.slice(0, 10)} ${weather.observation_time} +00:00`
                ),
            } satisfies Weather;
        }
    );
