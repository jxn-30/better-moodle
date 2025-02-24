/**
 * This class is used to store temporary data that is not supposed to be saved.
 * Any data will be lost once the page is reloaded.
 */
class TempStorage {
    /**
     * After saving settings, the page needs to be reloaded to apply the changes.
     * Some settings may use this as a dynamic change of their value would be to complex.
     */
    settingsRequireReload = false;
}

export default new TempStorage();
