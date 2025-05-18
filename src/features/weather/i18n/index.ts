import type { FeatureGroupTranslation } from '#/i18n';

export const de = {
    name: 'Wetter',
    description: '',
    settings: {
        'enabled': {
            name: 'Wetter anzeigen',
            description: 'Zeige das Wetter in Moodle an.',
        },
        'provider': {
            name: 'Anbieter',
            description: 'Wähle den Anbieter für die Wetterdaten aus.',
            options: {
                wttrIn: 'wttr.in',
                openMeteo: 'Open-Meteo',
                visualCrossing: 'Visual Crossing (API-Key benötigt)',
                openWeatherMap: 'OpenWeatherMap (API-Key benötigt)',
                pirateWeather: 'Pirate Weather (API-Key benötigt)',
            },
        },
        'api.openWeatherMap': {
            name: 'API-Key für OpenWeatherMap',
            description:
                'Trage hier deinen API-Key für OpenWeatherMap ein (der Free-Plan ist ausreichend).',
        },
        'api.pirateWeather': {
            name: 'API-Key für PirateWeather',
            description:
                'Trage hier deinen API-Key für PirateWeather ein (der Free-Plan ist ausreichend).',
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
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'Weather',
    description: '',
    settings: {
        'enabled': {
            name: 'Show weather',
            description: 'Show the weather in Moodle.',
        },
        'provider': {
            name: 'Provider',
            description: 'Choose the provider for the weather data.',
            options: {
                wttrIn: 'wttr.in',
                openMeteo: 'Open-Meteo',
                visualCrossing: 'Visual Crossing (requires API-Key)',
                openWeatherMap: 'OpenWeatherMap (requires API-Key)',
                pirateWeather: 'Pirate Weather (requires API-Key)',
            },
        },
        'api.openWeatherMap': {
            name: 'API-Key for OpenWeatherMap',
            description:
                'Put your API key for OpenWeatherMap here (the free plan is sufficient).',
        },
        'api.pirateWeather': {
            name: 'API-Key for PirateWeather',
            description:
                'Put your API key for PirateWeather here (the free plan is sufficient).',
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
} as typeof de;

export default { de, en };
