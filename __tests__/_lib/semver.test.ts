import * as vitest from 'vitest';
import { lt } from '#lib/semver';

const { describe, expect, it } = vitest;

// section lt
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

    it('returns true for a minor update even with a higher patch on the left side', () => {
        // 1.2.9 -> 1.3.0 is a minor update, patch digits must not be compared
        // numerically across different minor versions
        expect(lt('1.2.9', '1.3.0')).toBe(true);
    });

    it('returns true for a major update even with higher minor/patch on the left side', () => {
        expect(lt('1.9.9', '2.0.0')).toBe(true);
    });

    // double-digit version parts must be compared numerically, not as strings
    // ("1.10.0" as a string is < "1.9.0", but numerically 1.10.0 > 1.9.0)
    it('compares double-digit minor versions numerically, not lexicographically', () => {
        expect(lt('1.9.0', '1.10.0')).toBe(true);
        expect(lt('1.10.0', '1.9.0')).toBe(false);
    });

    it('compares double-digit major versions numerically, not lexicographically', () => {
        expect(lt('9.0.0', '10.0.0')).toBe(true);
        expect(lt('10.0.0', '9.0.0')).toBe(false);
    });

    it('compares double-digit patch versions numerically, not lexicographically', () => {
        expect(lt('1.2.9', '1.2.10')).toBe(true);
        expect(lt('1.2.10', '1.2.9')).toBe(false);
    });

    // when major/minor/patch are all equal, falls back to plain string comparison
    // (relevant for pre-release/build metadata suffixes, e.g. nightly builds)
    it('falls back to string comparison for identical major.minor.patch with different suffixes', () => {
        expect(lt('1.2.3-alpha', '1.2.3-beta')).toBe(true);
        expect(lt('1.2.3-beta', '1.2.3-alpha')).toBe(false);
    });

    it('treats a version without suffix as less than the same version with a suffix', () => {
        // '1.2.3' < '1.2.3-alpha' as a plain string comparison
        expect(lt('1.2.3', '1.2.3-alpha')).toBe(true);
        expect(lt('1.2.3-alpha', '1.2.3')).toBe(false);
    });

    it('returns false when comparing a version against itself with a suffix', () => {
        expect(lt('1.2.3-nightly.1', '1.2.3-nightly.1')).toBe(false);
    });

    // NaN-producing edge cases: non-numeric parts propagate as NaN comparisons,
    // all numeric comparisons involving NaN are false, so it falls through to the
    // string-comparison branch only if major/minor/patch are strictly equal (NaN !== NaN)
    it('never returns true when a part is not parseable as a number and parts differ', () => {
        expect(lt('a.b.c', '1.2.3')).toBe(false);
        expect(lt('1.2.3', 'a.b.c')).toBe(false);
    });

    it('handles versions with missing patch segment', () => {
        // '1.2'.split('.') => ['1', '2'], patch becomes undefined -> parseInt(undefined) => NaN
        expect(lt('1.2', '1.2.1')).toBe(false);
        expect(lt('1.2.1', '1.2')).toBe(false);
    });

    it('handles empty strings without throwing', () => {
        expect(() => lt('', '')).not.toThrow();
        expect(lt('', '')).toBe(false);
    });
});
// endsection lt
