import { getDocument } from './network';
import { require } from './require.js';
import { SelectOption } from './Components';
import {
    getCachedCourseFilter,
    getCachedCourseFilters,
    setCachedCourseFilters,
} from './courseCache';
import { isLoggedIn, PREFIX } from './helpers';

export interface CourseFilter {
    classification: string;
    customfieldname: string;
    customfieldvalue: string;
    name: string;
}

const availableFilters: CourseFilter[] = [];
let activeFilter: CourseFilter | null = null;

/**
 * Gets the filter from a filter element and sets it as the active one if required
 * @param el - the element to extract data from
 * @param customfieldname - name of custom field as exposed from the page
 * @param setActive - enforce setting this filter as the active one
 * @returns the filter
 */
const getFilterFromEl = (
    el: HTMLElement,
    customfieldname: string,
    setActive = false
) => {
    const active = setActive || el.ariaCurrent === 'true';
    const filter = {
        classification: el.dataset.pref ?? '',
        customfieldname,
        customfieldvalue: el.dataset.customfieldvalue ?? '',
        name: el.textContent?.trim() ?? '',
    };
    if (active) activeFilter = filter;
    return filter;
};

/**
 * Gets all available course filters / groupings from the myCourses page.
 * @param useCache - Wether possible cached course filters should be considered
 * @returns a list of available course filters
 */
export const getAvailableCourseFilters = async (
    useCache = true
): Promise<CourseFilter[]> => {
    if (availableFilters.length) return availableFilters;

    if (useCache) {
        const cached = getCachedCourseFilters();
        if (cached) return cached;
    }

    if (!(await isLoggedIn())) return [];

    const result0 = await Promise.all([
        require(['block_myoverview/selectors'] as const),
        getDocument('/my/courses.php').then(({ value }) => value),
    ]);
    const [[selectors], doc] = result0;
    const customfieldname =
        doc.querySelector<HTMLElement>(selectors.courseView.region)?.dataset
            .customfieldname ?? '';
    const filters = Array.from(
        doc.querySelectorAll<HTMLAnchorElement>(
            '#groupingdropdown + .dropdown-menu [data-filter="grouping"]'
        )
    ).map(el => getFilterFromEl(el, customfieldname));
    availableFilters.splice(0, availableFilters.length, ...filters);

    setCachedCourseFilters(availableFilters);
    return availableFilters;
};

/**
 * Gets all available course filters / groupings from the myCourses page as options for select elements.
 * @returns a list of available course filters as options
 */
export const getAvailableCourseFiltersAsOptions = (): Promise<SelectOption[]> =>
    getAvailableCourseFilters().then(filters =>
        filters
            .map<SelectOption>(filter => ({
                key: JSON.stringify(filter),
                title: filter.name,
            }))
            // add a sync option as first item
            .toSpliced(0, 0, '_sync')
    );

/**
 * Gets the currently active course filter / grouping from the myCourses page.
 * @returns the active course filter
 */
export const getActiveFilter = async (): Promise<CourseFilter | null> => {
    if (activeFilter) return activeFilter;

    const cachedFilter = getCachedCourseFilter();
    if (cachedFilter) return cachedFilter;

    await getAvailableCourseFilters(false); // force fetch to ensure active filter gets updated
    return activeFilter;
};

const activeFilterChangedHooks = new Set<(current: CourseFilter) => void>();

/**
 * Adds a hook to execute when the active filter has been updated
 * @param callback - the method to execute
 * @returns void
 */
export const onActiveFilterChanged = (
    callback: (current: CourseFilter) => void
) => activeFilterChangedHooks.add(callback);

const updateActiveFilterChannelName = PREFIX('myCourses-update-active-filter');

// listen to changes to the filter to update our "activeFilter" property
const channel = new BroadcastChannel(updateActiveFilterChannelName);
channel.addEventListener('message', ({ data }: MessageEvent<CourseFilter>) => {
    activeFilter = data;
    activeFilterChangedHooks.forEach(hook => hook(data));
});

// send an update message if on the myCourses page
if (window.location.pathname === '/my/courses.php') {
    void require([
        'jquery',
        'block_myoverview/selectors',
        'core/custom_interaction_events',
    ] as const).then(([jquery, selectors, events]) =>
        // as long as moodle uses jQuery there seems to be no way to do it whithout jQuery
        jquery('.block-myoverview')
            ?.find(selectors.FILTERS)
            ?.on(
                events.events.activate,
                selectors.FILTER_OPTION,
                ({ target }) => {
                    if (!target || !(target instanceof HTMLElement)) return;
                    const filter = getFilterFromEl(
                        target,
                        document.querySelector<HTMLElement>(
                            selectors.courseView.region
                        )?.dataset.customfieldname ?? '',
                        true
                    );

                    // Trigger local hooks first
                    activeFilterChangedHooks.forEach(hook => hook(filter));

                    // Then broadcast to other tabs
                    const channel = new BroadcastChannel(
                        updateActiveFilterChannelName
                    );
                    channel.postMessage(filter);
                    channel.close();
                }
            )
    );
}
