import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import { LLF } from 'i18n';
import { ready } from '@/DOM';
import { requirePromise } from '@/require.js';

const enabled = new BooleanSetting('enabled', true).addAlias('courses.grades');
const newTab = new BooleanSetting('newTab', false)
    .addAlias('courses.gradesNewTab')
    .disabledIf(enabled, '==', false);

let gradesLink: HTMLAnchorElement;

newTab.onInput(() => {
    if (newTab.value) {
        if (gradesLink) gradesLink.target = '_blank';
    } else gradesLink?.removeAttribute('target');
});

/**
 * Creates and adds the grades link or removes it, depending on state
 */
const reload = async () => {
    await ready();

    const header = document.querySelector<HTMLDivElement>(
        '#theme_boost-drawers-courseindex .drawerheader'
    );

    if (enabled.value && header) {
        void requirePromise(['core/config'] as const).then(([config]) => {
            const courseId = config.courseId;
            if (!courseId || courseId === 1) return;

            gradesLink ??= (
                <a
                    className="w-100 text-center"
                    href={`/grade/report/user/index.php?id=${courseId}`}
                >
                    <i className="icon fa fa-calculator fa-fw"></i>
                    &nbsp;
                    {LLF('courses', 'grades').grades()}
                </a>
            ) as HTMLAnchorElement;
            if (newTab.value) gradesLink.target = '_blank';

            const headercontent = header.querySelector('.drawerheadercontent');
            if (headercontent) headercontent.before(gradesLink);
            else header.append(gradesLink);
        });
    } else gradesLink?.remove();
};

enabled.onInput(() => void reload());

export default Feature.register({
    settings: new Set([enabled, newTab]),
    onload: reload,
    onunload: reload,
});
