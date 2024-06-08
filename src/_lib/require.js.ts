import { ready } from './DOM';

export const require: typeof requirejs = (...args) =>
    ready(() => requirejs(...args));
