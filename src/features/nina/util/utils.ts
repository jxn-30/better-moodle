import { Alert, AlertReferences, Info } from '../types';
import { BETTER_MOODLE_LANG, LLFG } from 'i18n';

const LL = LLFG('nina');

/**
 * Converts the administrative region key (ARS) to a county-level key.
 * @param ars - The administrative region key.
 * @returns The county-level key.
 */
export const arsToCountyLevel = (ars: string) =>
    `${ars.substring(0, 5)}0000000`;

export type providerType = 'mow' | 'kat' | 'biw' | 'pol' | 'dwd' | 'lhp';
export type providerCategoryType =
    | 'civilProtection'
    | 'police'
    | 'weather'
    | 'flood';
/**
 * Get the provider ID from the alert ID.
 * @param alertId - The alert ID to extract the provider ID from.
 * @returns The provider ID as a lowercase string.
 */
export const providerById = (alertId: string): providerType => {
    return alertId.substring(0, 3).toLowerCase() as providerType;
};

/**
 * Get the label for a provider.
 * @param provider - The provider ID.
 * @returns The label for the provider.
 */
export const getProviderLabel = (provider: providerType): string => {
    return LL.provider[provider]();
};

/**
 * Gets the category for a provider.
 * @param provider - The provider ID.
 * @returns The category for the provider.
 */
export const getProviderCategory = (
    provider: providerType
): providerCategoryType => {
    switch (provider) {
        case 'mow':
        case 'kat':
        case 'biw':
            return 'civilProtection';
        case 'pol':
            return 'police';
        case 'dwd':
            return 'weather';
        case 'lhp':
            return 'flood';
    }
};

const providerIconEndpoint = 'https://nina.api.proxy.bund.dev/assets/icons/';

/**
 * Gets the icon URL for a provider.
 * @param provider - The provider.
 * @param canceling - Whether the alert is a CANCEL alert.
 * @returns The icon URL for the provider.
 */
export const getProviderIcon = (provider: providerType, canceling = false) =>
    `${providerIconEndpoint}${(() => {
        switch (getProviderCategory(provider)) {
            case 'civilProtection':
                return !canceling ? 'report_mowas' : 'report_mowas_all_clear';
            case 'police':
                return !canceling ? 'polizei_rund' : 'report_polizei_all_clear';
            case 'weather':
                return 'report_unwetterwarnung';
            case 'flood':
                return 'report_hochwasser';
        }
    })()}.svg`;

/**
 * Gets an attribute from the alert info with language fallback (current language, then language prefix, then first available)
 * @param alert - The alert object
 * @param attribute - The attribute to retrieve
 * @returns The attribute value or null if not found
 */
export const getAlertInfoAttribute = <K extends keyof Info>(
    alert: Alert,
    attribute: K
): NonNullable<Info[K]> | null => {
    let hierarchy = 0;
    let relevantInfo: Info | null = null;
    void alert.info?.some(info => {
        if (!info[attribute]) {
            return false; // This acts as a continue;
        }

        const lang = (info.language ?? 'en-US').toLowerCase();
        if (hierarchy < 1 && relevantInfo === null) {
            relevantInfo = info;
            hierarchy++;
        }
        if (
            hierarchy < 2 &&
            lang.substring(0, 2) ===
                BETTER_MOODLE_LANG.substring(0, 2).toLowerCase()
        ) {
            relevantInfo = info;
            hierarchy++;
        }
        if (hierarchy < 3 && lang === BETTER_MOODLE_LANG.toLowerCase()) {
            relevantInfo = info;
            hierarchy++;
            return true; // This acts as a break;
        }
        return false; // This acts as a continue;
    });
    return relevantInfo?.[attribute] ?? null;
};

/**
 * Searches for a parameter by name in an array of parameters.
 * @param parameters - The array of parameters to search.
 * @param parameterName - The name of the parameter to find.
 * @returns The value of the parameter if found, otherwise null.
 */
const searchForAlertInfoParameter = (
    parameters: { valueName: string; value: string }[],
    parameterName: string
): string | null => {
    return (
        parameters.find(param => param.valueName === parameterName)?.value ??
        null
    );
};

/**
 * Gets a parameter value from the alert.
 * @param alert - The alert object.
 * @param parameterName - The name of the parameter to retrieve.
 * @returns The parameter value or null if not found.
 */
export const getAlertInfoParameter = (
    alert: Alert,
    parameterName: string
): string | null => {
    let hierarchy = 0;
    let relevantValue: string | null = null;

    void alert.info?.some(info => {
        const parameter = searchForAlertInfoParameter(
            info.parameter ?? [],
            parameterName
        );
        if (!parameter) {
            return false; // This acts as a continue;
        }

        const lang = (info.language ?? 'en-US').toLowerCase();
        if (hierarchy < 1 && relevantValue === null) {
            relevantValue = parameter;
            hierarchy++;
        }
        if (
            hierarchy < 2 &&
            lang.substring(0, 2) ===
                BETTER_MOODLE_LANG.substring(0, 2).toLowerCase()
        ) {
            relevantValue = parameter;
            hierarchy++;
        }
        if (hierarchy < 3 && lang === BETTER_MOODLE_LANG.toLowerCase()) {
            relevantValue = parameter;
            hierarchy++;
            return true; // This acts as a break;
        }
        return false; // This acts as a continue;
    });

    return relevantValue;
};

/**
 * Gets the title of the alert.
 * @param alert - The alert object.
 * @returns The title of the alert.
 */
export const getAlertTitle = (alert: Alert) => {
    return (
        getAlertInfoAttribute(alert, 'headline') ??
        getAlertInfoAttribute(alert, 'event') ??
        '' // TODO: what to return in this case???
    );
};

/**
 * Gets the references for the alert.
 * @param alert - The alert object.
 * @returns The references for the alert.
 */
export const getAlertReferences = (alert: Alert): AlertReferences[] =>
    alert.references
        ?.split(' ')
        .map(ref => ref.split(','))
        .map(ref => ({ sender: ref[0], alertId: ref[1], sent: ref[2] })) ?? [];
