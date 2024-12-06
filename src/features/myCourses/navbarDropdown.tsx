import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import { PREFIX } from '@/helpers';
import { requirePromise } from '@/require.js';
import { SelectSetting } from '@/Settings/SelectSetting';
import style from './navbarDropdown.module.scss';
import {
    type CourseFilter,
    getActiveFilter,
    getAvailableCourseFilters,
    getAvailableCourseFiltersAsOptions,
    onActiveFilterChanged,
} from '@/myCourses';
import { getDocumentFragmentHtml, getLoadingSpinner, putTemplate } from '@/DOM';

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

let dropdownNavItem: HTMLLIElement;

/**
 * Loads the list of courses based on active filter
 * @param root0 - configuration of the dropdown
 * @param root0.element - the element to replace the dropdown with
 * @param root0.myCoursesIsActive - are we currently on the myCourses page?
 * @param root0.myCoursesUrl - the url to the myCourses page
 * @param root0.myCoursesText - the text content of dropdown toggler
 */
const loadContent = ({
    element = dropdownNavItem,
    myCoursesIsActive,
    myCoursesUrl,
    myCoursesText,
}: {
    element?: HTMLLIElement;
    myCoursesIsActive: boolean;
    myCoursesUrl: string;
    myCoursesText: string;
}) => {
    if (!element) return;

    let contentLoaded = false;
    // TODO: Do not create a new loadingSpinner but reuse the old one
    void getLoadingSpinner().then(spinner => {
        spinner.classList.add('text-center');
        if (!contentLoaded) {
            element.querySelector('.dropdown-menu')?.replaceChildren(spinner);
        }
    });

    console.log(filter.value);

    void Promise.all([
        filter.value === '_sync' ?
            getAvailableCourseFilters().then(getActiveFilter)
        :   Promise.resolve(JSON.parse(filter.value) as CourseFilter),
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
                text: myCoursesText,
                isactive: myCoursesIsActive,
                haschildren: true,
                children: [
                    {
                        isactive: false,
                        url: myCoursesUrl,
                        text: `[${myCoursesText}]`,
                    },
                    ...courseItems,
                ],
            });
        })
        .then(template => {
            contentLoaded = true;
            return putTemplate<[HTMLLIElement]>(
                element,
                template,
                'replaceWith'
            );
        })
        .then(([navItem]) => {
            dropdownNavItem = navItem;

            // clicking on the dropdown toggle should open my courses page
            if (!myCoursesIsActive) {
                navItem
                    .querySelector<HTMLAnchorElement>('.dropdown-toggle')
                    ?.addEventListener('click', e => {
                        if (navItem.classList.contains('show')) {
                            e.preventDefault();
                            window.location.replace(myCoursesUrl);
                        }
                    });
            }
        });
};

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

    const myCoursesIsActive = myCoursesLink.classList.contains('active');
    const myCoursesUrl = myCoursesLink.href;
    const myCoursesText = myCoursesLink.textContent?.trim() ?? '';

    loadContent({
        element: myCoursesElement,
        myCoursesIsActive,
        myCoursesUrl,
        myCoursesText,
    });

    favouriteCoursesAtTop.onChange(() =>
        loadContent({ myCoursesIsActive, myCoursesUrl, myCoursesText })
    );
    filter.onChange(() =>
        loadContent({ myCoursesIsActive, myCoursesUrl, myCoursesText })
    );

    onActiveFilterChanged(() => {
        if (filter.value === '_sync') {
            loadContent({ myCoursesIsActive, myCoursesUrl, myCoursesText });
        }
    });
};

export default Feature.register({
    settings: new Set([enabled, filter, favouriteCoursesAtTop]),
    onload,
});
