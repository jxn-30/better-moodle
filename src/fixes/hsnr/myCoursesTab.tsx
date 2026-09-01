import { getString } from '#lib/moodleStrings';
import { ready } from '#lib/DOM';

const MY_COURSES_URL = 'https://moodle.hsnr.de/my/courses.php';

/**
 * Injects a "My courses" tab after the Dashboard tab in both primary top navigation
 * and mobile drawer navigation.
 */
void (async () => {
    await ready();

    // Prevent duplicate injection
    if (document.querySelector('li[data-key="mycourses"]')) {
        return;
    }

    const isCurrentPage = window.location.pathname.includes('/my/courses.php');

    // Fetch native string directly from Moodle core
    const tabLabel = await getString('mycourses', 'core');

    // 1. Primary Top Navigation
    const dashboardNavItem = document.querySelector<HTMLLIElement>(
        'li[data-key="myhome"]'
    );
    if (dashboardNavItem?.parentNode) {
        const myCoursesLi = (
            <li className="nav-item" data-key="mycourses" role="none">
                <a
                    className={`nav-link ${isCurrentPage ? 'active' : ''}`}
                    href={MY_COURSES_URL}
                    role="menuitem"
                    data-disableactive="true"
                    aria-current={isCurrentPage ? 'true' : undefined}
                    tabIndex={isCurrentPage ? undefined : -1}
                >
                    {tabLabel}
                </a>
            </li>
        ) as unknown as HTMLElement;

        dashboardNavItem.after(myCoursesLi);
    }

    // 2. Mobile/Drawer Navigation
    const drawerList = document.querySelector<HTMLDivElement>(
        '#theme_boost-drawers-primary .list-group'
    );
    if (drawerList) {
        const dashboardDrawerItem =
            drawerList.querySelector<HTMLAnchorElement>('a[href*="/my/"]');
        if (dashboardDrawerItem) {
            const drawerLink = (
                <a
                    href={MY_COURSES_URL}
                    className={`list-group-item list-group-item-action ${
                        isCurrentPage ? 'active' : ''
                    }`}
                    aria-current={isCurrentPage ? 'true' : undefined}
                >
                    {tabLabel}
                </a>
            ) as unknown as HTMLElement;

            dashboardDrawerItem.after(drawerLink);
        }
    }
})();
