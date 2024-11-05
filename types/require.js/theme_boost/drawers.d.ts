/* eslint-disable jsdoc/require-jsdoc */

export default class ThemeBoostDrawers {
    constructor(node: Element);

    static getDrawerInstanceForNode(node: Element): ThemeBoostDrawers;
    static eventTypes: Record<
        'drawerShow' | 'drawerShown' | 'drawerHide' | 'drawerHidden',
        string
    >;

    openDrawer({ focusOnCloseButton = true } = {}): void;
    closeDrawer({
        focusOnOpenButton = true,
        updatePreferences = true,
    } = {}): void;
    drawerNode: HTMLElement;
    isOpen: boolean;
}
