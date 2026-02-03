// Type definitions for Temporal API polyfill
import '@js-temporal/polyfill';

declare global {
    const Temporal: typeof import('@js-temporal/polyfill').Temporal;
}

export {};
