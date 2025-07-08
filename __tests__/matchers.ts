import { expect } from 'vitest';

/**
 * Expects a string to start with a given parameter
 * @param actual - the string to check if it starts with {@link prefix}
 * @param prefix - the string to check if {@link actual} starts with
 * @returns the except result
 * @throws if {@link actual} is not a string
 */
const toStartWith = (actual: unknown, prefix: string) => {
    if (typeof actual !== 'string') {
        throw new Error('Actual value must be a string');
    }
    return {
        pass: actual.startsWith(prefix),
        // eslint-disable-next-line jsdoc/require-jsdoc
        message: () =>
            `Expected the string ${JSON.stringify(actual)} to start with the string ${JSON.stringify(prefix)}.`,
    };
};

/**
 * Expects a thing to be a string of a valid URL
 * @param actual - the thing to test if it is a string of a valid URL
 * @returns the except result
 * @throws if {@link actual} is not a string
 */
const toBeAValidURL = (actual: unknown) => {
    if (typeof actual !== 'string') {
        throw new Error('Actual value must be a string');
    }
    try {
        new URL(actual);
        return {
            pass: true,
            // eslint-disable-next-line jsdoc/require-jsdoc
            message: () => '',
        };
    } catch {
        return {
            pass: false,
            // eslint-disable-next-line jsdoc/require-jsdoc
            message: () =>
                `Expected the string ${JSON.stringify(actual)} to be a valid URL.`,
        };
    }
};

/**
 * Expects a thing to be a boolean
 * @param actual - the thing to test for if it is a boolean
 * @returns the except result
 */
const toBeABoolean = (actual: unknown) => ({
    pass: typeof actual === 'boolean',
    // eslint-disable-next-line jsdoc/require-jsdoc
    message: () => `Expected a boolean but received a ${typeof actual}.`,
});

expect.extend({ toStartWith, toBeAValidURL, toBeABoolean });
