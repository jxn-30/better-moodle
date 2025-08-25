/* eslint-disable jsdoc/require-jsdoc */

class ThemeBoostDrawerClass {
    constructor();
    closeAll(): void;
    toggleDrawer(event: Event): void;
    preventPageScroll(event: Event): void;
    registerEventListeners(): void;
}

export default interface ThemeBoostDrawer {
    init(): ThemeBoostDrawerClass;
}
