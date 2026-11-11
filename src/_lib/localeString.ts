import { BETTER_MOODLE_LANG } from '#i18n';
import { getToday } from '#lib/temporal';

/**
 * Returns a DateTimeFormatOptions for a date
 * @param root0 - the format options
 * @param root0.weekday - wether to print the weekday
 * @param root0.year - wether to print the year
 * @returns the DateTimeFormatOptions
 */
const dateFormat = ({ weekday, year }: { weekday: boolean; year: boolean }) =>
    ({
        weekday: weekday ? 'long' : undefined,
        year: year ? 'numeric' : undefined,
        month: '2-digit',
        day: '2-digit',
    }) as const;

/**
 * Returns a DateTimeFormatOptions for a time
 * @param seconds - wether to print the seconds
 * @returns the DateTimeFormatOptions
 */
const timeFormat = (seconds: boolean) =>
    ({
        hour: '2-digit',
        minute: '2-digit',
        second: seconds ? '2-digit' : undefined,
    }) as const;

type DateWithOptionalTime = Date | Temporal.PlainDate | Temporal.PlainDateTime;
type DateWithOptionalDate = Date | Temporal.PlainTime | Temporal.PlainDateTime;
type DateTime = Date | Temporal.PlainDateTime;

/**
 * Returns the localized string representation of a date
 * @param date - the date to localize
 * @param year - wether to show the year
 * @param weekday - wether to show the weekday
 * @param lang - enforce a special language instead of BETTER_MOODLE_LANG
 * @returns the day as a localized string
 */
export const dateToString = (
    date: DateWithOptionalTime = getToday(),
    year = true,
    weekday = false,
    lang: Intl.LocalesArgument = BETTER_MOODLE_LANG
) => new Intl.DateTimeFormat(lang, dateFormat({ year, weekday })).format(date);

/**
 * Returns the localized string representation of a time
 * @param date - the date to localize
 * @param seconds - wether to show seconds
 * @param lang - enforce a special language instead of BETTER_MOODLE_LANG
 * @returns the time as a localized string
 */
export const timeToString = (
    date: DateWithOptionalDate,
    seconds = true,
    lang: Intl.LocalesArgument = BETTER_MOODLE_LANG
) => new Intl.DateTimeFormat(lang, timeFormat(seconds)).format(date);

/**
 * Returns the localized string representation of a datetime
 * @param date - the date to localize
 * @param year - wether to show the year
 * @param weekday - wether to show the weekday
 * @param seconds - wether to show seconds
 * @param lang - enforce a special language instead of BETTER_MOODLE_LANG
 * @returns the datetime as a localized string
 */
export const datetimeToString = (
    date: DateTime,
    year = true,
    weekday = true,
    seconds = false,
    lang: Intl.LocalesArgument = BETTER_MOODLE_LANG
) =>
    new Intl.DateTimeFormat(lang, {
        ...dateFormat({ year, weekday }),
        ...timeFormat(seconds),
    }).format(date);

/**
 * Turns a number into a localized string
 * @param num - the number to be localized
 * @param options - localization options
 * @param lang - enforce a special language instead of BETTER_MOODLE_LANG
 * @returns the localized number
 */
export const numToString = (
    num: number,
    options: Partial<
        Pick<Intl.NumberFormatOptions, 'maximumSignificantDigits'>
    > = {},
    lang: Intl.LocalesArgument = BETTER_MOODLE_LANG
) => num.toLocaleString(lang, options);

/**
 * Prints a number localized with a given unit
 * @param num - the number to be localized
 * @param unit - the unit to use
 * @param format - display format of the unit
 * @param lang - enforce a special language instead of BETTER_MOODLE_LANG
 * @returns the localized number with unit
 */
export const unit = (
    num: number,
    unit: Intl.NumberFormatOptions['unit'],
    format: Intl.NumberFormatOptions['unitDisplay'] = 'short',
    lang: Intl.LocalesArgument = BETTER_MOODLE_LANG
) => num.toLocaleString(lang, { style: 'unit', unit, unitDisplay: format });

/**
 * Prints a number localized to a given currency
 * @param num - the number to be localized
 * @param currency - the currency to use
 * @param format - display format of the currency
 * @param lang - enforce a special language instead of BETTER_MOODLE_LANG
 * @returns the localized number with currency
 */
export const currency = (
    num: number,
    currency: Intl.NumberFormatOptions['currency'] = 'EUR',
    format: Intl.NumberFormatOptions['currencyDisplay'] = 'symbol',
    lang: Intl.LocalesArgument = BETTER_MOODLE_LANG
) =>
    num.toLocaleString(lang, {
        style: 'currency',
        currency,
        currencyDisplay: format,
    });

/**
 * Prints a number localized as a percentage
 * @param num - the number to be localized
 * @param digits - the maximum amount of fraction digits
 * @param lang - enforce a special language instead of BETTER_MOODLE_LANG
 * @returns the localized number as percentage
 */
export const percent = (
    num: number,
    digits = 2,
    lang: Intl.LocalesArgument = BETTER_MOODLE_LANG
) =>
    num.toLocaleString(lang, {
        style: 'percent',
        maximumFractionDigits: digits,
    });

/**
 * Capitalizes the first letter of each word.
 * @param str - the string to capitalize
 * @param lang - enforce a special language instead of BETTER_MOODLE_LANG
 * @returns the capitalized string
 */
export const capitalize = (
    str: string,
    lang: Intl.LocalesArgument = BETTER_MOODLE_LANG
) => str.replace(/(?<=^|\s)\S/g, $1 => $1.toLocaleUpperCase(lang));
