import { getDocument } from './network';
import { requirePromise } from './require.js';
import { SelectOption } from './Components';

export interface CourseFilter {
    classification: string;
    customfieldname: string;
    customfieldvalue: string;
    active?: boolean;
    name: string;
}

const availableFilters: CourseFilter[] = [];
let activeFilter: CourseFilter | null = null;

/**
 * Gets all available course filters / groupings from the myCourses page.
 * @returns a list of available course filters
 */
export const getAvailableCourseFilters = async (): Promise<CourseFilter[]> => {
    if (availableFilters.length) return availableFilters;

    // TODO is there a better check to see if we're logged in?
    if (window.location.pathname.startsWith('/login')) {
        return [];
    }

    const result0 = await Promise.all([
        requirePromise(['block_myoverview/selectors'] as const),
        getDocument('/my/courses.php'),
    ]);
    const [[selectors], doc] = result0;
    const customfieldname =
        doc.querySelector<HTMLElement>(selectors.courseView.region)?.dataset
            .customfieldname ?? '';
    const filters = Array.from(
        doc.querySelectorAll<HTMLAnchorElement>(
            '#groupingdropdown + .dropdown-menu [data-filter="grouping"]'
        )
    ).map(filterEl => {
        const active = filterEl.ariaCurrent === 'true';
        const filter = {
            classification: filterEl.dataset.pref ?? '',
            customfieldname,
            customfieldvalue: filterEl.dataset.customfieldvalue ?? '',
            active: filterEl.ariaCurrent === 'true',
            name: filterEl.textContent?.trim() ?? '',
        };
        if (active) activeFilter = filter;
        return filter;
    });
    availableFilters.splice(0, availableFilters.length, ...filters);
    return availableFilters;
};

/**
 * Gets all available course filters / groupings from the myCourses page as options for select elements.
 * @returns a list of available course filters as options
 */
export const getAvailableCourseFiltersAsOptions = (): Promise<SelectOption[]> =>
    getAvailableCourseFilters().then(filters =>
        filters
            .map<SelectOption>(filter => {
                delete filter.active;
                return {
                    key: JSON.stringify(filter),
                    title: filter.name,
                };
            })
            // add a sync option as first item
            .toSpliced(0, 0, '_sync')
    );

/**
 * Gets the currently active course filter / grouping from the myCourses page.
 * @returns the active course filter
 */
export const getActiveFilter = () => activeFilter;
