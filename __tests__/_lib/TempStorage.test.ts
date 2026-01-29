import tempStorage from '#lib/TempStorage';
import { describe, expect, it } from 'vitest';

describe('TempStorage', () => {
    it('initializes settingsRequireReload to false', () => {
        expect(tempStorage.settingsRequireReload).toBe(false);
    });

    it('settingsRequireReload can be changed', () => {
        tempStorage.settingsRequireReload = true;
        expect(tempStorage.settingsRequireReload).toBe(true);
    });
});
