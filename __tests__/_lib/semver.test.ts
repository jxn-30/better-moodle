import * as vitest from 'vitest';
import { lt } from '#lib/semver';

const { describe, expect, it } = vitest;

describe('lt', () => {
    it('returns true for 1.2.3 < 2.0.0', () => {
        expect(lt('1.2.3', '2.0.0')).toBe(true);
    });

    it('returns true for 1.2.3 < 1.3.0', () => {
        expect(lt('1.2.3', '1.3.0')).toBe(true);
    });

    it('returns true for 1.2.3 < 1.2.4', () => {
        expect(lt('1.2.3', '1.2.4')).toBe(true);
    });

    it('returns false for 1.2.3 < 1.2.3', () => {
        expect(lt('1.2.3', '1.2.3')).toBe(false);
    });

    it('returns false for 1.2.4 < 1.2.3', () => {
        expect(lt('1.2.4', '1.2.3')).toBe(false);
    });

    it('returns false for 1.3.8 < 1.2.3', () => {
        expect(lt('1.3.8', '1.2.3')).toBe(false);
    });

    it('returns false for 2.8.2 < 1.2.3', () => {
        expect(lt('2.8.2', '1.2.3')).toBe(false);
    });
});
