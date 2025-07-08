import { expect } from 'vitest';

const toStartWith = (actual: unknown, prefix: string) => {
    if (typeof actual !== 'string')
        throw new Error('Actual value must be a string');
    return {
        pass: actual.startsWith(prefix),
        message: () => `Expected the string ${JSON.stringify(actual)} to start with the string ${JSON.stringify(prefix)}.`,
    };
};

const toBeAValidURL = (actual: string) => {
    try {
      new URL(actual);
      return {
        pass: true,
      }
    } catch {
      return {
        pass: false,
        message: () => `Expected the string ${JSON.stringify(actual)} to be a valid URL.`
      }
    }
}

const toBeABoolean = (actual: unknown) => ({
    pass: typeof actual === 'boolean',
    message: () => `Expected a boolean but received a ${typeof actual}.`
});

expect.extend({ toStartWith, toBeAValidURL, toBeABoolean });
