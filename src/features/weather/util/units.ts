import { BETTER_MOODLE_LANG } from 'i18n';
import { numToString, unit } from '@/localeString';

const unitsMetric = {
    temperature: 'celsius',
    angle: 'degree',
    speed: 'kilometer-per-hour',
    distanceKm: 'kilometer',
    distanceMm: 'millimeter',
    pressure: 'hPa', // no supported unit
};

const unitsScientific = {
    temperature: 'kelvin',
    angle: 'radian',
    speed: 'meter-per-second',
    distanceKm: 'meter',
    distanceMm: 'meter',
    pressure: 'Pa', // no supported unit
} satisfies typeof unitsMetric;

const unitsImperial = {
    temperature: 'fahrenheit',
    angle: 'degree',
    speed: 'miles-per-hour',
    distanceKm: 'miles',
    distanceMm: 'inch',
    pressure: 'inHg',
} satisfies typeof unitsMetric;

const units = {
    metric: unitsMetric,
    scientific: unitsScientific,
    imperial: unitsImperial,
} as const;

const convertScientific = {
    /**
     * Converts a celsius temperature into a kelvin temperature
     * @param celsius - the celsius input
     * @return the kelvin value
     */
    temperature: (celsius: number) => celsius + 273.15,
    /**
     * Converts a degree into a radian
     * @param degree - the degree input
     * @return the radian value
     */
    angle: (degree: number) => (degree * Math.PI) / 180,
    /**
     * Converts a km/h value into a m/s value
     * @param kmh - the km/h input
     * @return the m/s value
     */
    speed: (kmh: number) => (kmh * 1000) / 3600,
    /**
     * @param km
     */
    distanceKm: (km: number) => km * 1000,
    /**
     * @param mm
     */
    distanceMm: (mm: number) => mm / 1000,
    /**
     * @param hPa
     */
    pressure: (hPa: number) => hPa * 100,
};

const convertImperial = {
    /**
     * @param celsius
     */
    temperature: (celsius: number) => (celsius * 9) / 5 + 32,
    /**
     * @param degree
     */
    angle: (degree: number) => degree,
    /**
     * @param kmh
     */
    speed: (kmh: number) => kmh / 1.609344,
    /**
     * @param km
     */
    distanceKm: (km: number) => km / 1.609344,
    /**
     * @param mm
     */
    distanceMm: (mm: number) => mm / 25.4,
    /**
     * @param hPa
     */
    pressure: (hPa: number) => hPa * 0.02952998751,
} satisfies typeof convertScientific;

const convert = {
    scientific: convertScientific,
    imperial: convertImperial,
} as const;

/**
 * @param metric
 * @param method
 * @param system
 */
export const stringify = (
    metric: number,
    method: keyof typeof convertScientific,
    system: 'metric' | 'scientific' | 'imperial'
) => {
    const converted =
        system === 'metric' ? metric : convert[system][method](metric);
    const unitStr = units[system][method];
    if (Intl.supportedValuesOf('unit').includes(unitStr)) {
        return unit(converted, unitStr);
    } else {
        const stringified = numToString(converted);
        if (BETTER_MOODLE_LANG === 'de') return `${stringified}\xa0${unitStr}`;
        return `${stringified}${unitStr}`;
    }
};
