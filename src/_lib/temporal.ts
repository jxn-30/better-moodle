/**
 * Get today as a temporal
 * @returns today as a temporal
 */
export const getToday = () => Temporal.Now.plainDateISO();
/**
 * Get current DateTime as a temporal
 * @returns now as a temporal
 */
export const getTodayNow = () => Temporal.Now.plainDateTimeISO();
