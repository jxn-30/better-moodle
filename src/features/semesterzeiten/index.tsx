import Block from '@/Block';
import { BooleanSetting } from '@/Settings/BooleanSetting';
import classnames from 'classnames';
import FeatureGroup from '@/FeatureGroup';
import { type Locales } from '../../i18n/i18n-types';
import style from './style.module.scss';
import { Switch } from '@/Components';
import { BETTER_MOODLE_LANG, LLFG } from 'i18n';
import { cachedRequest, type CachedResponse, icsUrl } from '@/network';
import { dateToString, percent } from '@/localeString';
import { domID, isDashboard } from '@/helpers';
import { getHtml, getLoadingSpinner, ready } from '@/DOM';
import { ONE_DAY, ONE_MINUTE } from '@/times';

const LL = LLFG('semesterzeiten');

const hiddenBarsKey = 'semesterzeiten.hiddenBars';
const hiddenBars = new Set<string>(GM_getValue<string[]>(hiddenBarsKey, []));

// Remove the old storage keys. Migration is not done here as event types may have significantly changed.
GM_listValues().forEach(key => {
    if (key.startsWith('better-moodle-semesterzeiten.show.')) {
        GM_deleteValue(key);
    }
});

const blockSetting = new BooleanSetting('block', false).addAlias(
    'general.semesterzeiten'
);

const block = new Block('semesterzeiten', true).setTitle(LL.name());

interface Event {
    start: string;
    end: string;
    startDateOnly: boolean;
    endDateOnly: boolean;
    type: string;
    color: string;
    name: Record<Locales, string>;
}

interface Semester extends Omit<Event, 'color'> {
    events: Event[];
}

type Semesterzeiten = Semester[];

const hoverStyle = document.createElement('style');
/**
 * Updates the style for hovering, based on currently existing event types.
 */
const updateHoverStyle = () => {
    if (!semesterzeiten) return;

    const allEventTypes = new Set<string>(['semester']);
    semesterzeiten.forEach(({ events }) =>
        events.forEach(({ type }) => allEventTypes.add(type))
    );

    const tableSelectors = allEventTypes
        .values()
        .map(
            type =>
                `#${block.element?.id}:has(.progress-bar:hover [data-type="${type}"]) tr[data-type="${type}"] td`
        )
        .toArray();
    const barSelectors = allEventTypes
        .values()
        .map(
            type =>
                `#${block.element?.id}:has(tr[data-type="${type}"]:hover) .progress-bar [data-type="${type}"]`
        )
        .toArray();

    hoverStyle.textContent = `
${tableSelectors.join(',\n')} {
    filter: brightness(1.2);
    font-weight: bold;
}
${barSelectors.join(',\n')} {
    filter: brightness(1.5);
}`.trim();
};

let semesterzeiten: Semesterzeiten;
/**
 * Fetches the parsed semesterzeiten from the calendar or uses the stored version if they have already been fetched since the last page load
 * @returns the parsed semesterzeiten
 */
const getSemesterzeiten = () =>
    semesterzeiten ?
        Promise.resolve(semesterzeiten)
    :   cachedRequest(icsUrl('semesterzeiten'), ONE_DAY, 'json').then(
            ({ value: zeiten }: CachedResponse<Semesterzeiten>) => {
                semesterzeiten = zeiten;
                updateHoverStyle();
                return semesterzeiten;
            }
        );

const todaySpan = (
    <span className={style.todaySpan}>{dateToString()}</span>
) as HTMLSpanElement;
const toggleTableBtn = (
    <button
        className={classnames('btn btn-link btn-sm p-0', style.tableToggle)}
    >
        <i className="icon fa fa-info-circle mr-0"></i>
    </button>
) as HTMLButtonElement;
const progressBar = (
    <div className="progress w-100 position-relative"></div>
) as HTMLDivElement;

