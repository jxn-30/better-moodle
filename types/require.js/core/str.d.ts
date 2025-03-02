// types found out by reading the moodle source code
// may be incomplete at some points

interface StringRequest {
    key: string;
    component: string;
    param?: string | Record<string, unknown>;
    lang?: string;
}

export default interface CoreStr {
    get_string(
        key: string,
        component: string,
        param?: string | Record<string, unknown>,
        lang?: string
    ): JQuery.Promise<string>;
    get_strings(requests: StringRequest[]): JQuery.Promise<string[]>;
    // Dang, these are Moodle 4.3+ methods
    // getString(
    //     key: string,
    //     component: string,
    //     param?: string | Record<string, unknown>,
    //     lang?: string
    // ): Promise<string>;
    // // TODO: Request and Response need same length
    // getStrings(requests: StringRequest[]): Promise<string[]>;
}
