import { cachedRequest } from '@/network';
import { codeToCondition } from '../util/condition';
import { FIVE_MINUTES } from '@/times';
import { type Weather } from '../index';

// This is not the whole response but it contains all information needed
interface OpenWeatherMapResponse {
    current: {
        dt: number;
        sunrise: number;
        sunset: number;
        temp: number;
        feels_like: number;
        pressure: number;
        humidity: number;
        dew_point: number;
        uvi: number;
        clouds: number;
        visibility: number;
        wind_speed: number;
        wind_deg: number;
        wind_gust: number;
        rain?: { ['1h']?: number };
        weather: {
            id: number;
            main: string;
            description: string;
            icon: string;
        }[];
    };
}

/**
 * Retrieves the weather information from the API and extracts the relevant information
 * @param lat - latitude of where to get the weather of
 * @param lon - longitude of wehere to get the weather of
 * @param apiKey - the users API key for openweathermap.org
 * @returns weather information
 */
export default (lat: number, lon: number, apiKey: string): Promise<Weather> => {
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${apiKey}`;
    return cachedRequest(
        url,
        FIVE_MINUTES,
        'json',
        ({ current: weather }: OpenWeatherMapResponse) => {
            return {
                condition: codeToCondition(
                    'openWeatherMap',
                    weather.weather[0].id
                ),
                temperature: { actual: weather.temp, feel: weather.feels_like },
                wind: {
                    direction: weather.wind_deg,
                    speed: weather.wind_speed,
                },
                visibility: weather.visibility,
                humidity: weather.humidity / 100,
                pressure: weather.pressure,
                cloudCover: weather.clouds / 100,
                precipitation: weather.rain?.['1h'] ?? 0,
                meta: {
                    providerURL: `https://openweathermap.org`,
                    requestURL: url,
                    time: new Date(weather.dt * 1000).toISOString(),
                },
            } satisfies Weather;
        }
    );
};
