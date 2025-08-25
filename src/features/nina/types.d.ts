import type { CATEGORY, CERTAINTY, MESSAGE_TYPE, RESPONSE_TYPE, SCOPE, SEVERITY, STATUS, URGENCY } from './util/enums';

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


// See https://docs.oasis-open.org/emergency/cap/v1.2/CAP-v1.2-os.html#_Toc454352650
interface Alert {
    identifier: string;
    sender: string;
    sent: ReturnType<(typeof Date)['toISOString']>;
    status: STATUS;
    msgType: MESSAGE_TYPE;
    source?: string;
    scope: SCOPE;
    restriction?: string;
    addresses?: string;
    code?: string[];
    note?: string;
    references?: string; // sender,identifier,sent sender,identifier,sent ...
    incidents?: string;
    info?: Info[];
}

interface Info {
    language?: string;
    category: CATEGORY[];
    event: string;
    responseType?: RESPONSE_TYPE[];
    urgency: URGENCY;
    severity: SEVERITY;
    certainty: CERTAINTY;
    audience?: string;
    eventCode?: { valueName: string; value: string }[];
    effective?: ReturnType<(typeof Date)['toISOString']>;
    onset?: ReturnType<(typeof Date)['toISOString']>;
    expires?: ReturnType<(typeof Date)['toISOString']>;
    senderName?: string;
    headline?: string;
    description?: string;
    instruction?: string;
    web?: string;
    contact?: string;
    parameter?: { valueName: string; value: string }[];
    resource?: Resource[];
    area?: Area[];
}

interface Resource {
    resourceDesc: string;
    mimeType: string;
    size?: number;
    uri?: string;
    derefUri?: string;
    digest?: string;
}

interface Area {
    areaDesc: string;
    polygon?: string[]; // lat,lon lat,lon ...
    circle?: string[]; // lat,lon radius
    geocode?: { valueName: string; value: string }[];
    altitude?: number;
    ceiling?: number;
}

export type Warnings = WarningSummary[];
