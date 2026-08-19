import { BETTER_MOODLE_LANG } from '#i18n';

// stubbing the paraglide runtime
/**
 * Get's the current locale
 * @returns current locale
 */
export const getLocale = () => BETTER_MOODLE_LANG;
export const experimentalStaticLocale = undefined;

// now export all the messages for usage in features
export { m as LL } from './paraglide/messages.js';
