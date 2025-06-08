import { BooleanSetting } from '@/Settings/BooleanSetting';
import { datetimeToString } from '@/localeString';
import Feature from '@/Feature';
import { type Locales } from '../../i18n/i18n-types';
import { marquee } from './index';
import { Modal } from '@/Modal';
import { SliderSetting } from '@/Settings/SliderSetting';
import style from './eventAdvertisements.module.scss';
import { BETTER_MOODLE_LANG, LLF } from 'i18n';
import { cachedRequest, type CachedResponse, icsUrl } from '@/network';
import { FIVE_MINUTES, ONE_DAY } from '@/times';

const LL = LLF('navbarMarquee', 'eventAdvertisements');

const enabled = new BooleanSetting('enabled', true).addAlias(
    'general.eventAdvertisements'
);
const noticeTime = new SliderSetting('noticeTime', 14, {
    min: 1,
    max: 33,
    step: 1,
    labels: 5,
}).disabledIf(enabled, '!=', true);

interface Event {
    start: string;
    end: string;
    startDateOnly: boolean;
    endDateOnly: boolean;
    desc: string;
    name: Record<Locales, string>;
    location?: string;
    url?: string;
    rruleString?: Record<Locales, string>;
}

const spans = new Map<HTMLSpanElement, Event>();

let events: Event[];

/**
 * Fetches the parsed events from the calendar or uses the stored version if they have already been fetched since the last page load
 * @returns the parsed semesterzeiten
 */
const getEvents = () =>
    events ?
        Promise.resolve(events)
    :   cachedRequest(icsUrl('events'), FIVE_MINUTES, 'json').then(
            ({ value }: CachedResponse<Event[]>) => (events = value)
        );

/**
 * Removes all spans from the marquee and clears the span map
 */
const removeAll = () => {
    spans.keys().forEach(span => marquee.remove(span));
    spans.clear();
};

/**
 * Creates a span that is to be added to the marquee and adds the relevant event listener.
 * @param event - the event this span shows data of
 * @returns the created span
 */
const createEventSpan = (event: Event) => {
    const span = (
        <span className={style.eventAdvertisement}>
            {datetimeToString(new Date(event.start), true, false)}
            {`: ${event.name[BETTER_MOODLE_LANG]}`}
        </span>
    ) as HTMLSpanElement;

    spans.set(span, event);

    span.addEventListener('click', e => {
        e.preventDefault();
        const table = (
            <table className="table table-striped table-hover m-0">
                <tbody>
                    <tr>
                        <th>{LL.start()}:</th>
                        <td>{datetimeToString(new Date(event.start))}</td>
                    </tr>
                    <tr>
                        <th>{LL.end()}:</th>
                        <td>{datetimeToString(new Date(event.end))}</td>
                    </tr>
                    {event.rruleString ?
                        <tr>
                            <th>{LL.rrule()}:</th>
                            <td>{event.rruleString[BETTER_MOODLE_LANG]}</td>
                        </tr>
                    :   null}
                    {event.location ?
                        <tr>
                            <th>{LL.location()}:</th>
                            <td>{event.location}</td>
                        </tr>
                    :   null}
                    <tr>
                        <td colSpan={2}>{event.desc}</td>
                    </tr>
                </tbody>
            </table>
        );

        new Modal({
            type: 'ALERT',
            scrollable: true,
            title: event.name[BETTER_MOODLE_LANG],
            body: table,
            bodyClass: ['table-responsive', 'p-0'],
            footer:
                event.url ?
                    <a className="w-100" href={event.url} target="_blank">
                        {event.url}
                    </a>
                :   undefined,
            removeOnClose: true,
        }).show();
    });
    return span;
};

/**
 * Triggers creating or removing the spans to/from the marquee
 */
const reload = async () => {
    if (enabled.value) {
        const noticeTimeMs = noticeTime.value * ONE_DAY;
        const events = await getEvents();
        removeAll();
        events.forEach(event => {
            if (new Date(event.start).getTime() <= Date.now() + noticeTimeMs) {
                marquee.add(createEventSpan(event));
            }
        });
    } else removeAll();
};

enabled.onInput(() => void reload());
noticeTime.onInput(() => void reload());

export default Feature.register({
    settings: new Set([enabled, noticeTime]),
    onload: reload,
    onunload: reload,
});
