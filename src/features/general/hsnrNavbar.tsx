import { BooleanSetting } from '#lib/Settings/BooleanSetting';
import Feature from '#lib/Feature';
import { getString } from '#lib/moodleStrings';
import { ready } from '#lib/DOM';

const enabled = new BooleanSetting('enabled', true);

const MOVED_ATTR = 'data-bm-moved-request';
const HIDDEN_ATTR = 'data-bm-hidden-request';
const REQUEST_URL = 'https://moodle.hsnr.de/mod/page/view.php?id=746875';

let observer: MutationObserver | null = null;
let isApplying = false;

/**
 * Builds an anchor element for navbar or drawer insertions.
 * @param href - The target URL for the link.
 * @param text - The visible label text.
 * @param className - The CSS classes applied to the link.
 * @returns The created anchor element marked with the moved attribute.
 */
const buildLink = (href: string, text: string, className: string) => {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = text;
    link.className = className;
    link.setAttribute(MOVED_ATTR, 'true');
    return link;
};

/**
 * Locates the desktop Support dropdown container.
 * @returns The container element for Support menu items, or null if not found.
 */
const findDesktopSupportContainer = (): Element | null => {
    const legacy = document.querySelector(
        '.dropdown-menu.boost-union-moremenu .carousel-inner'
    );
    if (legacy) return legacy;

    const supportLink = Array.from(
        document.querySelectorAll<HTMLAnchorElement>(
            '.dropdown-menu a.dropdown-item'
        )
    ).find(a => a.textContent?.includes('First Steps with Moodle'));

    return (
        supportLink?.closest('.carousel-inner') ??
        supportLink?.closest('.dropdown-menu') ??
        null
    );
};

/**
 * Restores any hidden original navbar items and removes injected links.
 */
const restoreOriginalLayout = () => {
    document
        .querySelectorAll<HTMLElement>(`[${HIDDEN_ATTR}="true"]`)
        .forEach(el => {
            el.style.display = '';
            el.removeAttribute(HIDDEN_ATTR);
        });

    document
        .querySelectorAll<HTMLElement>(`[${MOVED_ATTR}="true"]`)
        .forEach(el => {
            el.remove();
        });
};

/**
 * Moves the course request link into the Support menu and hides the original navbar item.
 */
const applyLayout = async () => {
    if (isApplying) return;
    isApplying = true;

    try {
        if (!enabled.value) {
            restoreOriginalLayout();
            return;
        }

        const requestLinks = Array.from(
            document.querySelectorAll<HTMLAnchorElement>(
                `a[href*="/mod/page/view.php?id=746875"]:not([${MOVED_ATTR}])`
            )
        );

        if (!requestLinks.length) return;

        const desktopLink = requestLinks[0];
        const linkText =
            desktopLink?.textContent?.trim() ||
            (await getString('requestcourse', 'core')) ||
            'New course request';

        // A. DESKTOP SUPPORT DROPDOWN
        const desktopSupportContainer = findDesktopSupportContainer();

        if (
            desktopSupportContainer &&
            !desktopSupportContainer.querySelector(`[${MOVED_ATTR}]`)
        ) {
            const isActive = desktopLink?.classList.contains('active') ?? false;
            const desktopItem = buildLink(
                desktopLink?.href || REQUEST_URL,
                linkText,
                `dropdown-item ${isActive ? 'active' : ''}`
            );
            desktopItem.setAttribute('role', 'menuitem');
            desktopItem.setAttribute('data-disableactive', 'true');
            desktopItem.tabIndex = -1;
            if (desktopLink?.getAttribute('aria-current') === 'true') {
                desktopItem.setAttribute('aria-current', 'true');
            }

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
            const mobileItem = buildLink(
                desktopLink?.href || REQUEST_URL,
                linkText,
                'list-group-item list-group-item-action'
            );
            mobileSupportContainer.prepend(mobileItem);
        }

        // C. HIDE ALL ORIGINAL LINKS/CONTAINERS IN NAVBAR
        requestLinks.forEach(link => {
            if (link.hasAttribute(MOVED_ATTR)) return;
            const target =
                link.closest<HTMLElement>(
                    'li.nav-item, li, .list-group-item, [role="listitem"]'
                ) ?? link;
            target.style.display = 'none';
            target.setAttribute(HIDDEN_ATTR, 'true');
        });
    } finally {
        isApplying = false;
    }
};

/**
 * Starts a MutationObserver on document.body so dynamic navbar updates stay consistent.
 */
const ensureObserver = () => {
    if (observer || !document.body) return;

    observer = new MutationObserver(() => {
        if (enabled.value) {
            void applyLayout();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
};

/**
 * Waits for the DOM to be ready, ensures the observer is active, and applies the layout.
 */
const reload = async () => {
    await ready();
    ensureObserver();
    await applyLayout();
};

enabled.onInput(() => void reload());

export default Feature.register({
    settings: new Set([enabled]),
    onload: reload,
    /**
     * Disconnects the DOM observer and restores the original navigation layout on unload.
     */
    onunload: () => {
        observer?.disconnect();
        observer = null;
        restoreOriginalLayout();
    },
});
