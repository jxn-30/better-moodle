import * as vitest from 'vitest';
import tempStorage from '#lib/TempStorage';

const { afterEach, describe, expect, it } = vitest;

// section TempStorage
describe('TempStorage', () => {
    // reset shared singleton state so tests stay isolated from each other
    afterEach(() => {
        tempStorage.settingsRequireReload = false;
    });

    it('initializes settingsRequireReload to false', () => {
        expect(tempStorage.settingsRequireReload).toBe(false);
    });

    it('settingsRequireReload can be changed to true', () => {
        tempStorage.settingsRequireReload = true;
        expect(tempStorage.settingsRequireReload).toBe(true);
    });

    it('settingsRequireReload can be changed back to false', () => {
        tempStorage.settingsRequireReload = true;
        tempStorage.settingsRequireReload = false;
        expect(tempStorage.settingsRequireReload).toBe(false);
    });

    it('exports a singleton instance (same reference across imports)', async () => {
        // re-importing the module must yield the exact same object instance,
        // since the module caches its default export
        const reimported = (await import('#lib/TempStorage')).default;
        expect(reimported).toBe(tempStorage);
    });

    it('mutations via one reference are visible via another reference to the singleton', async () => {
        const reimported = (await import('#lib/TempStorage')).default;
        tempStorage.settingsRequireReload = true;
        expect(reimported.settingsRequireReload).toBe(true);
    });
});
// endsection TempStorage
