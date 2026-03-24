import { STORAGE_V2_LANGUAGE_KEY } from '../migrateStorage';
import { type Locale, overwriteGetLocale } from './paraglide/runtime.js';

const HTML_LANG = document.documentElement.lang.toLowerCase();
const MOODLE_LANG = ({ en: 'en-gb' }[HTML_LANG] ?? HTML_LANG) as Locale;

export const BETTER_MOODLE_LANG = (() => {
    const savedLanguage = GM_getValue<Locale | 'auto'>(
        STORAGE_V2_LANGUAGE_KEY,
        'auto'
    );
    if (savedLanguage === 'auto') return MOODLE_LANG;
    return savedLanguage;
})();

overwriteGetLocale(() => BETTER_MOODLE_LANG);

export { m as LL } from './paraglide/messages.js';
