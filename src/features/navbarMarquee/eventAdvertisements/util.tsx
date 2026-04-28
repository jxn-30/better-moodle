import { type Event } from '../eventAdvertisements';
import { FIVE_MINUTES } from '#lib/times';
import { Modal } from '#lib/Modal';
import { BETTER_MOODLE_LANG, LLF } from '#i18n';
import { cachedRequest, type CachedResponse, icsUrl } from '#lib/network';
import { datetimeToString, dateToString } from '#lib/localeString';

const LL = LLF('navbarMarquee', 'eventAdvertisements');

let events: Event[];

/**
 * Fetches the parsed events from the calendar or uses the stored version if they have already been fetched since the last page load
 * @returns the parsed semesterzeiten
 */
export const getEvents = () =>
    events ?
        Promise.resolve(events)
    :   cachedRequest(icsUrl('events'), FIVE_MINUTES, 'json').then(
            ({ value }: CachedResponse<Event[]>) => (events = value)
        );

/**
 * Opens a modal showing details about an event.
 * @param event - the event to show details of.
 */
export const openEventModal = (event: Event) => {
    const startString =
        event.startDateOnly ?
            dateToString(new Date(event.start))
        :   datetimeToString(new Date(event.start), true, false);
    const endString =
        event.endDateOnly ?
            dateToString(new Date(event.end))
        :   datetimeToString(new Date(event.end), true, false);

    const table = (
        <table className="table table-striped table-hover m-0">
            <tbody>
                <tr>
                    <th>{LL.start()}:</th>
                    <td>{startString}</td>
                </tr>
                <tr>
                    <th>{LL.end()}:</th>
                    <td>{endString}</td>
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
                {event.desc ?
                    <tr>
                        <td colSpan={2}>{event.desc}</td>
                    </tr>
                :   null}
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
};
