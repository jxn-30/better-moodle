import { BooleanSetting } from '#lib/Settings/BooleanSetting';
import Feature from '#lib/Feature';
import { FeatureTranslation } from '#types/i18n';
import { getString } from '#lib/moodleStrings';
import { ready } from '#lib/DOM';

const enabled = new BooleanSetting('enabled', true);

const MOVED_ATTR = 'data-bm-moved-request';

/**
 * Builds an anchor element for navbar/drawer insertions.
 * @param href - The target URL for the link.
 * @param text - The visible label text.
 * @param className - The CSS classes applied to the link.
 * @returns The created HTML anchor element.
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
 * Moves "New course request" to Support menu.
 */
const reload = async () => {
    await ready();

    const requestLinks = document.querySelectorAll<HTMLAnchorElement>(
        'a[href*="/course/request.php"]'
    );

    // --- FEATURE DISABLED: restore original layout ---
    if (!enabled.value) {
        requestLinks.forEach(link => {
            const parent = link.closest('li, .list-group-item');
            if (parent instanceof HTMLElement) parent.style.display = '';
        });
        document.querySelectorAll(`[${MOVED_ATTR}]`).forEach(el => el.remove());
        return;
    }

    if (!requestLinks.length) return;

    // Fetch string directly from Moodle core as default
    const linkText = await getString('requestcourse', 'core');
    const desktopLink = requestLinks[0];

    // A. DESKTOP SUPPORT DROPDOWN
    const desktopSupportContainer = document.querySelector(
        '.dropdown-menu.boost-union-moremenu .carousel-inner'
    );

    if (
        desktopSupportContainer &&
        !desktopSupportContainer.querySelector(`[${MOVED_ATTR}]`)
    ) {
        const isActive = desktopLink?.classList.contains('active') ?? false;
        const desktopItem = buildLink(
            desktopLink?.href || '/course/request.php',
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
            desktopLink?.href || '/course/request.php',
            linkText,
            'list-group-item list-group-item-action'
        );
        mobileSupportContainer.prepend(mobileItem);
    }

    // C. HIDE ALL ORIGINAL LINKS/CONTAINERS
    requestLinks.forEach(link => {
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

export const de = {
    settings: {
        enabled: {
            name: 'Kursanfrage im Support-Menü',
            description:
                'Verschiebt den "neuer Kursantrag"-Link aus der Hauptnavigation in das Support-Dropdown.',
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        enabled: {
            name: 'Course request in Support menu',
            description:
                'Moves the "New course request" link from the primary navigation into the Support dropdown.',
        },
    },
} satisfies typeof de;

export default Feature.register({
    settings: new Set([enabled]),
    onload: reload,
    onunload: reload,
});
