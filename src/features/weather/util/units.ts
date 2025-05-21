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
    pressure: 'inHg', // no supported unit
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
     * @returns the kelvin value
     */
    temperature: (celsius: number) => celsius + 273.15,
    /**
     * Converts a degree into a radian
     * @param degree - the degree input
     * @returns the radian value
     */
    angle: (degree: number) => (degree * Math.PI) / 180,
    /**
     * Converts a km/h value into a m/s value
     * @param kmh - the km/h input
     * @returns the m/s value
     */
    speed: (kmh: number) => (kmh * 1000) / 3600,
    /**
     * Converts a km value into a m value
     * @param km - the km input
     * @returns the m value
     */
    distanceKm: (km: number) => km * 1000,
    /**
     * Converts a mm value into a m value
     * @param mm - the mm input
     * @returns the m value
     */
    distanceMm: (mm: number) => mm / 1000,
    /**
     * Converts a hPa value into a Pa value
     * @param hPa - the hPa input
     * @returns the Pa value
     */
    pressure: (hPa: number) => hPa * 100,
};

const convertImperial = {
    /**
     * Converts a celsius temperature into a fahrenheit temperature
     * @param celsius - the celsius input
     * @returns the fahrenheit value
     */
    temperature: (celsius: number) => (celsius * 9) / 5 + 32,
    /**
     * Returns a degree
     * @param degree - the degree input
     * @returns the degree itself
     */
    angle: (degree: number) => degree,
    /**
     * Converts a km/h value into a mph value
     * @param kmh - the km/h input
     * @returns the mph value
     */
    speed: (kmh: number) => kmh / 1.609344,
    /**
     * Converts a km value into a miles value
     * @param km - the km input
     * @returns the miles value
     */
    distanceKm: (km: number) => km / 1.609344,
    /**
     * Converts a mm value into an inches value
     * @param mm - the mm input
     * @returns the inches value
     */
    distanceMm: (mm: number) => mm / 25.4,
    /**
     * Converts a hPa value into a inHg value
     * @param hPa - the hPa input
     * @returns the inHg value
     */
    pressure: (hPa: number) => hPa * 0.02952998751,
} satisfies typeof convertScientific;

const convert = {
    scientific: convertScientific,
    imperial: convertImperial,
} as const;

const validUnits = Intl.supportedValuesOf('unit');
const validUnitRegex = new RegExp(
    `^(${validUnits.join('|')})(-per-(${validUnits.join('|')}))?$`
);

/**
 * Stringifies a number with a given unit according to locale specifications.
 * Converts to another system if required
 * @param metric - the number in metric units
 * @param method - the conversion method and unit specification
 * @param system - the system the number should be converted to
 * @returns a converted, stringified and localized number with unit
 */
export const stringify = (
    metric: number,
    method: keyof typeof convertScientific,
    system: 'metric' | 'scientific' | 'imperial'
) => {
    const converted =
        system === 'metric' ? metric : convert[system][method](metric);
    const unitStr = units[system][method];
    if (validUnitRegex.test(unitStr)) {
        return unit(converted, unitStr);
    } else {
        const stringified = numToString(converted);
        if (BETTER_MOODLE_LANG === 'de') return `${stringified}\xa0${unitStr}`;
        return `${stringified}${unitStr}`;
    }
};
