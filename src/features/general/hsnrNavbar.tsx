import { BooleanSetting } from '#lib/Settings/BooleanSetting';
import Feature from '#lib/Feature';
import { LLF } from '#i18n';
import { ready } from '#lib/DOM';

const LL = LLF('general', 'hsnrNavbar');
const enabled = new BooleanSetting('enabled', true);

const MOVED_ATTR = 'data-bm-moved-request';

/**
 * Moves the "New course request" link from the primary navigation into the Support dropdown (desktop & mobile drawer).
 */
const reload = async () => {
    await ready();

    // 1. Find ALL instances of "New course request" links (Desktop & Mobile Drawer)
    const requestLinks = document.querySelectorAll<HTMLAnchorElement>(
        'a[href*="/course/request.php"]'
    );

    // --- FEATURE DISABLED: Restore original layout ---
    if (!enabled.value) {
        requestLinks.forEach(link => {
            const parent = link.closest('li, .list-group-item');
            if (parent instanceof HTMLElement) {
                parent.style.display = '';
            }
        });
        document.querySelectorAll(`[${MOVED_ATTR}]`).forEach(el => el.remove());
        return;
    }

    // --- FEATURE ENABLED: Move into Support menus ---
    if (!requestLinks.length) return;

    // A. DESKTOP SUPPORT DROPDOWN
    const desktopSupportContainer = document.querySelector(
        '.dropdown-menu.boost-union-moremenu .carousel-inner'
    );

    if (
        desktopSupportContainer &&
        !desktopSupportContainer.querySelector(`[${MOVED_ATTR}]`)
    ) {
        const desktopLink = requestLinks[0];
        const isActive = desktopLink?.classList.contains('active');
        const linkText = desktopLink?.textContent?.trim() || LL.courseRequest();

        const desktopItem = (
            <a
                className={`dropdown-item ${isActive ? 'active' : ''}`}
                role="menuitem"
                href={desktopLink?.href || '/course/request.php'}
                data-disableactive="true"
                tabIndex={-1}
                aria-current={
                    desktopLink?.getAttribute('aria-current') === 'true' ?
                        'true'
                    :   undefined
                }
                {...{ [MOVED_ATTR]: 'true' }}
            >
                {linkText}
            </a>
        ) as unknown as HTMLAnchorElement;

        desktopSupportContainer.prepend(desktopItem);
    }

    // B. MOBILE DRAWER SUPPORT SUBMENU
    const mobileSupportContainer = document.querySelector(
        '#nav-drawer .carousel-inner, .drawer-nav .carousel-inner, .drawer-left .carousel-inner'
    );

    if (
        mobileSupportContainer &&
        !mobileSupportContainer.querySelector(`[${MOVED_ATTR}]`)
    ) {
        const mobileLink = requestLinks[0];
        const linkText = mobileLink?.textContent?.trim() || LL.courseRequest();

        const mobileItem = (
            <a
                className="list-group-item list-group-item-action"
                href={mobileLink?.href || '/course/request.php'}
                {...{ [MOVED_ATTR]: 'true' }}
            >
                {linkText}
            </a>
        ) as unknown as HTMLAnchorElement;

        mobileSupportContainer.prepend(mobileItem);
    }

    // C. HIDE ALL ORIGINAL LINKS/CONTAINERS
    requestLinks.forEach(link => {
        // Do not hide items we injected ourselves!
        if (link.hasAttribute(MOVED_ATTR)) return;

        const parentContainer = link.closest(
            'li, .list-group-item, [role="listitem"]'
        );
        if (parentContainer instanceof HTMLElement) {
            parentContainer.style.display = 'none';
        } else {
            link.style.display = 'none';
        }
    });
};

enabled.onInput(() => void reload());

export default Feature.register({
    settings: new Set([enabled]),
    onload: reload,
    onunload: reload,
});
