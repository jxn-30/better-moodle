import { cachedRequest } from '@/network';
import { codeToCondition } from '../util/condition';
import { FIVE_MINUTES } from '@/times';
import { type Weather, type WeatherResponse } from '../index';

// This is not the whole response but it contains all information needed
interface VisualCrossingResponse {
    currentConditions: {
        datetime: string;
        datetimeEpoch: number;
        temp: number;
        feelslike: number;
        humidity: number;
        dew: number;
        precip: number;
        precipprob: number;
        snow: number;
        snowdepth: number;
        windgust: number;
        windspeed: number;
        winddir: number;
        pressure: number;
        visibility: number;
        cloudcover: number;
        solarradiation: number;
        solarenergy: number;
        uvindex: number;
        conditions: string;
        icon: string;
        stations: string[];
        source: string;
        sunrise: string;
        sunriseEpoch: number;
        sunset: string;
        sunsetEpoch: number;
        moonphase: string;
    };
}

/**
 * Retrieves the weather information from the API and extracts the relevant information
 * @param city - the city to get the weather for
 * @param apiKey - the visual crossing API key the user has set in their settings
 * @returns weather information
 */
export default (city: string, apiKey: string): Promise<WeatherResponse> => {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&lang=id&iconSet=icons2&include=current&key=${apiKey}&contentType=json`;
    return cachedRequest(
        url,
        FIVE_MINUTES,
        'json',
        ({ currentConditions: weather }: VisualCrossingResponse) => {
            return {
                condition: codeToCondition('visualCrossing', weather.icon),
                temperature: { actual: weather.temp, feel: weather.feelslike },
                wind: { direction: weather.winddir, speed: weather.windspeed },
                visibility: weather.visibility,
                humidity: weather.humidity / 100,
                pressure: weather.pressure,
                cloudCover: weather.cloudcover / 100,
                precipitation: weather.precip,
                meta: {
                    providerURL: `https://visualcrossing.com`,
                    requestURL: url,
                    time: new Date(weather.datetimeEpoch * 1000).toISOString(),
                },
            } satisfies Weather;
        }
    );
};
