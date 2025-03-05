import Block from '@/Block';
import { BooleanSetting } from '@/Settings/BooleanSetting';
import classnames from 'classnames';
import FeatureGroup from '@/FeatureGroup';
import { isDashboard } from '@/helpers';
import { type Locales } from '../../i18n/i18n-types';
import { request } from '@/network';
import style from './style.module.scss';
import { BETTER_MOODLE_LANG, LL } from 'i18n';
import { dateToString, percent } from '@/localeString';
import { getLoadingSpinner, ready } from '@/DOM';

const blockSetting = new BooleanSetting('block', false);

const block = new Block('semesterzeiten', true).setTitle(
    LL.features.semesterzeiten.name()
);

interface Event {
    start: string;
    end: string;
    type: string;
    color: string;
    name: Record<Locales, string>;
}

interface Semester extends Omit<Event, 'color'> {
    events: Event[];
}

type Semesterzeiten = Semester[];

let semesterzeiten: Semesterzeiten;
/**
 * Fetches the parsed semesterzeiten from the calendar or uses the stored version if they have already been fetched since the last page load
 * @returns the parsed semesterzeiten
 */
const getSemesterzeiten = () =>
    semesterzeiten ?
        Promise.resolve(semesterzeiten)
    :   request(`https://ics.better-moodle.dev/semesterzeiten/${__UNI__}`)
            .then<Semesterzeiten>(res => res.json())
            .then(zeiten => (semesterzeiten = zeiten));

const todaySpan = (
    <span class={style.todaySpan}>{dateToString()}</span>
) as HTMLSpanElement;
const toggleTableBtn = (
    <button class={classnames('btn btn-link btn-sm p-0', style.tableToggle)}>
        <i class="icon fa fa-info-circle mr-0"></i>
    </button>
) as HTMLButtonElement;
const progressBar = (
    <div class="progress w-100 position-relative"></div>
) as HTMLDivElement;

const prevSemesterBtn = (
    <li class="page-item">
        <button class="page-link">
            <span class="icon-no-margin">
                <i class="icon fa fa-chevron-left fa-fw"></i>
            </span>
        </button>
    </li>
) as HTMLLIElement;
const nextSemesterBtn = (
    <li class="page-item">
        <button class="page-link">
            <span class="icon-no-margin">
                <i class="icon fa fa-chevron-right fa-fw"></i>
            </span>
        </button>
    </li>
) as HTMLLIElement;

prevSemesterBtn.addEventListener('click', () =>
    loadContent(currentSemester - 1)
);
nextSemesterBtn.addEventListener('click', () =>
    loadContent(currentSemester + 1)
);

const tableBody = (<tbody></tbody>) as HTMLTableSectionElement;

const table = (
    <table class="table table-striped table-hover hidden">
        <thead>
            <tr>
                <th>{LL.features.semesterzeiten.table.name()}</th>
                <th>{LL.features.semesterzeiten.table.start()}</th>
                <th>{LL.features.semesterzeiten.table.end()}</th>
                <th>{LL.features.semesterzeiten.table.progress()}</th>
                <th>{LL.features.semesterzeiten.table.show()}</th>
            </tr>
        </thead>
        {tableBody}
    </table>
) as HTMLTableElement;

toggleTableBtn.addEventListener('click', () =>
    table.classList.toggle('hidden')
);

/**
 * Parses the start and end date of an event or semester and calculates how much it already progressed
 * @param event - the event to get the date information of
 * @returns the parsed dates and the progress
 */
const getEventDates = (event: Event | Semester) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const duration = end.getTime() - start.getTime();
    const passed = Date.now() - start.getTime();
    const progress = Math.max(0, Math.min(passed / duration, 1));
    return { start, end, progress };
};

let currentSemester = 0;

/**
 * Loads the block content for a specific semester.
 * @param semesterIndex - the position of the semester in the list of semesters
 */
