import { cachedRequest } from '@/network';
import { FIVE_MINUTES } from '@/times';
import { type Weather } from '../index';
import { WeatherCode } from '../util/codes';

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
 * @param city
 */
export default (city: string): Promise<Weather> =>
    cachedRequest(
        `https://wttr.in/${city}?format=j1&lang`, // the &lang param is required to produce a valid response
        FIVE_MINUTES,
        'json',
        ({ current_condition: [weather] }: WttrInResponse) => {
            return {
                code: WeatherCode.UNKNOWN, // TODO
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
                time: new Date(), // TODO
            } satisfies Weather;
        }
    );
