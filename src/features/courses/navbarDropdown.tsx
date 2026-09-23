import { BooleanSetting } from '#lib/Settings/BooleanSetting';
import Feature from '#lib/Feature';
import { FIFTEEN_SECONDS } from '#lib/times';
import globalStyle from '#style/index.module.scss';
import { LLF } from '#i18n';
import mobileTemplate from './navbarDropdown/mobile.mustache?raw';
import { PREFIX } from '#lib/helpers';
import { require } from '#lib/require.js';
import { SelectSetting } from '#lib/Settings/SelectSetting';
import style from './navbarDropdown/style.module.scss';
import styleVars from './navbarDropdown/vars.module.scss?json';
import type {
    Course,
    Section,
} from '#types/require.js/core_courseformat/local/courseeditor/exporter';
import {
    type CourseFilter,
    getActiveFilter,
    getAvailableCourseFilters,
    getAvailableCourseFiltersAsOptions,
    onActiveFilterChanged,
} from '#lib/myCourses';
import { getHtml, getLoadingSpinner, ready } from '#lib/DOM';
import { putTemplate, renderCustomTemplate } from '#lib/templates';

const LL = LLF('courses', 'navbarDropdown');

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
).disabledIf(enableCourseindex, '!=', true);
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

let desktopNavItem: HTMLLIElement | null = null;
let mobileDropdown: HTMLDivElement | HTMLAnchorElement | null = null;

/**
 * Creates a button trigger to toggle the course index dropdown menu.
 * @param courseId - The unique identifier of the target course.
 * @returns The HTML button group element serving as the submenu trigger.
 */
const createSubmenuTrigger = (courseId: number) => (
    <div className={`btn-group dropright ${style.courseindexTrigger}`}>
        <button
            type="button"
            className="btn btn-icon btn-sm"
            aria-label="Open course index"
            aria-expanded="false"
            aria-haspopup="menu"
            dataset={{
                course: courseId.toString(),
                toggle: 'dropdown',
                bsToggle: 'dropdown',
            }}
        >
            <i className="icon fa-solid fa-fw fa-caret-right m-0"></i>
        </button>
    </div>
);

const courseIndexSubmenus = new Map<number, HTMLDivElement>();

/**
 * Adjusts the dynamic CSS positioning of a submenu to keep it within viewport bounds.
 * @param submenu - The HTMLDivElement container to reposition.
 */
function repositionSubmenu(this: void, submenu: HTMLDivElement) {
    submenu.style.removeProperty('top');
    const margin = styleVars.submenuMarginY as number;
    const currentTop = submenu.getBoundingClientRect().top;
    const targetTop = window.innerHeight - margin - submenu.scrollHeight;
    const finalTop = Math.max(60 + margin, targetTop);
    submenu.style.setProperty('top', `${Math.min(finalTop - currentTop, 0)}px`);

    submenu.style.setProperty(
        '--dropdown-top',
        `${submenu.getBoundingClientRect().top}px`
    );
}

/**
 * Unescapes HTML entities in a given string.
 * @param text - The raw text containing HTML entities.
 * @returns Plain string text with entities decoded.
 */
function unescapeText(this: void, text: string) {
    return new DOMParser().parseFromString(text, 'text/html').documentElement
        .textContent;
}

/**
 * Maps a section to its list of item nodes.
 * @param section - The section payload containing URL and title.
 * @returns Array of anchor elements representing the section link.
 */
function getSectionItems(this: void, section: Section) {
    return [
        (
            <a className="dropdown-item" href={section.sectionurl}>
                {unescapeText(section.title)}
            </a>
        ) as HTMLAnchorElement,
    ];
}

/**
 * Retrieves or creates an HTMLDivElement acting as the submenu container for a course's index.
 * @param courseId - The unique identifier of the course.
 * @returns The container element for the course index submenu.
 */
