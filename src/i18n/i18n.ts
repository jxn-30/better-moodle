import { loadAllLocales } from './i18n-util.sync';
import { STORAGE_V2_LANGUAGE_KEY } from '../migrateStorage';
import { i18nObject, loadedLocales, locales } from './i18n-util';
import { Locales, Translation } from './i18n-types';

loadAllLocales();

const MOODLE_LANG = document.documentElement.lang.toLowerCase() as Locales;
export const BETTER_MOODLE_LANG = (() => {
    const savedLanguage = GM_getValue<Locales | 'auto'>(
        STORAGE_V2_LANGUAGE_KEY,
        'auto'
    );
    if (savedLanguage === 'auto') return MOODLE_LANG;
    return savedLanguage;
})();

type I18nObject = ReturnType<typeof i18nObject>;

/**
 * A helper class that instantiates i18nObjects for languages when required.
 */
class LLMapClass extends Map<Locales, I18nObject> {
    /**
     * Gets a i18nObject for a language.
     * Creates the object if it does not exist yet.
     * @param key - the locale or 'auto' to use
     * @returns the i18nObject
     */
    get(key: Locales | 'auto'): I18nObject {
        if (key === 'auto') return this.get(BETTER_MOODLE_LANG);
        const object = super.get(key);
        if (object) return object;
        const newObject = i18nObject(key);
        this.set(key, newObject);
        return newObject;
    }
}

export const LLMap = new LLMapClass();

export const LL = LLMap.get('auto');

export const languages = new Map<Locales, Translation['language']>();
for (const locale of locales) {
    languages.set(locale, loadedLocales[locale].language);
}

/**
 * Checks if a given id is the id of a feature group
 * @param id - the id to check
 * @returns true if the id is the id of a feature group otherwise false
 */
export const isFeatureGroup = (
    id: string
): id is keyof Translation['features'] => id in LL.features;

/**
 * Turns a number into a string, localized to the current language
 * @param num - the number to localize
 * @returns the localized number
 */
export const stringify = (num: number) =>
    num.toLocaleString(BETTER_MOODLE_LANG);
