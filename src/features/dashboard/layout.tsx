import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import { getLoadingSpinner } from '@/DOM';
import { LL } from '../../i18n/i18n';
import { requirePromise } from '@/require.js';
import Drawer, { Side } from '@/Drawer';
import {
    getActiveFilter,
    getAvailableCourseFilters,
    onActiveFilterChanged,
} from '@/myCourses';
import { isDashboard, isLoggedIn } from '@/helpers';

const coursesSidebarEnabled = new BooleanSetting(
    'coursesSidebar',
    true
).requireReload();
// TODO: Alias
const favouriteCoursesAtTop = new BooleanSetting('favouriteCoursesAtTop', true);
const rightSidebarEnabled = new BooleanSetting(
    'rightSidebar',
    true
).requireReload();

// const courseFilter = '_sync';

/**
 * Loads the content of the courses sidebar and shows a loading spinner meanwhile
 * @param drawer - the Drawer to add the course content to
 */
const loadCourseContent = (drawer: Drawer) => {
    let contentLoaded = false;
    // TODO: Do not create a new loadingSpinner but reuse the old one?
    void getLoadingSpinner().then(spinner => {
        spinner.classList.add('text-center');
        if (!contentLoaded) {
            drawer.setContent(spinner);
        }
    });

    void Promise.all([
        getAvailableCourseFilters().then(getActiveFilter),
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
                        <span className="text-muted text-center">
                            {LL.features.dashboard.features.layout.myCourses.empty()}
                        </span>
                    ) as HTMLSpanElement
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
                (<>{...courseCards}</>) as DocumentFragment
            );
        });
};

/**
 * Creates and instantiates the drawers.
 */
const onload = () => {
    if (!isDashboard || !isLoggedIn) return;
    if (coursesSidebarEnabled.value) {
        void new Drawer('dashboard-courses')
            .setSide(Side.Left)
            .setIcon('graduation-cap')
            .setHeading(
                (
                    <>
                        <a class="w-100 text-center" href="/my/courses.php">
                            {LL.features.dashboard.features.layout.myCourses.title()}
                        </a>
                    </>
                ) as DocumentFragment
            )
            .create()
            .then(drawer => {
                void loadCourseContent(drawer);
                favouriteCoursesAtTop.onInput(() => loadCourseContent(drawer));
                onActiveFilterChanged(() => loadCourseContent(drawer));
            });
    }
    if (rightSidebarEnabled.value) {
        void new Drawer('dashboard-right')
            .setSide(Side.Right)
            .setIcon('calendar')
            .create();
    }
};

export default Feature.register({
    settings: new Set([
        coursesSidebarEnabled,
        favouriteCoursesAtTop,
        rightSidebarEnabled,
    ]),
    onload,
});