const prevSemesterBtn = (
    <li className="page-item">
        <button className="page-link">
            <span className="icon-no-margin">
                <i className="icon fa fa-chevron-left fa-fw"></i>
            </span>
        </button>
    </li>
) as HTMLLIElement;
const nextSemesterBtn = (
    <li className="page-item">
        <button className="page-link">
            <span className="icon-no-margin">
                <i className="icon fa fa-chevron-right fa-fw"></i>
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
    <table className="table table-hover hidden">
        <thead>
            <tr>
                <th>{LL.table.name()}</th>
                <th>{LL.table.start()}</th>
                <th>{LL.table.end()}</th>
                <th>{LL.table.progress()}</th>
                <th>{LL.table.show()}</th>
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
    if (event.startDateOnly) {
        start.setTime(start.getTime() + start.getTimezoneOffset() * ONE_MINUTE);
    }
    const end = new Date(event.end);
    if (event.endDateOnly) {
        end.setTime(end.getTime() + end.getTimezoneOffset() * ONE_MINUTE);
    }
    const duration = end.getTime() - start.getTime();
    const passed = Date.now() - start.getTime();
    const progress = Math.max(0, Math.min(passed / duration, 1));
    return { start, end, duration, progress };
};

let currentSemester = 0;

/**
 * Loads the content of a progress bar
 * @param semester - the semester to load the content for
 * @param currentSemester - wether this is the current semester and an overlay needs to be added
 */
