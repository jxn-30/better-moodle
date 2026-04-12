/**
 * Pads a number to a minimum of 2 digits
 * @param n - the number to pad
 * @returns the padded number
 */
const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

/**
 * Returns a date in YYYYMMDDhhmmss-format of its UTC equivalent
 * @param date - the date to use if not now
 * @returns a date string is YYYYMMDDhhmmss-format
 */
export const getUTCString = (date = new Date()) => {
    const nowUTC = new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            date.getUTCHours(),
            date.getUTCMinutes(),
            date.getUTCSeconds()
        )
    );

    return (
        nowUTC.getFullYear().toString() +
        pad2(nowUTC.getMonth() + 1) +
        pad2(nowUTC.getDate()) +
        pad2(nowUTC.getHours()) +
        pad2(nowUTC.getMinutes()) +
        pad2(nowUTC.getSeconds())
    );
};
