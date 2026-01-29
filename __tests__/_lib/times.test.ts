import * as times from '#lib/times';
import { describe, expect, it } from 'vitest';

describe('times', () => {
    it('the time durations should be correct', () => {
        expect(times).toMatchObject({
            ONE_SECOND: 1000,

            TEN_SECONDS: 10_000,
            THIRTY_SECONDS: 30_000,

            ONE_MINUTE: 60_000,
            FOUR_MINUTES: 240_000,
            FIVE_MINUTES: 300_000,
            TEN_MINUTES: 600_000,

            ONE_HOUR: 3_600_000,

            ONE_DAY: 86_400_000,
        });
    });
});
