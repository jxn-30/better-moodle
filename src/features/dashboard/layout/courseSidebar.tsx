import { BooleanSetting } from '#lib/Settings/BooleanSetting';
import CourseBlockTemplate from './courseBlock.mustache?raw';
import { getLoadingSpinner } from '#lib/DOM';
import { getString } from '#lib/moodleStrings';
import { LLF } from '#i18n';
import { renderCustomTemplateAsElements } from '#lib/templates';
import { requirePromise } from '#lib/require.js';
import style from '../layout.module.scss';
import {
    type CourseFilter,
    getActiveFilter,
    getAvailableCourseFilters,
    onActiveFilterChanged,
} from '#lib/myCourses';
import { debounce, domID } from '#lib/helpers';
import Drawer, { Side } from '#lib/Drawer';

const LL = LLF('dashboard', 'layout');

export const coursesSidebarEnabled = new BooleanSetting(
    'coursesSidebar',
    true
).requireReload();
export const favouriteCoursesAtTop = new BooleanSetting(
    'favouriteCoursesAtTop',
    true
)
    .addAlias('dashboard.courseListFavouritesAtTop')
    .disabledIf(coursesSidebarEnabled, '!=', true);

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

let drawer: Drawer;

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

            const context = {
                courses: courses.map(course => ({
                    ...course,
                    searchText:
                        `${course.shortname} ${course.fullname}`.toLowerCase(),
                })),
            };

            return renderCustomTemplateAsElements(
                'dashboard/layout/course_block',
                CourseBlockTemplate,
                context
            ).then(els => Array.from(els) as HTMLDivElement[]);
        });

/**
 * sets course hidden state and removes the block
 * @param courseId - the course id of the course to toggle
 * @param state - the new hidden state
 * @returns a void promise
 */
const setCourseHiddenState = (courseId: number, state: boolean) =>
    requirePromise(['core_user/repository', 'core/notification'] as const)
        .then(([{ setUserPreference }, Notification]) =>
            setUserPreference(
                `block_myoverview_hidden_course_${courseId}`,
                state || null // moodle does this too
            ).catch(Notification.exception)
        )
        .then(() =>
            // we can simply remove the block as it will not match current filters anymore
            drawer
                .querySelector(`.block.card[data-course-id="${courseId}"]`)
                ?.remove()
        );

/**
 * sets course favourite state and adjusts DOM accordingly
 * @param courseId - the course id of the course to toggle
 * @param state - the new favourite state
 */
const setCourseFavouriteState = (courseId: number, state: boolean) => {
    const addAction = drawer.querySelector(
        `[data-action="add-favourite"][data-course-id="${courseId}"]`
    );
    const removeAction = drawer.querySelector(
        `[data-action="remove-favourite"][data-course-id="${courseId}"]`
    );
    const favouriteIcon = drawer.querySelector(
        `.block.card[data-course-id="${courseId}"] .fa-star`
    );

    void requirePromise([
        'block_myoverview/repository',
        'core/notification',
    ] as const).then(([{ setFavouriteCourses }, Notification]) =>
        setFavouriteCourses({ courses: [{ id: courseId, favourite: state }] })
            .then(result => {
                if (result.warnings.length) {
                    throw new Error(`Changing favourite state failed`);
                }
                addAction?.classList.toggle('hidden', state);
                removeAction?.classList.toggle('hidden', !state);
                favouriteIcon?.classList.toggle('hidden', !state);
            })
            .catch(Notification.exception)
    );
};

/**
 * Inits the course sidebar by creating necessary elements, registers event listeners and creates the sidebar itself.
 */
const initCourseSidebar = async () => {
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

    drawer = await new Drawer('dashboard-courses')
        .setAlias('dashboard-left')
        .setSide(Side.Left)
        .setIcon('graduation-cap')
        .create();

    // we set the heading here and not before creating as we need to interact with the content
    drawer.setHeading(heading);

    /**
     * Updates the drawer content by triggering fetching the relevant course blocks
     * shows a loading spinner while fetching
     * also adds search bar and filter selection when needed
     */
    const updateDrawerContent = () => {
        let contentLoaded = false;
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

    // load courses
    void updateDrawerContent();
    // if the favourites setting has been changed, reload
    favouriteCoursesAtTop.onChange(() => void updateDrawerContent());
    // and if the active filter has been changed, load the changes too (but only if we're in synced mode)!
    onActiveFilterChanged(() => {
        if (courseFilter === '_sync') {
            void updateDrawerContent();
        }
    });

    // toggle the filter selection visibility
    toggleFilterBtn.addEventListener('click', event => {
        event.preventDefault();
        filterSelection.classList.toggle('hidden');
        // focus the currently active filter element to allow keyboard navigation
        filterSelection
            .querySelector<HTMLButtonElement>('.list-group-item.active')
            ?.focus();
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
        const item = target.closest<HTMLButtonElement>('.list-group-item');
        if (!item) return;
        courseFilter = filterButtons.get(item) ?? '_sync';
        filterSelection.querySelector('.active')?.classList.remove('active');
        item.classList.add('active');

        GM_setValue(courseFilterStorageKey, courseFilter);

        filterSelection.classList.add('hidden');
        void updateDrawerContent();
    });

    // add listeners to handle dropdown clicks
    drawer.addEventListener('click', e => {
        const target = e.target;
        if (!(target instanceof Element)) return;
        const actionEl = target.closest<HTMLElement>(
            '[data-action][data-course-id]'
        );
        if (!actionEl) return;

        const action = actionEl.dataset.action;
        const courseId = Number(actionEl.dataset.courseId);
        if (!action || !courseId || Number.isNaN(courseId)) return;

        e.preventDefault();

        if (action === 'hide-course') void setCourseHiddenState(courseId, true);
        else if (action === 'show-course') {
            void setCourseHiddenState(courseId, false);
        } else if (action === 'add-favourite') {
            setCourseFavouriteState(courseId, true);
        } else if (action === 'remove-favourite') {
            setCourseFavouriteState(courseId, false);
        }
    });
};

export default initCourseSidebar;
