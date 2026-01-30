import { cachedRequest } from '#lib/network';
import { codeToCondition } from '../util/condition';
import { FIVE_MINUTES } from '#lib/times';
import { type Weather, type WeatherResponse } from '../index';

// This is not the whole response but it contains all information needed
interface OpenMeteoResponse {
    current: {
        time: number;
        interval: number;
        temperature_2m: number;
        relative_humidity_2m: number;
        apparent_temperature: number;
        precipitation: number;
        weather_code: number;
        cloud_cover: number;
        surface_pressure: number;
        wind_speed_10m: number;
        wind_direction_10m: number;
    };
    minutely_15: { time: number[]; visibility: number[] };
}

/**
 * Retrieves the weather information from the API and extracts the relevant information
 * @param lat - latitude of the location to get the weather of
 * @param lon - longitude of the location to get the weather of
 * @returns weather information
 */
export default (lat: number, lon: number): Promise<WeatherResponse> => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m&minutely_15=visibility&timeformat=unixtime&timezone=auto&forecast_days=1`;
    return cachedRequest(
        url,
        FIVE_MINUTES,
        'json',
        (data: OpenMeteoResponse) => {
            const timestamp = new Date(data.current.time * 1000);
            const minutelyIndex =
                timestamp.getHours() * 4 +
                Math.ceil((timestamp.getMinutes() + 1) / 15);
            return {
                condition: codeToCondition(
                    'openMeteo',
                    data.current.weather_code
                ),
                temperature: {
                    actual: data.current.temperature_2m,
                    feel: data.current.apparent_temperature,
                },
                wind: {
                    direction: data.current.wind_direction_10m,
                    speed: data.current.wind_speed_10m,
                },
                visibility: data.minutely_15.visibility[minutelyIndex] / 1000,
                humidity: data.current.relative_humidity_2m / 100,
                pressure: data.current.surface_pressure,
                cloudCover: data.current.cloud_cover / 100,
                precipitation: data.current.precipitation,
                meta: {
                    providerURL: `https://open-meteo.com`,
                    requestURL: url,
                    time: timestamp.toISOString(),
                },
            } satisfies Weather;
        }
    );
};
