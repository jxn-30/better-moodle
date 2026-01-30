import { BooleanSetting } from '#lib/Settings/BooleanSetting';
import Feature from '#lib/Feature';
import globalStyle from '#style/index.module.scss';
import mobileTemplate from './navbarDropdown/mobile.mustache?raw';
import { PREFIX } from '#lib/helpers';
import { requirePromise } from '#lib/require.js';
import { SelectSetting } from '#lib/Settings/SelectSetting';
import style from './navbarDropdown/style.module.scss';
import {
    type CourseFilter,
    getActiveFilter,
    getAvailableCourseFilters,
    getAvailableCourseFiltersAsOptions,
    onActiveFilterChanged,
} from '#lib/myCourses';
import { getHtml, getLoadingSpinner, ready } from '#lib/DOM';
import { putTemplate, renderCustomTemplate } from '#lib/templates';

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

let desktopNavItem: HTMLLIElement;
let mobileDropdown: HTMLDivElement;

/**
 * Loads the list of courses based on active filter
 * @param root0 - configuration of the dropdown
 * @param root0.desktopElement - the element to replace the dropdown with (for desktop screens)
 * @param root0.mobileElement - the element to replace the dropdown with (for mobile screens)
 * @param root0.myCoursesIsActive - are we currently on the myCourses page?
 * @param root0.myCoursesUrl - the url to the myCourses page
 * @param root0.myCoursesText - the text content of dropdown toggler
 */
const loadContent = ({
    desktopElement = desktopNavItem,
    mobileElement = mobileDropdown,
    myCoursesIsActive,
    myCoursesUrl,
    myCoursesText,
}: {
    desktopElement?: HTMLLIElement;
    mobileElement?: HTMLDivElement | HTMLAnchorElement;
    myCoursesIsActive: boolean;
    myCoursesUrl: string;
    myCoursesText: string;
}) => {
    if (!desktopElement || !mobileElement) return;

    let contentLoaded = false;
    void getLoadingSpinner().then(spinner => {
        spinner.classList.add('text-center');
        if (!contentLoaded) {
            desktopElement
                .querySelector('.dropdown-menu')
                ?.replaceChildren(spinner);
        }
    });

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
                text: getHtml(
                    <>
                        {course.isfavourite ?
                            <i className="icon fa fa-star fa-fw"></i>
                        :   null}
                        {course.shortname ?
                            <strong>{course.shortname}</strong>
                        :   null}{' '}
                        <small>{course.fullname}</small>
                    </>
                ),
            }));

            const children = [
                {
                    isactive: false,
                    url: myCoursesUrl,
                    text: `[${myCoursesText}]`,
                },
                ...courseItems,
            ];

            const desktop = templates.renderForPromise(
                'core/moremenu_children',
                {
                    moremenuid: PREFIX('my_courses-navbar_dropdown-desktop'),
                    classes: style.desktop,
                    text: myCoursesText,
                    isactive: myCoursesIsActive,
                    haschildren: true,
                    children,
                }
            );

            const mobile = renderCustomTemplate(
                'myCourses/navbarDropdown/mobile',
                mobileTemplate,
                {
                    includeTrigger: mobileElement instanceof HTMLAnchorElement,
                    sort: PREFIX('my_courses-navbar_dropdown-mobile'),
                    text: myCoursesText,
                    children,
                }
            );

            return Promise.all([desktop, mobile]);
        })
        .then(([desktopTemplate, mobileTemplate]) => {
            contentLoaded = true;
            const desktopEls = putTemplate<[HTMLLIElement]>(
                desktopElement,
                desktopTemplate,
                'replaceWith'
            );
            const mobileEls = putTemplate<
                [HTMLAnchorElement, HTMLDivElement] | [HTMLDivElement]
            >(mobileElement, mobileTemplate, 'replaceWith');
            return Promise.all([desktopEls, mobileEls]);
        })
        .then(([[navItem], mobile]) => {
            desktopNavItem = navItem;
            const mobileDropdownEl =
                mobile.length === 2 ? mobile[1] : mobile[0];
            mobileDropdown = mobileDropdownEl;

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
const onload = async () => {
    if (!enabled.value) return;

    await ready();

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

    const mobileMyCoursesLink = document.querySelector<HTMLAnchorElement>(
        `#theme_boost-drawers-primary .list-group-item[href="${myCoursesLink.href}"]`
    );

    if (!mobileMyCoursesLink) return;

    myCoursesLink.classList.add(globalStyle.awaitsDropdown);

    loadContent({
        desktopElement: myCoursesElement,
        mobileElement: mobileMyCoursesLink,
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
