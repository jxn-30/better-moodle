import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import { getLoadingSpinner } from '@/DOM';
import { getString } from '@/moodleStrings';
import { LLF } from 'i18n';
import { requirePromise } from '@/require.js';
import style from './layout.module.scss';
import {
    type CourseFilter,
    getActiveFilter,
    getAvailableCourseFilters,
    onActiveFilterChanged,
} from '@/myCourses';
import { debounce, domID, isDashboard, isLoggedIn } from '@/helpers';
import Drawer, { Side } from '@/Drawer';

const LL = LLF('dashboard', 'layout');

const coursesSidebarEnabled = new BooleanSetting(
    'coursesSidebar',
    true
).requireReload();
const favouriteCoursesAtTop = new BooleanSetting('favouriteCoursesAtTop', true)
    .addAlias('dashboard.courseListFavouritesAtTop')
    .disabledIf(coursesSidebarEnabled, '!=', true);
const timelineSidebarEnabled = new BooleanSetting(
    'timelineSidebar',
    true
).requireReload();

// migrate the old storage of courseFilter to new one
const courseFilterStorageKey = 'dashboard.layout.courseFilter';
const oldCourseFilterStorageKey =
    'better-moodle-settings.dashboard.courseListFilter';
const oldActiveCourseFilter = GM_getValue<string>(
    oldCourseFilterStorageKey,
    '_sync'
);
GM_deleteValue(oldCourseFilterStorageKey);
let courseFilter = GM_getValue<CourseFilter | '_sync'>(
    courseFilterStorageKey,
    oldActiveCourseFilter === '_sync' ? '_sync' : (
        (JSON.parse(oldActiveCourseFilter) as CourseFilter)
    )
);
GM_setValue(courseFilterStorageKey, courseFilter);

/**
 * Fetches the courses using the configured filter and converts them into html blocks ready for being added to DOM
 * @returns a promise that resolves to the html blocks being generated from courses
 */
const getCourseBlocks = (): Promise<HTMLDivElement[]> =>
    Promise.all([
        courseFilter === '_sync' ?
            getAvailableCourseFilters().then(getActiveFilter)
        :   Promise.resolve(courseFilter),
        requirePromise(['block_myoverview/repository'] as const),
    ])
        .then(([filter, [myCourses]]) => {
            if (!filter) {
                throw new Error(
                    "Couldn't find a filter to use for fetching courses."
                );
            }

            return myCourses.getEnrolledCoursesByTimeline({
                classification: filter.classification,
                customfieldname: filter.customfieldname,
                customfieldvalue: filter.customfieldvalue,
                limit: 0,
                offset: 0,
                sort: 'shortname',
            });
        })
        .then(({ courses }) => {
            if (!courses.length) {
                return [];
            }

            if (favouriteCoursesAtTop.value) {
                courses.sort(
                    (a, b) => Number(b.isfavourite) - Number(a.isfavourite)
                );
            }

            return courses.map(
                course =>
                    (
                        <div
                            className="card block mb-3"
                            data-search-text={`${course.shortname} ${course.fullname}`.toLowerCase()}
                        >
                            <div className="card-body p-3">
                                <a href={course.viewurl}>
                                    {course.isfavourite ?
                                        <i className="icon fa fa-star fa-fw"></i>
                                    :   <></>}
                                    {course.shortname ?
                                        <>
                                            <strong>{course.shortname}</strong>
                                            <br />
                                        </>
                                    :   <></>}
                                    <small>{course.fullname}</small>
                                </a>
                            </div>
                        </div>
                    ) as HTMLDivElement
            );
        });

/**
 * Inits the course sidebar by creating necessary elements, registers event listeners and creates the sidebar itself.
 */
