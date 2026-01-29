import { BooleanSetting } from '#lib/Settings/BooleanSetting';
import Feature from '#lib/Feature';
import { mdlJSComplete } from '#lib/helpers';

const enabled = new BooleanSetting('enabled', true);

/**
 * Converts the links into anchor-links or back to normal links.
 */
const reload = async () => {
    // we want this feature to only be active on the course main page
    if (window.location.pathname !== '/course/view.php') return;

    // let's wait for the DOM to be ready and for the courseindex to be loaded
    // DOM needs to be ready for the latter one, so no explicit check is required here.
    await mdlJSComplete('core_courseformat/placeholder:loadcourseindex');

    const linkSelector =
        '.courseindex-section .courseindex-section-title .courseindex-link';

    if (enabled.value) {
        document
            .querySelectorAll<HTMLAnchorElement>(linkSelector)
            .forEach(link => {
                const sectionNumber = link.closest<HTMLElement>(
                    '.courseindex-section[data-number]'
                )?.dataset.number;
                if (!sectionNumber) return;
                link.dataset.originalLink = link.href;
                link.href = `#section-${sectionNumber}`;
            });
    } else {
        document
            .querySelectorAll<HTMLAnchorElement>(linkSelector)
            .forEach(link => {
                link.href = link.dataset.originalLink ?? '';
            });
    }
};

enabled.onInput(() => void reload());

export default Feature.register({
    settings: new Set([enabled]),
    onload: reload,
    onunload: reload,
});
