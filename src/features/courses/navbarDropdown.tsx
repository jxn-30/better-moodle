import { BooleanSetting } from '#lib/Settings/BooleanSetting';
import Feature from '#lib/Feature';
import globalStyle from '#style/index.module.scss';
import mobileTemplate from './navbarDropdown/mobile.mustache?raw';
import { PREFIX } from '#lib/helpers';
import { require } from '#lib/require.js';
import type { Section } from '#types/require.js/core_courseformat/local/courseeditor/exporter';
import { SelectSetting } from '#lib/Settings/SelectSetting';
import style from './navbarDropdown/style.module.scss';
import styleVars from './navbarDropdown/vars.module.scss?json';
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
const enableCourseindex = new BooleanSetting('courseindex', true).disabledIf(
    enabled,
    '!=',
    true
);
const activitiesInCourseindex = new BooleanSetting(
    'courseindexActivities',
    false
)
    .disabledIf(enabled, '!=', true)
    .disabledIf(enableCourseindex, '!=', true);
const filter = new SelectSetting(
    'filter',
    '_sync',
    getAvailableCourseFiltersAsOptions()
)
    .addAlias('myCourses.navbarDropdownFilter')
    .disabledIf(enabled, '!=', true);
const favouriteCoursesAtTop = new BooleanSetting('favouriteCoursesAtTop', true)
    .addAlias('myCourses.navbarDropdownFavouritesAtTop')
    .disabledIf(enabled, '!=', true);

let desktopNavItem: HTMLLIElement;
let mobileDropdown: HTMLDivElement;

// const courseIndexSubmenuId = (courseId: number) =>
//    PREFIX(`courses-navbar-dropdown-courseindex-${courseId}`);

/**
 * Creates a trigger to open the submenu containing the courseindex
 * @param courseId - the id of the course
 * @returns a trigger html element
 */
const createSubmenuTrigger = (courseId: number) => (
    <div className={['btn-group dropright', style.courseindexTrigger]}>
        <button
            type="button"
            className="btn btn-icon btn-sm"
            dataset={{ course: courseId.toString(), toggle: 'dropdown' }}
        >
            <i className="icon fa-solid fa-fw fa-caret-right m-0"></i>
        </button>
    </div>
);

const courseIndexSubmenus = new Map<number, HTMLDivElement>();

/**
 * Creates (or gets if already created) the courseindex submenu of a course and fills it once courseindex is loaded
 * @param courseId - the id of the course
 * @returns the courseindex submenu of this course
 */
const getCourseIndexSubmenu = (courseId: number) =>
    courseIndexSubmenus.getOrInsertComputed(courseId, () => {
        const menu = (<div class="dropdown-menu"></div>) as HTMLDivElement;

        void getLoadingSpinner(`navbarDropdown-courseindex-${courseId}`).then(
            spinner => {
                spinner.classList.add('text-center', 'd-block');
                menu.append(spinner);
            }
        );

        /**
         * Creates the DOM items for a section and its activities
         * @param section - the section to generate the items for
         * @returns the dropdown items
         */
        const getItems = (section: Section) =>
            activitiesInCourseindex.value ?
                [
                    (
                        <a className="dropdown-item" href={section.sectionurl}>
                            {section.title}
                        </a>
                    ) as HTMLAnchorElement,
                    ...section.cms.map(
                        cm =>
                            (
                                <a
                                    className="dropdown-item"
                                    style="text-indent: 1em;"
                                    href={
                                        cm.url ??
                                        `${section.sectionurl}#${cm.anchor}`
                                    }
                                >
                                    {cm.name}
                                </a>
                            ) as HTMLAnchorElement
                    ),
                ]
            :   ((
                    <a className="dropdown-item" href={section.sectionurl}>
                        {section.title}
                    </a>
                ) as HTMLAnchorElement);

        void loadCourseIndex(courseId)
            .then(({ sections }) => sections.flatMap(getItems))
            .then(items => menu.replaceChildren(...items))
            .then(() => repositionSubmenu(menu));

        return menu;
    });

/**
 * Loads the courseindex of a specific course
 * @param courseId - the id of the course
 * @returns the courseindex of this course
 */
const loadCourseIndex = (courseId: number) =>
    require(['core_courseformat/courseeditor'] as const).then(
        // eslint-disable-next-line @typescript-eslint/unbound-method -- what does it even want to tell us here?
        ([{ getCourseEditor }]) => {
            const editor = getCourseEditor(courseId);
            return editor
                .getInitialStatePromise()
                .then(() => editor.getExporter().course(editor.state));
        }
    );