const loadContent = (semesterIndex = 0) => {
    currentSemester = semesterIndex;
    let contentLoaded = false;
    // Show the loading spinner if this is the initial load
    if (semesterzeiten === void 0) {
        // TODO: Do not create a new loadingSpinner but reuse the old one?
        void getLoadingSpinner().then(spinner => {
            spinner.classList.add('text-center');
            if (!contentLoaded) {
                block.setContent(spinner, false);
            }
        });
    }

    void getSemesterzeiten().then(
        ({ [semesterIndex]: semester, length: semesterCount }) => {
            contentLoaded = true;

            prevSemesterBtn.classList.toggle('disabled', semesterIndex === 0);
            nextSemesterBtn.classList.toggle(
                'disabled',
                semesterIndex === semesterCount - 1
            );

            const {
                start: semesterStart,
                end: semesterEnd,
                progress: semesterProgress,
            } = getEventDates(semester);

            progressBar.replaceChildren();

            if (semesterIndex === 0) {
                block.element?.style.setProperty(
                    '--progress-percent',
                    semesterProgress.toString()
                );

                progressBar.append(
                    <div
                        class={classnames(
                            'progress-bar bg-transparent progress-bar-striped',
                            style.progressOverlayBar
                        )}
                    ></div>
                );
            }

            tableBody.replaceChildren(
                <tr class="table-primary font-weight-bold">
                    <td>{semester.name[BETTER_MOODLE_LANG]}</td>
                    <td>{dateToString(semesterStart)}</td>
                    <td>{dateToString(semesterEnd)}</td>
                    <td>{percent(semesterProgress)}</td>
                    <td class="p-0 px-md-3 align-middle">
                        <nav>
                            <ul class="pagination mb-0 flex-nowrap justify-content-center justify-content-md-end">
                                {prevSemesterBtn}
                                {nextSemesterBtn}
                            </ul>
                        </nav>
                    </td>
                </tr>,
                ...semester.events.map(event => {
                    const { start, end, progress } = getEventDates(event);
                    if (event.type.startsWith('holiday-')) {
                        return (
                            <tr class={`table-${event.color}`}>
                                <td>
                                    {/* The strings are explicit here, to avoid trimming */}
                                    {LL.features.semesterzeiten.publicHoliday()}
                                    {': '}
                                    {event.name[BETTER_MOODLE_LANG]}
                                    {' ('}
                                    {dateToString(start, true, true)}
                                    {')'}
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>Toggl :)</td>
                            </tr>
                        );
                    }
                    return (
                        <tr class={`table-${event.color}`}>
                            <td>{event.name[BETTER_MOODLE_LANG]}</td>
                            <td>{dateToString(start)}</td>
                            <td>{dateToString(end)}</td>
                            <td>{percent(progress)}</td>
                            <td>Toggl :)</td>
                        </tr>
                    );
                })
            );

            block.setContent(
                <>
                    {semesterIndex === 0 ?
                        <div class="position-relative">{todaySpan}</div>
                    :   <></>}
                    <div class="d-flex align-items-center">
                        {toggleTableBtn}
                        {progressBar}
                    </div>
                    <div class="table-responsive">{table}</div>
                </>,
                false
            );
        }
    );
};

/**
 * Adds or removes the block, depending on the settings state.
 * Also loads the content for the block if it has been added to the DOM.
 */
const onload = async () => {
    if (isDashboard && blockSetting.value) {
        await ready();
        const region = document.getElementById('block-region-content');
        if (!region) return;
        if (!block.rendered) await block.create(region, 'prepend');
        else block.put(region, 'prepend');
        void loadContent();
    } else {
        block?.remove();
    }
};

blockSetting.onInput(() => void onload());

/**
 * Removes the block form the DOM
 */
const onunload = () => {
    block?.remove();
};

export default FeatureGroup.register({
    settings: new Set([blockSetting]),
    onload,
    onunload,
});
