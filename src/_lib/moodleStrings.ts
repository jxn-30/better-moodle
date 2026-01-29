import { requirePromise } from './require.js';
import type { StringRequest } from '#types/require.js/core/str.d.ts';

/**
 * Calls the correct method for fetching a string from moodle translations.
 * @param key - the string key
 * @param component - the component to search for the key
 * @param param - any params that should be used if the translation requires params
 * @param lang - the language to fetch the string in
 * @returns a promise that resolves to the requested translation
 */
export const getString = (
    key: string,
    component: string,
    param?: string | Record<string, unknown>,
    lang?: string
) =>
    __MOODLE_VERSION__ >= 403 ?
        requirePromise(['core/str'] as const).then(([{ getString }]) =>
            getString(key, component, param, lang)
        )
    :   new Promise<string>(
            resolve =>
                void requirePromise(['core/str'] as const).then(
                    ([{ get_string }]) =>
                        get_string(key, component, param, lang).then(resolve)
                )
        );

/**
 * Calls the correct method for fetching multiple strings from moodle translations
 * @param reqs - an array of string requests
 * @returns a promise that resolves to the requested translations
 */
export const getStrings = (reqs: StringRequest[]) =>
    __MOODLE_VERSION__ >= 403 ?
        requirePromise(['core/str'] as const).then(([{ getStrings }]) =>
            getStrings(reqs)
        )
    :   new Promise<string[]>(
            resolve =>
                void requirePromise(['core/str'] as const).then(
                    ([{ get_strings }]) => get_strings(reqs).then(resolve)
                )
        );