interface EnhanceDesktopDetails {
    myCoursesIsActive: boolean;
    myCoursesUrl: string;
}

/**
 * Repositions a submenu so that it looks great and uses screen space efficiently
 * @param submenu - the submenu to reposition
 */
const repositionSubmenu = (submenu: HTMLDivElement) => {
    // Increase the dropdown height if necessary
    submenu.style.removeProperty('top');
    const margin = styleVars.submenuMarginY as number;
    const currentTop = submenu.getBoundingClientRect().top;
    const targetTop = window.innerHeight - margin - submenu.scrollHeight;
    const finalTop = Math.max(60 + margin, targetTop); // Navbar has a height of 60
    submenu.style.setProperty('top', `${Math.min(finalTop - currentTop, 0)}px`);

    // store the top position of the dropdown to configure correct maxheight
    submenu.style.setProperty(
        '--dropdown-top',
        `${submenu.getBoundingClientRect().top}px`
    );
};

/**
 * Enhances the desktop dropdown by some additional features and adds event listeners etc.
 * @param navItem - the navbar element that triggers and contains the dropdown
 * @param details - details on how to enhance the dropdown
 */
const enhanceDesktopDropdown = (
    navItem: HTMLLIElement,
    details: EnhanceDesktopDetails
) => {
    // clicking on the dropdown toggle should open my courses page
    if (!details.myCoursesIsActive) {
        navItem
            .querySelector<HTMLAnchorElement>('.dropdown-toggle')
            ?.addEventListener('click', e => {
                if (navItem.classList.contains('show')) {
                    e.preventDefault();
                    window.location.replace(details.myCoursesUrl);
                }
            });
    }

    // Do not execute the next alters if the setting is disabled
    if (!enableCourseindex.value) return;

    // create and append triggers for courseindex submenus
    navItem
        .querySelectorAll('.dropdown-item:has(> [data-course])')
        .forEach(courseItem => {
            const courseId = Number(
                courseItem.querySelector<HTMLSpanElement>(
                    ':scope > [data-course]'
                )?.dataset.course ?? '-1'
            );
            if (courseId === -1) return;
            const trigger = createSubmenuTrigger(courseId);
            courseItem.before(trigger);
        });

    /**
     * Close all courseindex submenus
     * @returns void
     */
    const closeAllSubmenus = () =>
        navItem
            .querySelectorAll(`.${style.courseindexTrigger} > .dropdown-menu`)
            .forEach(el => el.classList.remove('show'));

    // create courseindex submenus on demand
    navItem.addEventListener('click', (e: MouseEvent) => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        const btn = target.closest<HTMLButtonElement>('button[data-course]');
        if (!btn) return;

        const courseId = Number(btn.dataset.course ?? '-1');
        if (courseId === -1) return;

        e.preventDefault();
        e.stopPropagation();

        const submenu = getCourseIndexSubmenu(courseId);
        btn.after(submenu);
        const wasHidden = !submenu.classList.contains('show');
        closeAllSubmenus();
        if (wasHidden) submenu.classList.add('show');

        repositionSubmenu(submenu);
    });

    // close submenus when dropdown is hidden (unfortunately a jquery-event)
    void require(['jquery'] as const).then(([jquery]) =>
        jquery(navItem).on('hide.bs.dropdown', closeAllSubmenus)
    );
};

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
    void getLoadingSpinner('navbarDropdown').then(spinner => {
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
        require(['core/templates', 'block_myoverview/repository'] as const),
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
                    <span dataset={{ course: course.id.toString() }}>
                        {course.isfavourite ?
                            <i className="icon fa fa-star fa-fw"></i>
                        :   null}
                        {course.shortname ?
                            <strong>{course.shortname}</strong>
                        :   null}{' '}
                        <small>{course.fullname}</small>
                    </span>
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

            enhanceDesktopDropdown(navItem, {
                myCoursesIsActive,
                myCoursesUrl,
            });
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

    enableCourseindex.onChange(() => {
        courseIndexSubmenus.clear();
        loadContent({ myCoursesIsActive, myCoursesUrl, myCoursesText });
    });
    activitiesInCourseindex.onChange(() => {
        courseIndexSubmenus.clear();
        loadContent({ myCoursesIsActive, myCoursesUrl, myCoursesText });
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
    settings: new Set([
        enabled,
        enableCourseindex,
        activitiesInCourseindex,
        filter,
        favouriteCoursesAtTop,
    ]),
    onload,
});
