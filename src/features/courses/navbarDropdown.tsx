import { BooleanSetting } from '@/Settings/BooleanSetting';
import { Course } from '#/require.js/block/myoverview/repository';
import Feature from '@/Feature';
import globalStyle from '!/index.module.scss';
import mobileTemplateRaw from './navbarDropdown/mobile.mustache?raw';
import { PREFIX } from '@/helpers';
import { requirePromise } from '@/require.js';
import { SelectSetting } from '@/Settings/SelectSetting';
import style from './navbarDropdown/style.module.scss';
import {
    type CourseFilter,
    getActiveFilter,
    getAvailableCourseFilters,
    getAvailableCourseFiltersAsOptions,
    onActiveFilterChanged,
} from '@/myCourses';
import {
    fetchCourses,
    getCachedCourseFilter,
    getCachedCourses,
} from '@/courseCache';
import { getHtml, getLoadingSpinner, ready } from '@/DOM';
import { putTemplate, renderCustomTemplate } from '@/templates';

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
 * Converts course data to template-ready format
 * @param courses - The list of courses to convert
 * @param myCoursesUrl - URL to the my courses page
 * @param myCoursesText - Text label for the my courses link
 * @param shouldSortFavourites - Whether to sort favourite courses to the top
 * @returns Array of template-ready course items
 */
const coursesToTemplateData = (
    courses: Course[],
    myCoursesUrl: string,
    myCoursesText: string,
    shouldSortFavourites: boolean
) => {
    const sortedCourses =
        shouldSortFavourites ?
            [...courses].sort(
                (a, b) => Number(b.isfavourite) - Number(a.isfavourite)
            )
        :   courses;

    const courseItems = sortedCourses.map(course => ({
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

    return [
        { isactive: false, url: myCoursesUrl, text: `[${myCoursesText}]` },
        ...courseItems,
    ];
};

/**
 * Renders dropdown templates and updates DOM
 * @param templates - The templates module from require.js
 * @param children - Template-ready course data
 * @param myCoursesText - Text label for the my courses link
 * @param myCoursesIsActive - Whether we're on the my courses page
 * @param myCoursesUrl - URL to the my courses page
 * @param desktopElement - Desktop nav item element
 * @param mobileElement - Mobile dropdown element
 */
const renderDropdownTemplates = async (
    templates: Awaited<
        ReturnType<
            typeof requirePromise<
                ['core/templates', 'block_myoverview/repository']
            >
        >
    >[0],
    children: ReturnType<typeof coursesToTemplateData>,
    myCoursesText: string,
    myCoursesIsActive: boolean,
    myCoursesUrl: string,
    desktopElement: HTMLLIElement,
    mobileElement: HTMLDivElement | HTMLAnchorElement
) => {
    const desktop = templates.renderForPromise('core/moremenu_children', {
        moremenuid: PREFIX('my_courses-navbar_dropdown-desktop'),
        classes: style.desktop,
        text: myCoursesText,
        isactive: myCoursesIsActive,
        haschildren: true,
        children,
    });

    const mobileRendered = renderCustomTemplate(
        'myCourses/navbarDropdown/mobile',
        mobileTemplateRaw,
        {
            includeTrigger: mobileElement instanceof HTMLAnchorElement,
            sort: PREFIX('my_courses-navbar_dropdown-mobile'),
            text: myCoursesText,
            children,
        }
    );

    const [desktopTemplate, mobileTemplate] = await Promise.all([
        desktop,
        mobileRendered,
    ]);

    const desktopEls = putTemplate<[HTMLLIElement]>(
        desktopElement,
        desktopTemplate,
        'replaceWith'
    );
    const mobileEls = putTemplate<
        [HTMLAnchorElement, HTMLDivElement] | [HTMLDivElement]
    >(mobileElement, mobileTemplate, 'replaceWith');

    const [[navItem], mobileResult] = await Promise.all([
        desktopEls,
        mobileEls,
    ]);

    desktopNavItem = navItem;
    mobileDropdown =
        mobileResult.length === 2 ? mobileResult[1] : mobileResult[0];

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

    // Try to get filter synchronously for immediate cache check
    const syncFilter =
        filter.value !== '_sync' ?
            (JSON.parse(filter.value) as CourseFilter)
        :   getCachedCourseFilter();

    const cachedCourses = syncFilter ? getCachedCourses(syncFilter) : null;

    // If we have cached data, render dropdown button immediately
    if (cachedCourses) {
        console.log(`Found ${cachedCourses.length} cached courses`);
        const dropdownToggle = document.createElement('a');
        dropdownToggle.className = 'nav-link dropdown-toggle';
        dropdownToggle.href = '#';
        dropdownToggle.setAttribute('data-toggle', 'dropdown');
        dropdownToggle.setAttribute('role', 'button');
        dropdownToggle.setAttribute('aria-haspopup', 'true');
        dropdownToggle.setAttribute('aria-expanded', 'false');
        dropdownToggle.textContent = myCoursesText;
        if (myCoursesIsActive) {
            dropdownToggle.classList.add('active');
        }

        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'dropdown-menu';
        dropdownMenu.setAttribute('role', 'menu');

        const newNavItem = document.createElement('li');
        newNavItem.className = 'nav-item dropdown';
        newNavItem.appendChild(dropdownToggle);
        newNavItem.appendChild(dropdownMenu);

        desktopElement.replaceWith(newNavItem);
        desktopNavItem = newNavItem;
    } else {
        // Show loading spinner if we don't have cached data
        void getLoadingSpinner().then(spinner => {
            spinner.classList.add('text-center');
            if (!contentLoaded) {
                desktopElement
                    .querySelector('.dropdown-menu')
                    ?.replaceChildren(spinner);
            }
        });
    }

    // Fetch courses (from cache or network) and render with templates
    void Promise.all([
        filter.value === '_sync' ?
            getAvailableCourseFilters().then(getActiveFilter)
        :   Promise.resolve(syncFilter),
        requirePromise([
            'core/templates',
            'block_myoverview/repository',
        ] as const),
    ]).then(async ([activeFilter, [templates, myCourses]]) => {
        if (!activeFilter) {
            throw new Error(
                "Couldn't find a filter to use for fetching courses."
            );
        }

        // Try to get courses from cache first
        let courses = getCachedCourses(activeFilter);
        const usedCache = !!courses;

        // Fetch fresh data if no cache
        courses ??= await fetchCourses(myCourses, filter, activeFilter);
        contentLoaded = true;

        // Render templates with courses
        const children = coursesToTemplateData(
            courses,
            myCoursesUrl,
            myCoursesText,
            favouriteCoursesAtTop.value
        );

        await renderDropdownTemplates(
            templates,
            children,
            myCoursesText,
            myCoursesIsActive,
            myCoursesUrl,
            desktopNavItem,
            mobileElement
        );

        // If we used cache, fetch fresh data in background
        if (usedCache) {
            void fetchCourses(myCourses, filter, activeFilter);
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

    // Check if we have cached data to avoid showing loading indicator
    const syncFilter =
        filter.value !== '_sync' ?
            (JSON.parse(filter.value) as CourseFilter)
        :   getCachedCourseFilter();
    const hasCachedData =
        syncFilter ? getCachedCourses(syncFilter) !== null : false;

    if (!hasCachedData) {
        myCoursesLink.classList.add(globalStyle.awaitsDropdown);
    }

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
