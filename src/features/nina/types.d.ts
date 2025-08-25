import type { MESSAGE_TYPE, SEVERITY, URGENCY } from './util/enums';

// found this by carefully reading https://docs.oasis-open.org/emergency/cap/v1.2/CAP-v1.2.xsd and actual API responses
interface WarningSummary<ID extends string = string> {
    id: ID;
    payload: {
        version: number;
        type: Uppercase<MESSAGE_TYPE>;
        id: ID;
        hash: string;
        data: {
            headline: string;
            provider: string;
            severity: SEVERITY;
            urgency: URGENCY;
            msgType: MESSAGE_TYPE;
            transKeys: { event: string };
            area: { type: string; data: string };
            valid: boolean;
        };
    };
    i18nTitle: Record<string, string>;
    sent: ReturnType<(typeof Date)['toISOString']>;
}

export type Warnings = WarningSummary[];
