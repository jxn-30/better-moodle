import * as times from '#lib/times';
import { describe, expect, it } from 'vitest';

// section times
describe('times', () => {
    it('the time durations should be correct', () => {
        expect(times).toMatchObject({
            ONE_SECOND: 1000,

            TEN_SECONDS: 10_000,
            FIFTEEN_SECONDS: 15_000,
            THIRTY_SECONDS: 30_000,

            ONE_MINUTE: 60_000,
            FOUR_MINUTES: 240_000,
            FIVE_MINUTES: 300_000,
            TEN_MINUTES: 600_000,

            ONE_HOUR: 3_600_000,

            ONE_DAY: 86_400_000,
        });
    });

    it('exports only positive integer millisecond values', () => {
        Object.values(times).forEach(value => {
            expect(typeof value).toBe('number');
            expect(Number.isInteger(value)).toBe(true);
            expect(value).toBeGreaterThan(0);
        });
    });

    it('keeps the constants internally consistent (each built from ONE_SECOND)', () => {
        expect(times.TEN_SECONDS).toBe(times.ONE_SECOND * 10);
        expect(times.FIFTEEN_SECONDS).toBe(times.ONE_SECOND * 15);
        expect(times.THIRTY_SECONDS).toBe(times.ONE_SECOND * 30);
        expect(times.ONE_MINUTE).toBe(times.ONE_SECOND * 60);
        expect(times.FOUR_MINUTES).toBe(times.ONE_MINUTE * 4);
        expect(times.FIVE_MINUTES).toBe(times.ONE_MINUTE * 5);
        expect(times.TEN_MINUTES).toBe(times.ONE_MINUTE * 10);
        expect(times.ONE_HOUR).toBe(times.ONE_MINUTE * 60);
        expect(times.ONE_DAY).toBe(times.ONE_HOUR * 24);
    });

    it('keeps the constants in strictly ascending order', () => {
        const orderedValues = [
            times.ONE_SECOND,
            times.TEN_SECONDS,
            times.FIFTEEN_SECONDS,
            times.THIRTY_SECONDS,
            times.ONE_MINUTE,
            times.FOUR_MINUTES,
            times.FIVE_MINUTES,
            times.TEN_MINUTES,
            times.ONE_HOUR,
            times.ONE_DAY,
        ];
        for (let i = 1; i < orderedValues.length; i++) {
            expect(orderedValues[i]).toBeGreaterThan(orderedValues[i - 1]);
        }
    });
});
// endsection times