function getCourseIndexSubmenu(this: void, courseId: number): HTMLDivElement {
    const existing = courseIndexSubmenus.get(courseId);
    if (existing) return existing;

    const menu = (<div className="dropdown-menu"></div>) as HTMLDivElement;
    courseIndexSubmenus.set(courseId, menu);

    void getLoadingSpinner(`navbarDropdown-courseindex-${courseId}`).then(
        spinner => {
            spinner.classList.add('text-center', 'd-block');
            menu.append(spinner);
        }
    );

    void loadCourseIndex(courseId)
        .then(data =>
            data.sections.flatMap(section => getSectionItems(section))
        )
        .then(items => menu.replaceChildren(...items))
        .then(() => {
            repositionSubmenu(menu);
        })
        .catch(() => {
            menu.replaceChildren(
                <span className="dropdown-item text-danger">
                    🦄 {LL.courseindex.error()}
                </span>
            );
            courseIndexSubmenus.delete(courseId);
        });

    return menu;
}

/**
 * Loads the course index data asynchronously via Moodle's core_courseformat module.
 * @param courseId - The unique identifier of the course to fetch.
 * @returns A promise that resolves to the Course structure or rejects on timeout/error.
 */
function loadCourseIndex(this: void, courseId: number): Promise<Course> {
    return require(['core_courseformat/courseeditor'] as const).then(
        ([coreCourseFormat]) =>
            new Promise<Course>((resolve, reject) => {
                const editor = coreCourseFormat.getCourseEditor(courseId);
                const timer = setTimeout(
                    () => reject(new Error('Timeout')),
                    FIFTEEN_SECONDS
                );
                void editor
                    .getInitialStatePromise()
                    .then(() => {
                        clearTimeout(timer);
                        const exporter = editor.getExporter();
                        resolve(exporter.course.bind(exporter)(editor.state));
                    })
                    .catch(reject);
            })
    );
}

interface EnhanceDesktopDetails {
    myCoursesIsActive: boolean;
    myCoursesUrl: string;
}

/**
 * Enhances desktop navigation items with extra course index triggers and event listeners.
 * @param navItem - The root desktop list item container.
 * @param details - Configuration detailing active state and targets URL.
 */
const enhanceDesktopDropdown = (
    navItem: HTMLLIElement,
    details: EnhanceDesktopDetails
) => {
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

    if (!enableCourseindex.value) return;

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
     * Closes all active submenus and resets their accessibility aria properties.
     */
    const closeAllSubmenus = () => {
        navItem
            .querySelectorAll(`.${style.courseindexTrigger} > .dropdown-menu`)
            .forEach(el => el.classList.remove('show'));
        navItem
            .querySelectorAll<HTMLButtonElement>('button[data-course]')
            .forEach(btn => btn.setAttribute('aria-expanded', 'false'));
    };

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
        btn.setAttribute('aria-expanded', wasHidden ? 'true' : 'false');

        repositionSubmenu(submenu);
    });

    void require(['jquery'] as const).then(([jquery]) =>
        jquery(navItem).on('hide.bs.dropdown', () => {
            closeAllSubmenus();
        })
    );
};

/**
 * Queries and retrieves active desktop and mobile target elements in the DOM.
 * @returns Object containing live reference or fallback DOM nodes.
 */
const getTargetElements = () => {
    const liveDesktop =
        document.querySelector<HTMLLIElement>('li[data-key="mycourses"]') ??
        (desktopNavItem?.isConnected ? desktopNavItem : null);

    const liveMobile =
        document.querySelector<HTMLDivElement | HTMLAnchorElement>(
            '#theme_boost-drawers-primary .list-group-item[href*="my"]'
        ) ?? (mobileDropdown?.isConnected ? mobileDropdown : null);

    return { liveDesktop, liveMobile };
};

interface LoadContentOptions {
    desktopElement?: HTMLLIElement;
    mobileElement?: HTMLDivElement | HTMLAnchorElement;
    myCoursesIsActive: boolean;
    myCoursesUrl: string;
    myCoursesText: string;
}

/**
 * Renders and mounts the course selection templates into target dropdown containers.
 * @param root0 - The options object.
 * @param root0.desktopElement - Optional explicit target for desktop navigation.
 * @param root0.mobileElement - Optional explicit target for mobile navigation.
 * @param root0.myCoursesIsActive - Indicates if the current tab is active.
 * @param root0.myCoursesUrl - The URL pointing to user courses.
 * @param root0.myCoursesText - Displays text for courses anchor.
 */
