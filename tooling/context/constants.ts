type Serializable = boolean | number | string;
type ValueArray = Value[];
interface ValueObject {
    [key: string]: Value;
}
type Value = Serializable | ValueArray | ValueObject;

type Key = `__${string}__`;

const constants = new Map<Key, Value>();

/**
 * Set a new constant
 * @param key - the constant name
 * @param value - the serializable value of this constant
 * @returns void
 */
export const setConstant = (key: Key, value: Value) =>
    void constants.set(key, value);

/**
 * Get a copy of current constants
 * @returns current constants
 */
export const getConstants = () => {
    const cloned = Object.fromEntries(constants.entries());
    Object.freeze(cloned);
    Object.seal(cloned);
    return cloned;
};

/**
 * Get a copy of current constants with stringified values
 * @returns current constants
 */
export const getConstantsStringified = () => {
    const cloned = Object.fromEntries(
        constants.entries().map(([key, value]) => [key, JSON.stringify(value)])
    );

    // Vitest deletes the define for some reason:
    // https://github.com/vitest-dev/vitest/blob/65cf4cc2ca9f4cda1bdfaa4bcc7ad2c5e09ab7e4/packages/vitest/src/node/plugins/utils.ts#L66
    if (!process.env.VITEST) {
        Object.freeze(cloned);
        Object.seal(cloned);
    }
    return cloned;
};
