import { BooleanSetting } from '#lib/Settings/BooleanSetting';
import Feature from '#lib/Feature';
import Drawer, { Side } from '#lib/Drawer';
import initCourseSidebar, {
    coursesSidebarEnabled,
    favouriteCoursesAtTop,
} from './layout/courseSidebar';
import { isDashboard, isLoggedIn } from '#lib/helpers';

const timelineSidebarEnabled = new BooleanSetting(
    'timelineSidebar',
    true
).requireReload();

/**
 * Creates and instantiates the drawers.
 */
const onload = async () => {
    if (!isDashboard || !(await isLoggedIn())) return;

    if (coursesSidebarEnabled.value) {
        void initCourseSidebar();
    }

    if (timelineSidebarEnabled.value && __UNI__ !== 'cau') {
        const blocks = ['timeline', 'calendar_upcoming'];

        const selector = blocks
            .map(block => `section[data-block="${block}"]`)
            .flatMap(block => [
                `a.sr-only:has(+ ${block})`,
                block,
                `${block} + span`,
            ])
            .join(',');

        void new Drawer('dashboard-timeline')
            .setAlias('dashboard-right')
            .setSide(Side.Right)
            .setIcon('calendar')
            .create()
            .then(drawer =>
                drawer.setContent(
                    <>{...Array.from(document.querySelectorAll(selector))}</>
                )
            );
    }
};

const settings = new Set([
    coursesSidebarEnabled,
    favouriteCoursesAtTop,
    timelineSidebarEnabled,
]);

if (__UNI__ === 'cau') {
    settings.delete(timelineSidebarEnabled);
}

export default Feature.register({ settings, onload });