const loadContent = ({
    desktopElement,
    mobileElement,
    myCoursesIsActive,
    myCoursesUrl,
    myCoursesText,
}: LoadContentOptions) => {
    const { liveDesktop, liveMobile } = getTargetElements();
    const targetDesktop = desktopElement ?? liveDesktop;
    const targetMobile = mobileElement ?? liveMobile;

    if (!targetDesktop || !targetMobile) return;

    let contentLoaded = false;
    void getLoadingSpinner('navbarDropdown').then(spinner => {
        spinner.classList.add('text-center');
        if (!contentLoaded) {
            targetDesktop
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
        .then(([activeFilter, [templates, myCourses]]) => {
            if (!activeFilter) {
                throw new Error(
                    "Couldn't find a filter to use for fetching courses."
                );
            }

            return myCourses
                .getEnrolledCoursesByTimeline({
                    classification: activeFilter.classification,
                    customfieldname: activeFilter.customfieldname,
                    customfieldvalue: activeFilter.customfieldvalue,
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
                    includeTrigger: targetMobile instanceof HTMLAnchorElement,
                    sort: PREFIX('my_courses-navbar_dropdown-mobile'),
                    text: myCoursesText,
                    children,
                }
            );

            return Promise.all([desktop, mobile]);
        })
        .then(([desktopRenderResult, mobileRenderResult]) => {
            contentLoaded = true;
            const desktopEls = putTemplate<[HTMLLIElement]>(
                targetDesktop,
                desktopRenderResult,
                'replaceWith'
            );
            const mobileEls = putTemplate<
                [HTMLAnchorElement, HTMLDivElement] | [HTMLDivElement]
            >(targetMobile, mobileRenderResult, 'replaceWith');
            return Promise.all([desktopEls, mobileEls]);
        })
        .then(([[navItem], mobile]) => {
            navItem.setAttribute('data-key', 'mycourses');
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
 * Initializes feature setting observers and attaches the dropdown component onto page load.
 */
const onload = async () => {
    if (!enabled.value) return;

    await ready();

    let initialized = false;

    /**
     * Attempts to find course nav nodes and mount reactive event observers.
     * @returns True if setup was completed, false if required DOM elements were not found.
     */
    const init = () => {
        if (initialized) return true;

        const myCoursesElement = document.querySelector<HTMLLIElement>(
            'li[data-key="mycourses"]'
        );
        const myCoursesLink =
            myCoursesElement?.querySelector<HTMLAnchorElement>(
                ':scope > a.nav-link'
            );
        if (!myCoursesElement || !myCoursesLink) return false;

        initialized = true;

        const myCoursesIsActive = myCoursesLink.classList.contains('active');
        const myCoursesUrl = myCoursesLink.href;
        const myCoursesText = myCoursesLink.textContent?.trim() ?? '';

        const mobileMyCoursesLink = document.querySelector<HTMLAnchorElement>(
            `#theme_boost-drawers-primary .list-group-item[href="${myCoursesLink.href}"]`
        );

        myCoursesLink.classList.add(globalStyle.awaitsDropdown);

        /**
         * Triggers the internal content loader with initial node parameters.
         */
        const render = () => {
            loadContent({
                desktopElement: myCoursesElement,
                mobileElement: mobileMyCoursesLink ?? undefined,
                myCoursesIsActive,
                myCoursesUrl,
                myCoursesText,
            });
        };

        render();

        enableCourseindex.onChange(() => {
            courseIndexSubmenus.clear();
            render();
        });
        activitiesInCourseindex.onChange(() => {
            courseIndexSubmenus.clear();
            render();
        });
        favouriteCoursesAtTop.onChange(render);
        filter.onChange(render);

        onActiveFilterChanged(() => {
            if (filter.value === '_sync') {
                render();
            }
        });

        return true;
    };

    if (!init()) {
        /**
         * Event handler callback for mycourses-ready signal.
         */
        const handleReady = () => {
            init();
        };

        window.addEventListener('better-moodle:mycourses-ready', handleReady, {
            once: true,
        });

        const observer = new MutationObserver(() => {
            if (document.querySelector('li[data-key="mycourses"]')) {
                if (init()) observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }
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
