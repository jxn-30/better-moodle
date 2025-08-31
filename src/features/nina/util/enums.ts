import { LLFG } from 'i18n';
import { LocalizedString } from 'typesafe-i18n';
import { getProviderCategory, providerType } from './utils';

// Capitalisation and meaning as defined in https://docs.oasis-open.org/emergency/cap/v1.2/CAP-v1.2.pdf
// XML Schema: https://docs.oasis-open.org/emergency/cap/v1.2/CAP-v1.2.xsd

export const enum SEVERITY {
    UNKNOWN = 'Unknown',
    MINOR = 'Minor',
    MODERATE = 'Moderate',
    SEVERE = 'Severe',
    EXTREME = 'Extreme',
}

export const enum URGENCY {
    UNKNOWN = 'Unknown',
    PAST = 'Past',
    FUTURE = 'Future',
    EXPECTED = 'Expected',
    IMMEDIATE = 'Immediate',
}

export const enum CERTAINTY {
    UNKNOWN = 'Unknown',
    UNLIKELY = 'Unlikely',
    POSSIBLE = 'Possible',
    LIKELY = 'Likely',
    OBSERVED = 'Observed',
}

export const enum MESSAGE_TYPE {
    ACK = 'Ack',
    ALERT = 'Alert',
    CANCEL = 'Cancel',
    ERROR = 'Error',
    UPDATE = 'Update',
}

export const enum CATEGORY {
    GEO = 'Geo',
    MET = 'Met',
    SAFETY = 'Safety',
    SECURITY = 'Security',
    RESCUE = 'Rescue',
    FIRE = 'Fire',
    HEALTH = 'Health',
    ENV = 'Env',
    TRANSPORT = 'Transport',
    INFRA = 'Infra',
    CBRNE = 'CBRNE',
    OTHER = 'Other',
}

export const enum STATUS {
    ACTUAL = 'Actual',
    EXERCISE = 'Exercise',
    SYSTEM = 'System',
    TEST = 'Test',
    DRAFT = 'Draft',
}

export const enum SCOPE {
    PUBLIC = 'Public',
    RESTRICTED = 'Restricted',
    PRIVATE = 'Private',
}

export const enum RESPONSE_TYPE {
    SHELTER = 'Shelter',
    EVACUATE = 'Evacuate',
    PREPARE = 'Prepare',
    EXECUTE = 'Execute',
    AVOID = 'Avoid',
    MONITOR = 'Monitor',
    ASSESS = 'Assess',
    ALL_CLEAR = 'AllClear',
    NONE = 'None',
}

const LL = LLFG('nina');

/**
 * Get the label for a category.
 * @param category - The category to get the label for.
 * @returns The label for the category.
 */
export const getCategoryLabel = (category: CATEGORY): LocalizedString => {
    const lowercaseCategory: Lowercase<CATEGORY> =
        category.toLowerCase() as Lowercase<CATEGORY>;
    return LL.category[lowercaseCategory]();
};

/**
 * Gets the label for a severity level.
 * @param severity - The severity level.
 * @param provider - The provider prefix to determine the context of the severity.
 * @returns The label for the severity level.
 */
export const getSeverityLabel = (
    severity: SEVERITY,
    provider: providerType
): LocalizedString => {
    const lowercaseSeverity: Lowercase<SEVERITY> =
        severity.toLowerCase() as Lowercase<SEVERITY>;
    const providerCategory = getProviderCategory(provider);
    return LL.severity[providerCategory][lowercaseSeverity]();
};

/**
 * Returns a Emoji that represents a severity.
 * @param severity - The severity as returned from the API
 * @returns a matching Emoji
 */
export const getSeverityEmoji = (severity: SEVERITY) =>
    (
        ({
            [SEVERITY.UNKNOWN]: '🤷',
            [SEVERITY.MINOR]: '⚪',
            [SEVERITY.MODERATE]: '🟠',
            [SEVERITY.SEVERE]: '🔴',
            [SEVERITY.EXTREME]: '🟣',
        }) as const
    )[severity];

/**
 * Gets the numeric representation of a severity level.
 * @param severity - The severity level.
 * @returns The numeric representation of the severity level.
 */
export const severityToNumber = (severity: SEVERITY) =>
    [
        SEVERITY.UNKNOWN, // -1
        SEVERITY.MINOR, // 0
        SEVERITY.MODERATE, // 1
        SEVERITY.SEVERE, // 2
        SEVERITY.EXTREME, // 3
    ].indexOf(severity) - 1;
