import { breakpoints } from '@/styleVars';
import { describe, expect, it } from 'vitest';

describe('breakpoints', () => {
    it('the breakpoints are the ones defined in the scss', () => {
        expect(breakpoints).toEqual({
            xs: 0,
            sm: 576,
            md: 768,
            lg: 992,
            xl: 1200,
        });
    });
});
