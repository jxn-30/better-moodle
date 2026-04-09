import { CourseFilter } from './myCourses';
import { PREFIX } from './helpers';
import { SelectSetting } from './Settings/SelectSetting';
import BlockMyOverviewRepository, {
    Course,
} from '#types/require.js/block/myoverview/repository.js';

interface CachedCourseData {
    courses: Course[];
    timestamp: number;
}

const CACHED_COURSES_KEY = 'navbar-dropdown-courses';
const CACHED_COURSE_FILTER_KEY = 'navbar-dropdown-last-filter';
const CACHED_COURSE_FILTERS_KEY = 'navbar-dropdown-filters';

/**
 * Gets cached course data from localStorage
 * @returns The cached courses or null if not found/expired
 */
export const getCachedCourses = (): Course[] | null => {
    try {
        const cacheKey = PREFIX(CACHED_COURSES_KEY);
        const cached = localStorage.getItem(cacheKey);
        if (!cached) return null;

        const data = JSON.parse(cached) as CachedCourseData;
        const maxAge = 10 * 60 * 1000; // Keep cache for max. 10 min
        if (Date.now() - data.timestamp < maxAge) {
            return data.courses;
        } else {
            localStorage.removeItem(cacheKey);
        }
    } catch (e) {
        console.error('Error reading cached courses:', e);
    }

    return null;
};

/**
 * Stores course data in localStorage
 * @param courses - The courses to cache
 */
export const setCachedCourses = (courses: Course[]): void => {
    try {
        const cacheKey = PREFIX(CACHED_COURSES_KEY);
        const data: CachedCourseData = { courses, timestamp: Date.now() };
        localStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (e) {
        console.error('Error caching courses:', e);
    }
};

/**
 * Gets the last active filter from cache
 * @returns The cached filter or null if not found
 */
export const getCachedCourseFilter = (): CourseFilter | null => {
    try {
        const cacheKey = PREFIX(CACHED_COURSE_FILTER_KEY);
        const cached = localStorage.getItem(cacheKey);
        if (!cached) return null;
        return JSON.parse(cached) as CourseFilter;
    } catch (e) {
        console.error('Error reading last active filter:', e);
        return null;
    }
};

/**
 * Stores the last active filter in cache
 * @param activeFilter - The filter to cache
 */
export const setCachedCourseFilter = (activeFilter: CourseFilter): void => {
    try {
        const cacheKey = PREFIX(CACHED_COURSE_FILTER_KEY);
        localStorage.setItem(cacheKey, JSON.stringify(activeFilter));
    } catch (e) {
        console.error('Error caching last active filter:', e);
    }
};

/**
 * Gets the last active filter from cache
 * @returns The cached filter or null if not found
 */
export const getCachedCourseFilters = (): CourseFilter[] | null => {
    try {
        const cacheKey = PREFIX(CACHED_COURSE_FILTERS_KEY);
        const cached = localStorage.getItem(cacheKey);
        if (!cached) return null;
        return JSON.parse(cached) as CourseFilter[];
    } catch (e) {
        console.error('Error reading course filters:', e);
        return null;
    }
};

/**
 * Stores the last active filter in cache
 * @param filters - The filters to cache
 */
export const setCachedCourseFilters = (filters: CourseFilter[]): void => {
    try {
        const cacheKey = PREFIX(CACHED_COURSE_FILTERS_KEY);
        localStorage.setItem(cacheKey, JSON.stringify(filters));
    } catch (e) {
        console.error('Error caching course filters:', e);
    }
};

/**
 * Clears the cached courses
 */
export const clearCachedCourses = (): void => {
    try {
        const cacheKey = PREFIX(CACHED_COURSES_KEY);
        localStorage.removeItem(cacheKey);
    } catch (e) {
        console.error('Error clearing cached courses:', e);
    }
};

/**
 * Fetch and cache a list of courses
 * @param courses - Base courses
 * @param filter - Base filter setting
 * @param activeFilter - Currently active filter
 * @param writeToCache - If true, the fetched filters and courses will be cached in local storage
 * @returns Promise for the list of filtered courses
 */
export const fetchCourses = (
    courses: BlockMyOverviewRepository,
    filter: SelectSetting,
    activeFilter: CourseFilter,
    writeToCache = true
) =>
    courses
        .getEnrolledCoursesByTimeline({
            classification: activeFilter.classification,
            customfieldname: activeFilter.customfieldname,
            customfieldvalue: activeFilter.customfieldvalue,
            limit: 0,
            offset: 0,
            sort: 'shortname',
        })
        .then(({ courses }) => {
            if (!writeToCache) return courses;
            console.log(`Fetched ${courses.length} courses`);

            setCachedCourses(courses);
            if (filter.value === '_sync') {
                setCachedCourseFilter(activeFilter);
            }

            return courses;
        });
