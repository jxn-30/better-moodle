import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import globalStyle from '!/index.module.scss';
import mobileTemplate from './navbarDropdown/mobile.mustache?raw';
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

interface Course {
    viewurl: string;
    shortname: string;
    fullname: string;
    isfavourite: boolean;
}

interface CachedCourseData {
    courses: Course[];
    timestamp: number;
}

/**
 * Gets cached course data from localStorage
 * @param activeFilter - The filter to get cached data for
 * @returns The cached courses or null if not found/expired
 */
const getCachedCourses = (activeFilter: CourseFilter): Course[] | null => {
    try {
        const cacheKey = `${PREFIX('navbar-dropdown-cache')}-${JSON.stringify(activeFilter)}`;
        const cached = localStorage.getItem(cacheKey);
        if (!cached) return null;

        const data = JSON.parse(cached) as CachedCourseData;
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        console.log(`Cached courses: ${data.courses.length}`)
        if (Date.now() - data.timestamp < maxAge) {
            return data.courses;
        }
    } catch (e) {
        console.error('Error reading cached courses:', e);
    }
    return null;
};

/**
 * Stores course data in localStorage
 * @param activeFilter - The filter to cache data for
 * @param courses - The courses to cache
 */
const setCachedCourses = (activeFilter: CourseFilter, courses: Course[]): void => {
    try {
        const cacheKey = `${PREFIX('navbar-dropdown-cache')}-${JSON.stringify(activeFilter)}`;
        const data: CachedCourseData = {
            courses,
            timestamp: Date.now(),
        };
        localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (e) {
        console.error('Error caching courses:', e);
    }
};

/**
 * Gets the last active filter from cache (for _sync mode)
 * @returns The cached filter or null if not found
 */
const getLastActiveFilter = (): CourseFilter | null => {
    try {
        const cacheKey = `${PREFIX('navbar-dropdown-last-filter')}`;
        const cached = localStorage.getItem(cacheKey);
        if (!cached) return null;
        return JSON.parse(cached) as CourseFilter;
    } catch (e) {
        console.error('Error reading last active filter:', e);
        return null;
    }
};

/**
 * Stores the last active filter in cache (for _sync mode)
 * @param activeFilter - The filter to cache
 */
const setLastActiveFilter = (activeFilter: CourseFilter): void => {
    try {
        const cacheKey = `${PREFIX('navbar-dropdown-last-filter')}`;
        localStorage.setItem(cacheKey, JSON.stringify(activeFilter));
    } catch (e) {
        console.error('Error caching last active filter:', e);
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
        :   getLastActiveFilter();
    const cachedCourses = syncFilter ? getCachedCourses(syncFilter) : null;
    
    if (cachedCourses) {
        console.log('Cached courses (sync check 1):', cachedCourses.length);
        contentLoaded = true;
        
        // Create dropdown button immediately without templates
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
        
        // Render cached data once templates are available
        void requirePromise([
            'core/templates',
            'block_myoverview/repository',
        ] as const).then(([templates]) => {
            // Render the cached courses
            if (favouriteCoursesAtTop.value) {
                cachedCourses.sort(
                    (a, b) => Number(b.isfavourite) - Number(a.isfavourite)
                );
            }

            const courseItems = cachedCourses.map(course => ({
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

            void Promise.all([desktop, mobile])
                .then(([desktopTemplate, mobileTemplate]) => {
                    const desktopEls = putTemplate<[HTMLLIElement]>(
                        desktopNavItem,
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
        });
    } else {
        // Only show loading spinner if we don't have cached data
        void getLoadingSpinner().then(spinner => {
            spinner.classList.add('text-center');
            if (!contentLoaded) {
                desktopElement
                    .querySelector('.dropdown-menu')
                    ?.replaceChildren(spinner);
            }
        });
    }

    void Promise.all([
        filter.value === '_sync' ?
            getAvailableCourseFilters().then(getActiveFilter)
        :   Promise.resolve(syncFilter!),
        requirePromise([
            'core/templates',
            'block_myoverview/repository',
        ] as const),
    ])
        .then(async ([activeFilter, [templates, myCourses]]) => {
            if (!activeFilter) {
                throw new Error(
                    "Couldn't find a filter to use for fetching courses."
                );
            }

            // Check for cached data if we haven't already
            if (!cachedCourses) {
                const freshCachedCourses = getCachedCourses(activeFilter);
                if (freshCachedCourses) {
                    console.log('Cached courses (async check 2):', freshCachedCourses.length);
                    contentLoaded = true;
                    return { courses: freshCachedCourses, templates };
                }
                
                // Show loading spinner if still no cache
                void getLoadingSpinner().then(spinner => {
                    spinner.classList.add('text-center');
                    if (!contentLoaded) {
                        desktopElement
                            .querySelector('.dropdown-menu')
                            ?.replaceChildren(spinner);
                    }
                });
            } else {
                // Use the cached data we found earlier
                return { courses: cachedCourses, templates };
            }

            // Fetch fresh data
            return myCourses
                .getEnrolledCoursesByTimeline({
                    classification: activeFilter.classification,
                    customfieldname: activeFilter.customfieldname,
                    customfieldvalue: activeFilter.customfieldvalue,
                    limit: 0,
                    offset: 0,
                    sort: 'shortname',
                })
                .then(({ courses }: { courses: Course[] }) => {
                    setCachedCourses(activeFilter, courses);
                    // If we're in _sync mode, also cache this as the last active filter
                    if (filter.value === '_sync') {
                        setLastActiveFilter(activeFilter);
                    }
                    return { courses, templates };
                });
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
        })
        .then(() => {
            // Fetch fresh data in background if we used cache
            if (contentLoaded) {
                void Promise.all([
                    filter.value === '_sync' ?
                        getAvailableCourseFilters().then(getActiveFilter)
                    :   Promise.resolve(JSON.parse(filter.value) as CourseFilter),
                    requirePromise([
                        'core/templates',
                        'block_myoverview/repository',
                    ] as const),
                ]).then(([activeFilter, [, myCourses]]) => {
                    if (!activeFilter) return;
                    
                    void myCourses
                        .getEnrolledCoursesByTimeline({
                            classification: activeFilter.classification,
                            customfieldname: activeFilter.customfieldname,
                            customfieldvalue: activeFilter.customfieldvalue,
                            limit: 0,
                            offset: 0,
                            sort: 'shortname',
                        })
                        .then(({ courses }: { courses: Course[] }) => {
                            setCachedCourses(activeFilter, courses);
                            // If we're in _sync mode, also cache this as the last active filter
                            if (filter.value === '_sync') {
                                setLastActiveFilter(activeFilter);
                            }
                        });
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

    // Check if we have cached data to avoid showing loading indicator
    const syncFilter = 
        filter.value !== '_sync' ? 
            (JSON.parse(filter.value) as CourseFilter) 
        :   getLastActiveFilter();
    const hasCachedData = syncFilter ? getCachedCourses(syncFilter) !== null : false;
    
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
