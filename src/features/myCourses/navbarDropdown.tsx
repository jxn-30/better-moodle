import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import { PREFIX } from '@/helpers';
import { requirePromise } from '@/require.js';
import { SelectSetting } from '@/Settings/SelectSetting';
import style from './navbarDropdown.module.scss';
import {
    getActiveFilter,
    getAvailableCourseFilters,
    getAvailableCourseFiltersAsOptions,
} from '@/myCourses';
import { getDocumentFragmentHtml, putTemplate } from '@/DOM';

const enabled = new BooleanSetting('enabled', true)
    .addAlias('myCourses.navbarDropdown')
    .requireReload();
const filter = new SelectSetting(
    'filter',
    '_sync',
    getAvailableCourseFiltersAsOptions()
)
    .addAlias('myCourses.navbarDropdownFilter')
    .disabledIf(enabled, '==', false);
const favouriteCoursesAtTop = new BooleanSetting('favouriteCoursesAtTop', true)
    .addAlias('myCourses.navbarDropdownFavouritesAtTop')
    .disabledIf(enabled, '!=', true);

/**
 * Creates the dropdown and fills it with content.
 * Updates dropdown content on change of filter value
 */
const onload = () => {
    if (!enabled.value) return;

    const myCoursesElement = document.querySelector<HTMLLIElement>(
        '.primary-navigation .nav-item[data-key="mycourses"]'
    );
    const myCoursesLink = myCoursesElement?.querySelector<HTMLAnchorElement>(
        ':scope > a.nav-link'
    );
    if (!myCoursesElement || !myCoursesLink) return;

    void Promise.all([
        getAvailableCourseFilters().then(getActiveFilter),
        requirePromise([
            'core/templates',
            'block_myoverview/repository',
        ] as const),
    ])
        .then(([filter, [templates, myCourses]]) => {
            if (!filter) {
                throw new Error(
                    "Couldn't find a filter to use for fetching courses."
                );
            }

            return myCourses
                .getEnrolledCoursesByTimeline({
                    classification: filter.classification,
                    customfieldname: filter.customfieldname,
                    customfieldvalue: filter.customfieldvalue,
                    limit: 0,
                    offset: 0,
                    sort: 'shortname',
                })
                .then(({ courses }) => ({ courses, templates }));
        })
        .then(({ courses, templates }) => {
            if (favouriteCoursesAtTop.value) {
                courses.sort(
                    (a, b) => Number(b.isfavourite) - Number(a.isfavourite)
                );
            }

            const courseItems = courses.map(course => ({
                isactive: false,
                url: course.viewurl,
                title: `${course.shortname}\n${course.fullname}`,
                text: getDocumentFragmentHtml(
                    (
                        <>
                            {course.isfavourite ?
                                <i className="icon fa fa-star fa-fw"></i>
                            :   <></>}
                            {course.shortname ?
                                <strong>{course.shortname}</strong>
                            :   <></>}{' '}
                            <small>{course.fullname}</small>
                        </>
                    ) as DocumentFragment
                ),
            }));

            return templates.renderForPromise('core/moremenu_children', {
                moremenuid: PREFIX('my_courses-navbar_dropdown'),
                classes: style.desktop,
                title: myCoursesElement.title,
                text: myCoursesElement.textContent?.trim() ?? '',
                isactive: myCoursesLink.classList.contains('active'),
                haschildren: true,
                children: [
                    {
                        isactive: false,
                        url: myCoursesLink.href,
                        text: `[${myCoursesElement.textContent?.trim()}]`,
                    },
                    ...courseItems,
                ],
            });
        })
        .then(template =>
            putTemplate(myCoursesElement, template, 'replaceWith')
        )
        .then(([navItem]) => {
            // clicking on the dropdown toggle should open my courses page
            if (!myCoursesLink.classList.contains('active')) {
                navItem
                    .querySelector<HTMLAnchorElement>('.dropdown-toggle')
                    ?.addEventListener('click', e => {
                        if (navItem.classList.contains('show')) {
                            e.preventDefault();
                            window.location.replace(myCoursesLink.href);
                        }
                    });
            }
        });
};

export default Feature.register({
    settings: new Set([enabled, filter, favouriteCoursesAtTop]),
    onload,
});
