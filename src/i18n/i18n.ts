import { getSettingKey } from '../_lib/helpers';
import { loadAllLocales } from './i18n-util.sync';
import { i18nObject, loadedLocales, locales } from './i18n-util';
import { Locales, Translation } from './i18n-types';

loadAllLocales();

const MOODLE_LANG = document.documentElement.lang.toLowerCase() as Locales;
const BETTER_MOODLE_LANG = (() => {
    const savedLanguage = GM_getValue<Locales | 'auto'>(
        getSettingKey('general.language'),
        'auto'
    );
    if (savedLanguage === 'auto') return MOODLE_LANG;
    return savedLanguage;
})();

export const LL = i18nObject(BETTER_MOODLE_LANG);

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
