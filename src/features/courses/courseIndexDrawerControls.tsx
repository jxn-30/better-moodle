import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import { renderCustomTemplate } from '@/templates';
import Template from './courseIndexDrawerControls.mustache?raw';
import { putTemplate, ready } from '@/DOM';

const enabled = new BooleanSetting('enabled', true).addAlias(
    'myCourses.collapseAll'
);

const headerContent = (
    <div className="drawerheadercontent"></div>
) as HTMLDivElement;
let controls: HTMLDivElement;

/**
 * Renders and appends the controls or removes them, depending on setting state
 */
const onload = async () => {
    if (!enabled.value) {
        controls?.remove();
        return;
    }

    void ready().then(() =>
        document
            .querySelector<HTMLDivElement>(
                '#theme_boost-drawers-courseindex .drawerheader'
            )
            ?.append(headerContent)
    );

    if (controls) headerContent.append(controls);
    else {
        await renderCustomTemplate('courseIndexDrawerControls', Template, {})
            .then(template =>
                putTemplate<[HTMLDivElement]>(headerContent, template, 'append')
            )
            .then(([rendered]) => {
                controls = rendered;
                controls.addEventListener('click', e => {
                    const target = e.target;
                    if (!(target instanceof Element)) return;
                    const action =
                        target.closest<HTMLAnchorElement>('[data-action]')
                            ?.dataset.action;
                    if (!action) return;

                    const selectors: Record<string, string> = {
                        expandallcourseindexsections: '.collapsed',
                        collapseallcourseindexsections: ':not(.collapsed)',
                    };

                    document
                        .querySelectorAll<HTMLAnchorElement>(
                            `.courseindex-section-title .icons-collapse-expand${selectors[action]}`
                        )
                        .forEach(collapseIcon => collapseIcon.click());
                    document
                        .querySelector(
                            '#theme_boost-drawers-courseindex .drawercontent'
                        )
                        ?.scrollTo({ top: 0 });
                });
            });
    }
};

enabled.onInput(() => void onload());

/**
 * Removes the collapse / uncollapse controls.
 * @returns void
 */
const onunload = () => controls?.remove();

export default Feature.register({
    settings: new Set([enabled]),
    onload,
    onunload,
});
