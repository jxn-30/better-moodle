import { getSettingKey } from '../_lib/helpers';
import { i18nObject } from './i18n-util';
import { loadAllLocales } from './i18n-util.sync';
import { Locales } from './i18n-types';

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
