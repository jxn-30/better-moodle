import 'vitest';

interface CustomMatchers<R = unknown> {
    toStartWith: (prefix: string) => R;
    toEndWith: (suffix: string) => R;
    toBeAValidURL: () => R;
    toBeABoolean: () => R;
}

declare module 'vitest' {
    // stole these from https://vitest.dev/guide/extending-matchers.html so no motivation to change them to make ESLint happy
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
    interface Assertion<T = any> extends CustomMatchers<T> {}
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface AsymmetricMatchersContaining extends CustomMatchers {}

    export interface ProvidedContext {
        userscriptFile: string;
    }
}
