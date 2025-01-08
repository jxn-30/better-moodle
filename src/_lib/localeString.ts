import { BETTER_MOODLE_LANG } from 'i18n';

/**
 * Returns the localized string representation of a date
 * @param date - the date to localize
 * @param year - wether to show the year
 * @param weekday - wether to show the weekday
 * @param lang - enforce a special language instead of BETTER_MOODLE_LANG
 * @returns the day as a localized string
 */
export const dateToString = (
    date: Date,
    year = true,
    weekday = false,
    lang: Intl.LocalesArgument = BETTER_MOODLE_LANG
) =>
    date.toLocaleString(lang, {
        weekday: weekday ? 'long' : undefined,
        year: year ? 'numeric' : undefined,
        month: '2-digit',
        day: '2-digit',
    });

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
) =>
    num.toLocaleString(lang, {
        style: 'unit',
        unit,
        unitDisplay: format,
    });

/**
 * @param num
 * @param currency
 * @param format
 * @param lang
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
