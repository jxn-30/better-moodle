import { Temporal } from '@js-temporal/polyfill';
import { cachedRequest } from '#lib/network';
import { codeToCondition } from '../util/condition';
import { FIVE_MINUTES } from '#lib/times';
import { type Weather, type WeatherResponse } from '../index';

// This is not the whole response but it contains all information needed
interface OpenWeatherMapResponse {
    coord: { lon: number; lat: number };
    weather: { id: number; main: string; description: string; icon: string }[];
    base: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
        sea_level: number;
        grnd_level: number;
    };
    visibility: number;
    wind: { speed: number; deg: number };
    clouds: { all: number };
    rain?: { '1h'?: number };
    snow?: { '1h'?: number };
    dt: number;
    sys: {
        type: number;
        id: number;
        country: string;
        sunrise: number;
        sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
}

/**
 * Retrieves the weather information from the API and extracts the relevant information
 * @param lat - latitude of where to get the weather of
 * @param lon - longitude of wehere to get the weather of
 * @param apiKey - the users API key for openweathermap.org
 * @returns weather information
 */
export default (
    lat: number,
    lon: number,
    apiKey: string
): Promise<WeatherResponse> => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    return cachedRequest(
        url,
        FIVE_MINUTES,
        'json',
        (weather: OpenWeatherMapResponse) => {
            return {
                condition: codeToCondition(
                    'openWeatherMap',
                    weather.weather[0].id
                ),
                temperature: {
                    actual: weather.main.temp,
                    feel: weather.main.feels_like,
                },
                wind: {
                    direction: weather.wind.deg,
                    speed: weather.wind.speed,
                },
                visibility: weather.visibility / 1000,
                humidity: weather.main.humidity / 100,
                pressure: weather.main.pressure,
                cloudCover: weather.clouds.all / 100,
                precipitation: weather.rain?.['1h'] ?? 0,
                meta: {
                    providerURL: `https://openweathermap.org`,
                    requestURL: url,
                    time: Temporal.Instant.fromEpochMilliseconds(weather.dt * 1000).toString(),
                },
            } satisfies Weather;
        }
    );
};