const initCourseSidebar = () => {
    const searchStyle = <style></style>;
    const toggleSearchBtn = (
        <button className="btn icon-no-margin">
            <i className="icon fa fa-search fa-fw"></i>
        </button>
    ) as HTMLButtonElement;
    const searchInput = (
        <input className="form-control" type="search" />
    ) as HTMLInputElement;
    void getString('search', 'core').then(
        search => (searchInput.placeholder = search)
    );
    const searchBar = (
        <div
            className="input-group hidden"
            id={domID('dashboard-course-sidebar-search')}
        >
            <div className="input-group-prepend">
                <span className="input-group-text">
                    <i className="icon fa fa-search fa-fw m-0"></i>
                </span>
            </div>
            {searchInput}
        </div>
    ) as HTMLDivElement;

    const updateSearch = debounce(() => {
        const search = searchInput.value.trim().toLowerCase();
        if (search.length === 0) searchStyle.textContent = '';
        else {
            searchStyle.textContent = `#${searchBar.id} ~ .card[data-search-text]:not([data-search-text*="${CSS.escape(search)}"i]) {display: none !important;}`;
        }
    });

    toggleSearchBtn.addEventListener('click', () => {
        searchBar.classList.toggle('hidden');
        // focus search on showing
        if (!searchBar.classList.contains('hidden')) searchInput.focus();
        // clear search on hiding
        else {
            searchInput.value = '';
            updateSearch();
        }
    });

    searchInput.addEventListener('input', updateSearch);

    const courseFilterDropdownBtnId = `${style.coursesSidebarFilterMenu}-toggle`;
    const filterSelection = (
        <div
            id={style.coursesSidebarFilterMenu}
            className="list-group w-100 mb-6 hidden"
            aria-labelledby={courseFilterDropdownBtnId}
        ></div>
    ) as HTMLDivElement;

    const syncFilterButton = (
        <button
            type="button"
            className="list-group-item list-group-item-action"
        >
            [{LL.myCourses.sync()}]
        </button>
    ) as HTMLButtonElement;

    const filterButtons = new Map<HTMLButtonElement, CourseFilter | '_sync'>();
    filterButtons.set(syncFilterButton, '_sync');

    void getAvailableCourseFilters()
        .then(filters =>
            filterSelection.replaceChildren(
                syncFilterButton,
                ...filters.map(filter => {
                    const btn = (
                        <button
                            type="button"
                            className="list-group-item list-group-item-action"
                        >
                            {filter.name}
                        </button>
                    ) as HTMLButtonElement;
                    filterButtons.set(btn, filter);
                    return btn;
                })
            )
        )
        .then(() => {
            if (courseFilter === '_sync') {
                syncFilterButton.classList.add('active');
                return;
            }
            for (const [element, filter] of filterButtons) {
                if (
                    typeof filter !== 'string' &&
                    filter.classification === courseFilter?.classification &&
                    filter.customfieldvalue === courseFilter?.customfieldvalue
                ) {
                    element.classList.add('active');
                    return;
                }
            }
        });

    const toggleFilterBtn = (
        <button
            id={courseFilterDropdownBtnId}
            className="btn icon-no-margin dropdown-toggle"
            aria-controls={style.coursesSidebarFilterMenu}
        >
            <i className="icon fa fa-filter fa-fw"></i>
        </button>
    ) as HTMLButtonElement;
    const heading = (
        <>
            <a
                className="w-100 d-flex align-items-center justify-content-center"
                href="/my/courses.php"
            >
                {LL.myCourses.title()}
            </a>
            {toggleSearchBtn}
            {toggleFilterBtn}
        </>
    );

    /**
     * Updates the drawer content by triggering fetching the relevant course blocks
     * shows a loading spinner while fetching
     * also adds search bar and filter selection when needed
     * @param drawer - the drawer to set the content of
     */
    const updateDrawerContent = (drawer: Drawer) => {
        let contentLoaded = false;
        // TODO: Do not create a new loadingSpinner but reuse the old one?
        void getLoadingSpinner().then(spinner => {
            spinner.classList.add('text-center');
            if (!contentLoaded) {
                drawer.setContent(spinner);
            }
        });
        void getCourseBlocks().then(blocks => {
            contentLoaded = true;
            if (!blocks.length) {
                drawer.setContent(
                    <>
                        {filterSelection}
                        <span className="text-muted text-center">
                            {LL.myCourses.empty()}
                        </span>
                    </>
                );
            } else {
                drawer.setContent(
                    <>
                        {searchStyle}
                        {searchBar}
                        {filterSelection}
                        {...blocks}
                    </>
                );
            }
        });
    };

    void new Drawer('dashboard-courses')
        .setAlias('dashboard-left')
        .setSide(Side.Left)
        .setIcon('graduation-cap')
        .create()
        .then(drawer => {
            // we set the heading here and not before creating as we need to interact with the content
            drawer.setHeading(heading);
            // load courses
            void updateDrawerContent(drawer);
            // if the favourites setting has been changed, reload
            favouriteCoursesAtTop.onChange(
                () => void updateDrawerContent(drawer)
            );
            // and if the active filter has been changed, load the changes too (but only if we're in synced mode)!
            onActiveFilterChanged(() => {
                if (courseFilter === '_sync') {
                    void updateDrawerContent(drawer);
                }
            });

            // toggle the filter selection visibility
            toggleFilterBtn.addEventListener('click', event => {
                event.preventDefault();
                filterSelection.classList.toggle('hidden');
                // make sure that the filter selection is in visible part of the drawer
                filterSelection.scrollIntoView({ behavior: 'smooth' });
            });
            // hide filter selection on window click
            document.addEventListener('click', event => {
                if (filterSelection.classList.contains('hidden')) return;
                const target = event.target;
                if (!(target instanceof Element)) return;
                if (
                    target.closest(`#${filterSelection.id}`) ||
                    target.closest(`#${toggleFilterBtn.id}`)
                ) {
                    return;
                }
                filterSelection.classList.add('hidden');
            });
            // set filter on click
            filterSelection.addEventListener('click', event => {
                const target = event.target;
                if (!(target instanceof Element)) return;
                const item =
                    target.closest<HTMLButtonElement>('.list-group-item');
                if (!item) return;
                courseFilter = filterButtons.get(item) ?? '_sync';
                filterSelection
                    .querySelector('.active')
                    ?.classList.remove('active');
                item.classList.add('active');

                GM_setValue(courseFilterStorageKey, courseFilter);

                filterSelection.classList.add('hidden');
                void updateDrawerContent(drawer);
            });
        });
};

/**
 * Creates and instantiates the drawers.
 */
const onload = async () => {
    if (!isDashboard || !(await isLoggedIn())) return;

    if (coursesSidebarEnabled.value) {
        initCourseSidebar();
    }

    if (timelineSidebarEnabled.value && __UNI__ !== 'cau') {
        const blocks = ['timeline', 'calendar_upcoming'];

        const selector = blocks
            .map(block => `section[data-block="${block}"]`)
            .flatMap(block => [
                `a.sr-only:has(+ ${block})`,
                block,
                `${block} + span`,
            ])
            .join(',');

        void new Drawer('dashboard-timeline')
            .setAlias('dashboard-right')
            .setSide(Side.Right)
            .setIcon('calendar')
            .create()
            .then(drawer =>
                drawer.setContent(
                    <>{...Array.from(document.querySelectorAll(selector))}</>
                )
            );
    }
};

const settings = new Set([
    coursesSidebarEnabled,
    favouriteCoursesAtTop,
    timelineSidebarEnabled,
]);

if (__UNI__ === 'cau') {
    settings.delete(timelineSidebarEnabled);
}

export default Feature.register({ settings, onload });
