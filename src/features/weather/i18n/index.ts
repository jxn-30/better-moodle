import { i18n as conditions } from '../util/condition';
import type { FeatureGroupTranslation } from '#/i18n';

export const de = {
    name: 'Wetter',
    description: '',
    apiKeyRequired: 'API-Key benötigt',
    apiKeyWarning:
        'Bitte hinterlege in den Einstellungen von Better-Moodle einen gültigen API-Key für {provider}. Ein API-Key für den kostenlosen Free-Plan reicht aus.',
    providers: {
        wttrIn: 'wttr.in',
        openMeteo: 'Open-Meteo',
        visualCrossing: 'Visual Crossing',
        openWeatherMap: 'OpenWeatherMap',
    },
    fetchError:
        'Es kam zu einem Fehler beim Aktualisieren der Wetter-Daten. Bitte überprüfe (falls nötig) deinen API-Key oder versuche einen anderen Anbieter.',
    settings: {
        'enabled': {
            name: 'Wetter anzeigen',
            description: 'Zeige das Wetter in Moodle an.',
        },
        'provider': {
            name: 'Anbieter',
            description: 'Wähle den Anbieter für die Wetterdaten aus.',
        },
        'api.openWeatherMap': {
            name: 'API-Key für OpenWeatherMap',
            description:
                'Trage hier deinen API-Key für OpenWeatherMap ein (der Free-Plan ist ausreichend).',
        },
        'api.visualCrossing': {
            name: 'API-Key für Visual Crossing',
            description:
                'Trage hier deinen API-Key für Visual Crossing ein (der Free-Plan ist ausreichend).',
        },
        'units': {
            name: 'Einheiten',
            description: 'Wähle die Einheiten für die Wetterdaten aus.',
            options: {
                metric: 'Metrisch (°C, km/h, km, mm)',
                scientific: 'SI Einheiten (K, m/s, m, m)',
                imperial: 'Imperial (°F, mph, mi, in)', // for weird people
            },
        },
        'tempInNav': {
            name: 'Temperatur in der Navigationsleiste anzeigen',
            description:
                'Zeige die aktuelle Temperatur in der Navigationsleiste an.',
        },
        'feelLikeTempInNav': {
            name: 'Gefühlte Temperatur nutzen',
            description:
                'Ermöglicht das Umschalten zwischen der tatsächlichen Temperatur und der gefühlten  Temperatur.',
        },
    },
    conditions: conditions.de,
    modal: {
        title: 'Wetter-Moodle für {city:string}',
        source: 'Quelle',
        raw: 'Rohdaten',
        condition: 'Aktuelles Wetter',
        temperature: 'Temperatur',
        temperatureFeelsLike: 'gefühlt',
        wind: 'Wind',
        windDirection: 'Richtung',
        visibility: 'Sichtweite',
        humidity: 'Luftfeuchtigkeit',
        pressure: 'Luftdruck',
        cloudCover: 'Bewölkung',
        precipitation: 'Niederschlagsmenge',
    },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'Weather',
    description: '',
    apiKeyRequired: 'API-Key required',
    apiKeyWarning:
        'Please enter a valid API key for {provider} in the Better-Moodle settings. An API key for the free plan is sufficient.',
    providers: {
        wttrIn: 'wttr.in',
        openMeteo: 'Open-Meteo',
        visualCrossing: 'Visual Crossing',
        openWeatherMap: 'OpenWeatherMap',
    },
    fetchError:
        'There was an error updating the weather data. Please check your API key (if necessary) or try another provider.',
    settings: {
        'enabled': {
            name: 'Show weather',
            description: 'Show the weather in Moodle.',
        },
        'provider': {
            name: 'Provider',
            description: 'Choose the provider for the weather data.',
        },
        'api.openWeatherMap': {
            name: 'API-Key for OpenWeatherMap',
            description:
                'Put your API key for OpenWeatherMap here (the free plan is sufficient).',
        },
        'api.visualCrossing': {
            name: 'API-Key for Visual Crossing',
            description:
                'Put your API key for Visual Crossing here (the free plan is sufficient).',
        },
        'units': {
            name: 'Units',
            description: 'Select the units for the weather data.',
            options: {
                metric: 'Metric (°C, km/h, km, mm)',
                scientific: 'SI Units (K, m/s, m, m)',
                imperial: 'Imperial (°F, mph, mi, in)', // for weird people
            },
        },
        'tempInNav': {
            name: 'Show temperature in the navigation bar',
            description: 'Show the current temperature in the navigation bar.',
        },
        'feelLikeTempInNav': {
            name: "Use 'feels like' temperature",
            description:
                "Allows you to switch between the actual temperature and the 'feels like' temperature.",
        },
    },
    conditions: conditions.en,
    modal: {
        title: 'Weather-Moodle for {city:string}',
        source: 'Source',
        raw: 'Raw data',
        condition: 'Current weather',
        temperature: 'Temperature',
        temperatureFeelsLike: 'felt',
        wind: 'Wind',
        windDirection: 'Direction',
        visibility: 'Visibility',
        humidity: 'Humidity',
        pressure: 'Pressure',
        cloudCover: 'Cloud cover',
        precipitation: 'Precipitation',
    },
} as typeof de;

export default { de, en };
