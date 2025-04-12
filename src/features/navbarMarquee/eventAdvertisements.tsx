import { BooleanSetting } from '@/Settings/BooleanSetting';
import { datetimeToString } from '@/localeString';
import Feature from '@/Feature';
import { type Locales } from '../../i18n/i18n-types';
import { marquee } from './index';
import { Modal } from '@/Modal';
import style from './eventAdvertisements.module.scss';
import { BETTER_MOODLE_LANG, LL } from 'i18n';
import { icsUrl, request } from '@/network';

const enabled = new BooleanSetting('enabled', true).addAlias(
    'general.eventAdvertisements'
);

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
 *
 */
const getEvents = () =>
    events ?
        Promise.resolve(events)
    :   request(icsUrl('events'))
            .then<Event[]>(res => res.json())
            .then(e => (events = e));

/**
 *
 */
const removeAll = () => {
    spans.keys().forEach(span => marquee.remove(span));
    spans.clear();
};

/**
 * @param event
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
                        <th>
                            {LL.features.navbarMarquee.features.eventAdvertisements.start()}
                            :
                        </th>
                        <td>{datetimeToString(new Date(event.start))}</td>
                    </tr>
                    <tr>
                        <th>
                            {LL.features.navbarMarquee.features.eventAdvertisements.end()}
                            :
                        </th>
                        <td>{datetimeToString(new Date(event.end))}</td>
                    </tr>
                    {event.rruleString ?
                        <tr>
                            <th>
                                {LL.features.navbarMarquee.features.eventAdvertisements.rrule()}
                                :
                            </th>
                            <td>{event.rruleString[BETTER_MOODLE_LANG]}</td>
                        </tr>
                    :   null}
                    {event.location ?
                        <tr>
                            <th>
                                {LL.features.navbarMarquee.features.eventAdvertisements.location()}
                                :
                            </th>
                            <td>{event.location}</td>
                        </tr>
                    :   null}
                    <tr>
                        <td colSpan={2}>{event.desc}</td>
                    </tr>
                </tbody>
            </table>
        );

        const modal = new Modal({
            type: 'ALERT',
            scrollable: true,
            title: event.name[BETTER_MOODLE_LANG],
            body: table,
            footer:
                event.url ?
                    <a className="w-100" href={event.url} target="_blank">
                        {event.url}
                    </a>
                :   undefined,
            removeOnClose: true,
        });

        void modal
            .getBody()
            .then(([body]) => body.classList.add('table-responsive', 'p-0'));

        modal.show();
    });
    return span;
};

/**
 *
 */
const reload = async () => {
    if (enabled.value) {
        const events = await getEvents();
        removeAll();
        events.forEach(event => {
            // only create if start is less than 2 weeks from now
            if (
                new Date(event.start).getTime() <=
                Date.now() + 14 * 24 * 60 * 60 * 1000
            ) {
                marquee.add(createEventSpan(event));
            }
        });
    } else removeAll();
};

enabled.onInput(() => void reload());

export default Feature.register({
    settings: new Set([enabled]),
    onload: reload,
    onunload: reload,
});
