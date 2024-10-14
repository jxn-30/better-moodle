// types found out by reading the moodle source code
// may be incomplete at some points

interface StringRequest {
    key: string;
    component: string;
    param?: string | Record<string, unknown>;
    lang?: string;
}

export default interface CoreStr {
    getString(
        key: string,
        component: string,
        param?: string | Record<string, unknown>,
        lang?: string
    ): Promise<string[]>;
    getStrings(requests: StringRequest[]): Promise<string[]>;
}
