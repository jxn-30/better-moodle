import { BooleanSetting } from '#lib/Settings/BooleanSetting';
import Feature from '#lib/Feature';
import { ready } from '#lib/DOM';

const enabled = new BooleanSetting('enabled', true).addAlias(
    'courses.collapseAll'
);

/**
 * Allows collapsing all sections in the sidebar by doubleclicking
 */
const reload = async () => {
    if (!M.cfg.courseId || M.cfg.courseId === 1) return;

    const drawer = await ready().then(() =>
        document.getElementById('theme_boost-drawers-courseindex')
    );
    if (!drawer) return;

    /**
     * The event that collapses all sections on double click
     * @param event - the mouse event that was triggered
     */
    const listener = (event: MouseEvent) => {
        const target = event.target;
        if (
            !(target instanceof HTMLElement) &&
            !(target instanceof SVGElement)
        ) {
            return;
        }
        const collapseIcon = target.closest<HTMLAnchorElement>(
            '.courseindex-section-title .icons-collapse-expand'
        );
        if (!collapseIcon) return;

        event.preventDefault();

        drawer
            .querySelectorAll<HTMLAnchorElement>(
                `.courseindex-section-title .icons-collapse-expand${
                    collapseIcon.classList.contains('collapsed') ?
                        ':not(.collapsed)'
                    :   '.collapsed'
                }`
            )
            .forEach(collapseIcon => collapseIcon.click());
        collapseIcon.focus();
    };

    if (enabled.value) {
        drawer.addEventListener('dblclick', listener);
    } else {
        drawer.removeEventListener('dblclick', listener);
    }
};

enabled.onInput(() => void reload());

export default Feature.register({
    settings: new Set([enabled]),
    onload: reload,
    onunload: reload,
});
