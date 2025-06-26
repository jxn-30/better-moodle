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
