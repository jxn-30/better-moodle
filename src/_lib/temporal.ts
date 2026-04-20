/**
 * Get today as a temporal
 * @returns today as a temporal
 */
export const today = () => Temporal.Now.plainDateISO();
/**
 * Get current DateTime as a temporal
 * @returns now as a temporal
 */
export const todayNow = () => Temporal.Now.plainDateTimeISO();
