import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import { getDocument } from '@/network';
import { PREFIX } from '@/helpers';
import { renderCustomTemplate } from '@/templates';
import { requirePromise } from '@/require.js';
import submenuTemplate from '+/userMenuCarouselSubmenu.mustache?raw';
import { putTemplate, ready } from '@/DOM';

const enabled = new BooleanSetting('enabled', true).addAlias(
    'general.quickRoleChange'
);

let menuItem: HTMLAnchorElement | null;
let menuItemLink: string;
let submenu: HTMLDivElement;

/**
 * Fetches the available roles to switch to and returns them in an array usable as template context.
 * @returns a promise resolving to the template context items
 */
const getAvailableRoles = () =>
    getDocument(menuItemLink)
        .then(({ value: doc }) =>
            doc.querySelectorAll<HTMLFormElement>(
                'form[action*="switchrole.php"]'
            )
        )
        .then(forms =>
            Array.from(forms).map(form => ({
                title: form.textContent?.trim() ?? '',
                text: form.textContent?.trim() ?? '',
                url: '#',
                attributes: [
                    {
                        key: 'data-role',
                        value: new FormData(form).get('switchrole') ?? -1,
                    },
                ],
                link: true,
            }))
        );
/**
 * Handles a click event and switches to the clicked role if possible
 * @param e - the click event
 */
const switchRole = (e: MouseEvent) => {
    const target = e.target;
    if (!(target instanceof HTMLAnchorElement)) return;
    const role = target.dataset.role;
    if (!role || role === '-1') return;
    e.preventDefault();

    void requirePromise(['core/config'] as const)
        .then(([{ courseId, sesskey }]) => {
            const formData = new FormData();
            formData.set('id', courseId?.toString() ?? '');
            formData.set('switchrole', role);
            formData.set('returnurl', window.location.href);
            formData.set('sesskey', sesskey);

            return fetch('/course/switchrole.php', {
                method: 'post',
                body: formData,
            });
        })
        .then(res => window.location.replace(res.url));
};

/**
 * Loads the quick role change menu or removes it, depending on setting state
 */
const reload = async () => {
    if (enabled.value) {
        await ready();
        menuItem = document.querySelector<HTMLAnchorElement>(
            '.dropdown-item[href*="switchrole.php"][href*="switchrole=-1"]'
        );
        const carouselInner = document.querySelector<HTMLDivElement>(
            '#usermenu-carousel .carousel-inner'
        );
        if (!menuItem || !carouselInner) return;
        if (submenu) carouselInner.append(submenu);

        menuItemLink = menuItem.href;

        const [menu] = await (submenu ?
            Promise.resolve([submenu])
        :   getAvailableRoles()
                .then(roleItems =>
                    renderCustomTemplate(
                        'user-menu-carousel-submenu',
                        submenuTemplate,
                        {
                            id: PREFIX('courses-quick_role_change-submenu'),
                            title: menuItem?.textContent?.trim() ?? '',
                            items: roleItems,
                        }
                    )
                )
                .then(template =>
                    putTemplate<[HTMLDivElement]>(
                        carouselInner,
                        template,
                        'append'
                    )
                ));
        submenu = menu;

        submenu.addEventListener('click', switchRole);

        menuItem.href = '#';
        menuItem.classList.add('carousel-navigation-link');
        menuItem.dataset.carouselTargetId = submenu.id;
    } else {
        if (menuItem) {
            menuItem.href = menuItemLink;
            menuItem.classList.remove('carousel-navigation-link');
            delete menuItem.dataset.carouselTargetId;
        }

        submenu?.removeEventListener('click', switchRole);
        submenu?.remove();
    }
};

enabled.onInput(() => void reload());

export default Feature.register({
    settings: new Set([enabled]),
    onload: reload,
    onunload: reload,
});
