import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import { getLoadingSpinner } from '@/DOM';
import { LL } from '../../i18n/i18n';
import { requirePromise } from '@/require.js';
import style from './layout.module.scss';
import {
    type CourseFilter,
    getActiveFilter,
    getAvailableCourseFilters,
    onActiveFilterChanged,
} from '@/myCourses';
import Drawer, { Side } from '@/Drawer';
import { isDashboard, isLoggedIn } from '@/helpers';

const coursesSidebarEnabled = new BooleanSetting(
    'coursesSidebar',
    true
).requireReload();
// TODO: Alias
const favouriteCoursesAtTop = new BooleanSetting('favouriteCoursesAtTop', true);
const timelineSidebarEnabled = new BooleanSetting(
    'timelineSidebar',
    true
).requireReload();

// migrate the old storage of courseFilter to new one
const courseFilterStorageKey = 'dashboard.layout.courseFilter';
const oldCourseFilterStorageKey =
    'better-moodle-settings.dashboard.courseListFilter';
const oldActiveCourseFilter = JSON.parse(
    GM_getValue(oldCourseFilterStorageKey, JSON.stringify('_sync'))
) as CourseFilter | '_sync';
GM_deleteValue(oldCourseFilterStorageKey);
let courseFilter: CourseFilter | '_sync' = GM_getValue(
    courseFilterStorageKey,
    oldActiveCourseFilter
);
GM_setValue(courseFilterStorageKey, courseFilter);

/**
 * Loads the content of the courses sidebar and shows a loading spinner meanwhile
 * @param drawer - the Drawer to add the course content to
 * @param filterSelection - the element that contains filters and needs to be added to the sidebar content
 */
const loadCourseContent = (drawer: Drawer, filterSelection: HTMLDivElement) => {
    let contentLoaded = false;
    // TODO: Do not create a new loadingSpinner but reuse the old one?
    void getLoadingSpinner().then(spinner => {
        spinner.classList.add('text-center');
        if (!contentLoaded) {
            drawer.setContent(spinner);
        }
    });

    void Promise.all([
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
            contentLoaded = true;

            if (!courses.length) {
                return drawer.setContent(
                    (
                        <>
                            {filterSelection}
                            <span className="text-muted text-center">
                                {LL.features.dashboard.features.layout.myCourses.empty()}
                            </span>
                        </>
                    ) as DocumentFragment
                );
            }

            if (favouriteCoursesAtTop.value) {
                courses.sort(
                    (a, b) => Number(b.isfavourite) - Number(a.isfavourite)
                );
            }

            const courseCards = courses.map(
                course =>
                    (
                        <div className="card block mb-3">
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

            return drawer.setContent(
                (
                    <>
                        {filterSelection}
                        {...courseCards}
                    </>
                ) as DocumentFragment
            );
        });
};

/**
 * Inits the course sidebar by creating necessary elements, registers event listeners and creates the sidebar itself.
 */
const initCourseSidebar = () => {
    const courseFilterDropdownBtnId = `${style.coursesSidebarFilterMenu}-toggle`;
    const filterSelection = (
        <div
            id={style.coursesSidebarFilterMenu}
            class="list-group w-100 mb-6 hidden"
            aria-labelledby={courseFilterDropdownBtnId}
        ></div>
    ) as HTMLDivElement;

    const syncFilterButton = (
        <button type="button" class="list-group-item list-group-item-action">
            [{LL.features.dashboard.features.layout.myCourses.sync()}]
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
                            class="list-group-item list-group-item-action"
                        >
                            {filter.name}
                        </button>
                    ) as HTMLButtonElement;
                    filterButtons.set(btn, filter);
                    return btn;
                })
            )
        )

        .then(getActiveFilter)
        .then(activeFilter => {
            if (courseFilter === '_sync') {
                syncFilterButton.classList.add('active');
                return;
            }
            for (const [element, filter] of filterButtons) {
                if (
                    typeof filter !== 'string' &&
                    typeof activeFilter !== 'string' &&
                    filter.classification === activeFilter?.classification &&
                    filter.customfieldvalue === activeFilter?.customfieldvalue
                ) {
                    element.classList.add('active');
                    return;
                }
            }
        });

    const toggleFilterBtn = (
        <button
            id={courseFilterDropdownBtnId}
            class="btn icon-no-margin dropdown-toggle"
            aria-controls={style.coursesSidebarFilterMenu}
        >
            <i class="icon fa fa-filter fa-fw"></i>
        </button>
    ) as HTMLButtonElement;
    const heading = (
        <>
            <a class="w-100 text-center" href="/my/courses.php">
                {LL.features.dashboard.features.layout.myCourses.title()}
            </a>
            {toggleFilterBtn}
        </>
    ) as DocumentFragment;

    void new Drawer('dashboard-courses')
        .setSide(Side.Left)
        .setIcon('graduation-cap')
        .create()
        .then(drawer => {
            // we set the heading here and not before creating as we need to interact with the content
            drawer.setHeading(heading);
            // load courses
            void loadCourseContent(drawer, filterSelection);
            // if the favourites setting has been changed, reload
            favouriteCoursesAtTop.onInput(() =>
                loadCourseContent(drawer, filterSelection)
            );
            // and if the active filter has been changed, load the changes too (but only if we're in synced mode)!
            onActiveFilterChanged(() => {
                if (courseFilter === '_sync') {
                    loadCourseContent(drawer, filterSelection);
                }
            });

            // toggle the filter selection visibility
            toggleFilterBtn.addEventListener('click', event => {
                event.preventDefault();
                filterSelection.classList.toggle('hidden');
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
                loadCourseContent(drawer, filterSelection);
            });
        });
};

/**
 * Creates and instantiates the drawers.
 */
const onload = () => {
    if (!isDashboard || !isLoggedIn) return;

    if (coursesSidebarEnabled.value) {
        initCourseSidebar();
    }

    if (timelineSidebarEnabled.value) {
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
            .setSide(Side.Right)
            .setIcon('calendar')
            .create()
            .then(drawer =>
                drawer.setContent(
                    (
                        <>
                            {...Array.from(document.querySelectorAll(selector))}
                        </>
                    ) as DocumentFragment
                )
            );
    }
};

export default Feature.register({
    settings: new Set([
        coursesSidebarEnabled,
        favouriteCoursesAtTop,
        timelineSidebarEnabled,
    ]),
    onload,
});
