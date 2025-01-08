import { BETTER_MOODLE_LANG } from 'i18n';

/**
 * Returns the localized string representation of a date
 * @param date - the date to localize
 * @param year - wether to show the year
 * @param weekday - wether to show the weekday
 * @returns the day as a localized string
 */
export const dateToString = (date: Date, year = true, weekday = false) =>
    date.toLocaleString(BETTER_MOODLE_LANG, {
        weekday: weekday ? 'long' : undefined,
        year: year ? 'numeric' : undefined,
        month: '2-digit',
        day: '2-digit',
    });
