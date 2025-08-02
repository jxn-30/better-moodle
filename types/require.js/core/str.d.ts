// types found out by reading the moodle source code
// may be incomplete at some points

export interface StringRequest {
    key: string;
    component: string;
    param?: string | Record<string, unknown>;
    lang?: string;
}

export default interface CoreStr {
    get_string(
        this: void,
        key: string,
        component: string,
        param?: string | Record<string, unknown>,
        lang?: string
    ): JQuery.Promise<string>;
    get_strings(
        this: void,
        requests: StringRequest[]
    ): JQuery.Promise<string[]>;
    // Dang, these are Moodle 4.3+ methods. Can we somehow tell TypeScript that?
    getString(
        this: void,
        key: string,
        component: string,
        param?: string | Record<string, unknown>,
        lang?: string
    ): Promise<string>;
    // TODO: Request and Response need same length
    getStrings(this: void, requests: StringRequest[]): Promise<string[]>;
}
