import { cachedRequest } from '@/network';
import { codeToCondition } from '../util/condition';
import { FIVE_MINUTES } from '@/times';
import { type Weather } from '../index';

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

/**
 * Retrieves the weather information from the API and extracts the relevant information
 * @param city - the city to get the weather for
 * @returns weather information
 */
export default (city: string): Promise<Weather> => {
    const url = `https://wttr.in/${city}?format=j1&lang`; // the &lang param is required to produce a valid response
    return cachedRequest(
        url,
        FIVE_MINUTES,
        'json',
        ({ current_condition: [weather] }: WttrInResponse) => {
            return {
                condition: codeToCondition(
                    'wttrIn',
                    Number(weather.weatherCode)
                ),
                temperature: {
                    actual: Number(weather.temp_C),
                    feel: Number(weather.FeelsLikeC),
                },
                wind: {
                    direction: Number(weather.winddirDegree),
                    speed: Number(weather.windspeedKmph),
                },
                visibility: Number(weather.visibility),
                humidity: Number(weather.humidity) / 100,
                pressure: Number(weather.pressure),
                cloudCover: Number(weather.cloudcover) / 100,
                precipitation: Number(weather.precipMM),
                meta: {
                    providerURL: `https://wttr.in/${city}`,
                    requestURL: url,
                    time: new Date(
                        `${weather.localObsDateTime.slice(0, 10)} ${weather.observation_time} +00:00`
                    ).toISOString(),
                },
            } satisfies Weather;
        }
    );
};
