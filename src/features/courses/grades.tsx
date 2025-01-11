import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import { LL } from 'i18n';
import { ready } from '@/DOM';
import { requirePromise } from '@/require.js';

const enabled = new BooleanSetting('enabled', true);
const newTab = new BooleanSetting('newTab', false).disabledIf(
    enabled,
    '==',
    false
);

let gradesLink: HTMLAnchorElement;

newTab.onInput(() => {
    if (newTab.value) {
        if (gradesLink) gradesLink.target = '_blank';
    } else gradesLink?.removeAttribute('target');
});

/**
 * Creates and adds the grades link or removes it, depending on state
 */
const onload = async () => {
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
                    class="w-100 text-center"
                    href={`/grade/report/user/index.php?id=${courseId}`}
                >
                    <i class="icon fa fa-calculator fa-fw"></i>
                    &nbsp;
                    {LL.features.courses.features.grades.grades()}
                </a>
            ) as HTMLAnchorElement;
            if (newTab.value) gradesLink.target = '_blank';

            const headercontent = header.querySelector('.drawerheadercontent');
            if (headercontent) headercontent.before(gradesLink);
            else header.append(gradesLink);
        });
    } else gradesLink?.remove();
};

enabled.onInput(() => void onload());

/**
 * Removes the grades link
 */
const onunload = () => {
    gradesLink?.remove();
};

export default Feature.register({
    settings: new Set([enabled, newTab]),
    onload,
    onunload,
});
