import { capitalize } from '@/localeString';
import type { FormattersInitializer } from 'typesafe-i18n';
import { LLMap } from 'i18n';
import type { Formatters, Locales } from './i18n-types';

/**
 * Initialize the formatters for the i18n library.
 * @param locale - the locale these formatters use
 * @returns the formatters object
 */
export const initFormatters: FormattersInitializer<
    Locales,
    Formatters
    // Note: A locale can be passed here if needed
> = (locale: Locales) => {
    /**
     * Gets i18nObject for this locale
     * @returns the i18nObject for this locale
     */
    const LL = () => LLMap.get(locale);
    /**
     * Gets the number translations in this language
     * Needs to be a function as otherwise, LLMap would not be initialized yet
     * @returns the number translations for this locale
     */
    const numberTranslations = () => LL().numbers;

    const formatters: Formatters = {
        /**
         * Capitalizes the first letter of each word.
         * @param str - the string to capitalize
         * @returns the capitalized string
         */
        capitalize: str => capitalize(str.toString(), locale),
        /**
         * Removes a trailing 's' from a string
         * @param str - the string to remove the 's' from
         * @returns the string without trailing 's'
         */
        removeTrailingS: str => str.toString().replace(/s$/, ''),
        /**
         * Gets the spoken representation of a number
         * @param num - the number to get the spoken representation of
         * @returns the spoken representation of the number
         */
        spell: num => {
            const numI18n = numberTranslations();
            const key = num.toString() as keyof typeof numI18n;
            return key in numI18n ? numI18n[key]() : key;
        },
        /**
         * Increases a number by one
         * @param num - the basis number
         * @returns num + 1
         */
        plus1: num => num + 1,
        /**
         * Calculates mod12 on a number and returns 12 if result would be 0
         * @param num - the base number
         * @returns num mod 12 or 12 if num mod 12 is 0
         */
        mod12Or12: num => num % 12 || 12,
    };

    return formatters;
};
