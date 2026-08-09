import { ready } from '#lib/DOM';

const MY_COURSES_URL = 'https://moodle.hsnr.de/my/courses.php';

/**
 * Injects a "My courses" tab after the Dashboard tab in both primary top navigation
 * and mobile drawer navigation.
 */
export function initMyCoursesTab(): void {
    void ready().then(() => {
        // Prevent duplicate injection
        if (document.querySelector('li[data-key="mycourses"]')) {
            return;
        }

        const isCurrentPage =
            window.location.pathname.includes('/my/courses.php');
        const langIsGerman = document.documentElement.lang.startsWith('de');
        const tabLabel = langIsGerman ? 'Meine Kurse' : 'My courses';

        // 1. Primary Top Navigation
        const dashboardNavItem = document.querySelector<HTMLLIElement>(
            'li[data-key="myhome"]'
        );
        if (dashboardNavItem?.parentNode) {
            const myCoursesLi = document.createElement('li');
            myCoursesLi.className = 'nav-item';
            myCoursesLi.setAttribute('data-key', 'mycourses');
            myCoursesLi.setAttribute('role', 'none');

            const link = document.createElement('a');
            link.className = `nav-link ${isCurrentPage ? 'active' : ''}`;
            link.href = MY_COURSES_URL;
            link.textContent = tabLabel;
            link.setAttribute('role', 'menuitem');
            link.setAttribute('data-disableactive', 'true');
            if (isCurrentPage) {
                link.setAttribute('aria-current', 'true');
            } else {
                link.setAttribute('tabindex', '-1');
            }

            myCoursesLi.appendChild(link);
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
                const drawerLink = document.createElement('a');
                drawerLink.href = MY_COURSES_URL;
                drawerLink.className = `list-group-item list-group-item-action ${isCurrentPage ? 'active' : ''}`;
                drawerLink.textContent = tabLabel;
                if (isCurrentPage) {
                    drawerLink.setAttribute('aria-current', 'true');
                }

                dashboardDrawerItem.after(drawerLink);
            }
        }
    });
}

initMyCoursesTab();