const loadProgressBar = (semester: Semester, currentSemester: boolean) => {
    const {
        start: semesterStart,
        end: semesterEnd,
        duration: semesterDuration,
    } = getEventDates(semester);

    const stops = new Map<
        Date,
        Record<'start' | 'end', Set<Semester | Event>>
    >();

    stops.set(semesterStart, {
        start: new Set<Semester | Event>([semester]),
        end: new Set<Semester | Event>(),
    });
    stops.set(semesterEnd, {
        start: new Set<Semester | Event>(),
        end: new Set<Semester | Event>([semester]),
    });

    semester.events.forEach(event => {
        const { start, end } = getEventDates(event);

        if (!hiddenBars.has(event.type)) {
            const normalizedStart =
                start > semesterStart ? start : semesterStart;
            const normalizedEnd = end < semesterEnd ? end : semesterEnd;

            const startStop = stops.get(normalizedStart) ?? {
                start: new Set<Semester | Event>(),
                end: new Set<Semester | Event>(),
            };
            const endStop = stops.get(normalizedEnd) ?? {
                start: new Set<Semester | Event>(),
                end: new Set<Semester | Event>(),
            };

            startStop.start.add(event);
            endStop.end.add(event);

            stops.set(normalizedStart, startStop);
            stops.set(normalizedEnd, endStop);
        }
    });

    progressBar.replaceChildren();

    const currentEvents = new Set<Semester | Event>();
    const stopDates = Array.from(stops.keys()).toSorted(
        (a, b) => a.getTime() - b.getTime()
    );
    stopDates.forEach((date, index) => {
        // Do not iterate over the last stop
        if (index === stops.size - 1) return;

        // see the ! at the end? this tells TS that we're sure, this will not be null
        const { start: starts, end: ends } = stops.get(date)!;
        starts.forEach(event => currentEvents.add(event));
        ends.forEach(event => currentEvents.delete(event));

        const startPercentage =
            (date.getTime() - semesterStart.getTime()) / semesterDuration;
        const endPercentage =
            (stopDates[index + 1].getTime() - semesterStart.getTime()) /
            semesterDuration;
        const width = (endPercentage - startPercentage) * 100;

        const title = <></>;
        const bar = (
            <div
                className="progress-bar"
                style={{ width: `${width}%` }}
                data-toggle="tooltip"
                data-placement="bottom"
                data-html="true"
            ></div>
        );

        currentEvents.forEach(event => {
            const { start, end } = getEventDates(event);
            const color = 'color' in event ? event.color : 'primary';

            title.append(
                <p>
                    <b className={`text-${color}`}>
                        {event.name[BETTER_MOODLE_LANG]}
                    </b>
                    <br />
                    {event.type.startsWith('holiday-') ?
                        dateToString(start)
                    :   <>
                            {dateToString(start)}
                            &nbsp;-&nbsp;
                            {dateToString(end)}
                        </>
                    }
                </p>
            );
            bar.append(
                <div
                    data-type={event.type}
                    className={classnames(
                        'progress-bar w-100, h-100',
                        `bg-${color}`
                    )}
                ></div>
            );
        });

        bar.dataset.originalTitle = getHtml(title);

        progressBar.append(bar);
    });

    if (currentSemester) {
        progressBar.append(
            <div
                className={classnames(
                    'progress-bar bg-transparent progress-bar-striped',
                    style.progressOverlayBar
                )}
            ></div>
        );
    }
};

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

    void getSemesterzeiten()
        .then(zeiten => {
            currentSemester = Math.max(
                0,
                Math.min(zeiten.length - 1, currentSemester)
            );
            return [zeiten[currentSemester], zeiten.length] as const;
        })
        .then(([semester, semesterCount]) => {
            contentLoaded = true;

            const {
                start: semesterStart,
                end: semesterEnd,
                progress: semesterProgress,
            } = getEventDates(semester);

            prevSemesterBtn.classList.toggle('disabled', currentSemester === 0);
            nextSemesterBtn.classList.toggle(
                'disabled',
                currentSemester === semesterCount - 1
            );

            tableBody.replaceChildren(
                <tr
                    className="table-primary font-weight-bold"
                    data-type="semester"
                >
                    <td>{semester.name[BETTER_MOODLE_LANG]}</td>
                    <td>{dateToString(semesterStart)}</td>
                    <td>{dateToString(semesterEnd)}</td>
                    <td>{percent(semesterProgress)}</td>
                    <td className="p-0 px-md-3 align-middle">
                        <nav>
                            <ul className="pagination mb-0 flex-nowrap justify-content-center justify-content-md-end">
                                {prevSemesterBtn}
                                {nextSemesterBtn}
                            </ul>
                        </nav>
                    </td>
                </tr>
            );

            type SwitchComponent = ReturnType<typeof Switch>;

            const switches = new Map<string, Set<SwitchComponent>>();

            semester.events.forEach(event => {
                const { start, end, progress } = getEventDates(event);

                const toggle = (
                    <Switch
                        id={domID(
                            `semesterzeiten-toggle-${currentSemester}-${event.type}`
                        )}
                        value={!hiddenBars.has(event.type)}
                    />
                ) as SwitchComponent;
                if (!switches.has(event.type)) {
                    switches.set(event.type, new Set<SwitchComponent>());
                }
                switches.get(event.type)?.add(toggle);
                toggle.addEventListener('input', () => {
                    if (toggle.value) {
                        hiddenBars.delete(event.type);
                    } else {
                        hiddenBars.add(event.type);
                    }
                    switches
                        .get(event.type)
                        ?.forEach(t => (t.value = toggle.value));
                    GM_setValue(hiddenBarsKey, Array.from(hiddenBars));
                    loadProgressBar(semester, currentSemester === 0);
                });
                if (event.type.startsWith('holiday-')) {
                    tableBody.append(
                        <tr
                            className={`table-${event.color}`}
                            data-type={event.type}
                        >
                            <td colSpan={4}>
                                {/* The strings are explicit here, to avoid trimming */}
                                {LL.publicHoliday()}
                                {': '}
                                {event.name[BETTER_MOODLE_LANG]}
                                {' ('}
                                {dateToString(start, true, true)}
                                {')'}
                            </td>
                            <td>{toggle}</td>
                        </tr>
                    );
                } else {
                    tableBody.append(
                        <tr
                            className={`table-${event.color}`}
                            data-type={event.type}
                        >
                            <td>{event.name[BETTER_MOODLE_LANG]}</td>
                            <td>{dateToString(start)}</td>
                            <td>{dateToString(end)}</td>
                            <td>{percent(progress)}</td>
                            <td>{toggle}</td>
                        </tr>
                    );
                }
            });

            loadProgressBar(semester, currentSemester === 0);

            if (currentSemester === 0) {
                block.element?.style.setProperty(
                    '--progress-percent',
                    semesterProgress.toString()
                );
            }

            block.setContent(
                <>
                    {currentSemester === 0 ?
                        <div className="position-relative">{todaySpan}</div>
                    :   <></>}
                    <div className="d-flex align-items-center">
                        {toggleTableBtn}
                        {progressBar}
                    </div>
                    <div className="table-responsive">{table}</div>
                </>,
                false
            );
        });
};

/**
 * Adds or removes the block, depending on the settings state.
 * Also loads the content for the block if it has been added to the DOM.
 */
const reload = async () => {
    if (isDashboard && blockSetting.value) {
        await ready();
        const region = document.getElementById('block-region-content');
        if (!region) return;
        if (!block.rendered) await block.create(region, 'prepend');
        else block.put(region, 'prepend');
        document.head.append(hoverStyle);
        void loadContent();
    } else {
        block?.remove();
        hoverStyle.remove();
    }
};

blockSetting.onInput(() => void reload());

export default FeatureGroup.register({
    settings: new Set([blockSetting]),
    onload: reload,
    onunload: reload,
});
