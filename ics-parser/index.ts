import ical from 'node-ical';
import rruleToWords from './rruleToWords';

const URLS = {
    semesterzeiten: {
        cau: 'https://cloud.rz.uni-kiel.de/remote.php/dav/public-calendars/XNpJxfSoQcsxCe8m/?export',
        uzl: 'http://files.asta.uni-luebeck.de/remote.php/dav/public-calendars/AH4pFg6pqb7AfBXo?export',
    },
    events: {
        cau: 'https://cloud.rz.uni-kiel.de/remote.php/dav/public-calendars/6i9dfBcXyqsLYKZK/?export',
        uzl: 'https://files.asta.uni-luebeck.de/remote.php/dav/public-calendars/2iNZHdBDLqcZF48a?export',
    },
};

const SERVER_CACHE_DUR = 10 * 60; // 10 * 60s = 10 minutes
const CLIENT_CACHE_DUR = 30 * 60; // 30 * 60s = 30 minutes

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_YEAR = 365 * ONE_DAY;
const HALF_YEAR = ONE_YEAR / 2;

interface Event {
    start: Date;
    end: Date;
    desc: string;
    startDateOnly: boolean;
    endDateOnly: boolean;
    name: Record<string, string>;
}

interface Semesterzeit extends Event {
    type: string;
    color: string;
}

interface Semester extends Semesterzeit {
    events: Event[];
}

const getBaseEvent = (rawEvent, timeOver = 0): Event => {
    // do not abort parsing events that do have a rrule
    const nowMs = Temporal.Now.instant().epochMilliseconds;
    if (
        !rawEvent.rrule &&
        new Date(rawEvent.end).getTime() < nowMs - timeOver
    )
        return null;
    const desc =
        typeof rawEvent.description === 'string' ?
            rawEvent.description
        :   (rawEvent.description?.val ?? '');
    const start = new Date(rawEvent.start);
    const end = new Date(rawEvent.end);
    const endZdt = Temporal.Instant.fromEpochMilliseconds(end.getTime())
        .toZonedDateTimeISO('UTC');
    if (
        endZdt.hour === 0 &&
        endZdt.minute === 0 &&
        endZdt.second === 0 &&
        endZdt.millisecond === 0
    )
        end.setTime(end.getTime() - 1);

    const event = {
        start: start,
        end: end,
        desc,
        startDateOnly: !!rawEvent.start.dateOnly,
        endDateOnly: !!rawEvent.end.dateOnly,
        name: {},
    };

    return event;
};

const sortEvents = (events: Event[]) =>
    events.sort((a, b) => a.start - b.start);

const expandRecuringEvent = (
    rawEvent,
    event: Event,
    minDate: Date,
    maxDate: Date
) => {
    const duration = event.end.getTime() - event.start.getTime();
    return rawEvent.rrule
        .between(minDate, maxDate)
        .map(start => ({
            ...event,
            start,
            end: new Date(start.getTime() + duration),
        }));
};

const rruleToText = (rrule, lang = 'en') =>
    rruleToWords(rrule.toString(), lang);

const mapSemesterzeiten = rawEvents => {
    const semesters: Semester[] = [];
    let minStartDate = new Date();
    let maxEndDate = new Date();
    const recurringEvents: [number, Event][] = [];
    const events = rawEvents
        .map((raw, index) => {
            const event = getBaseEvent(raw, HALF_YEAR);
            if (!event) return;

            minStartDate = Math.min(minStartDate, event.start);
            maxEndDate = Math.max(maxEndDate, event.end);

            event.type = event.desc.match(/(?<=^@type:).*$/m)?.[0];
            event.color = event.desc.match(/(?<=^@color:).*$/m)?.[0];
            event.name = Object.fromEntries(
                event.desc
                    .matchAll(/(?<=^@name:(?<lang>[a-z]{2}):)(?<name>.*)$/gm)
                    .map(n => [n.groups.lang, n.groups.name])
            );
            event.name['en-gb'] = event.name.en;

            if (event.type === 'semester') {
                event.events = [];
                // Only output semesters that have no ended yet.
                if (new Date(raw.end) > new Date()) semesters.push(event);
                return null;
            }

            if (raw.rrule) recurringEvents.push([index, event]);
            else return event;
        })
        .filter(Boolean);

    recurringEvents.forEach(([index, event]) =>
        events.push(
            ...expandRecuringEvent(
                rawEvents[index],
                event,
                new Date(minStartDate),
                new Date(maxEndDate)
            )
        )
    );

    events.forEach(event => {
        const start = new Date(event.start);
        const end = new Date(event.end);

        // TODO: This just works but I guess it may be done way more efficient!
        semesters.forEach(semester => {
            const seStart = new Date(semester.start);
            const seEnd = new Date(semester.end);
            if (
                (start >= seStart && start < seEnd) || // start is during semester or
                (end > seStart && end <= seEnd) // end is during semester
            )
                semester.events.push(event);
        });
    });

    semesters.forEach(semester => sortEvents(semester.events));

    return semesters;
};

const mapEvents = rawEvents => {
    const recurringEvents: [number, Event][] = [];

    const events = rawEvents
        .map((raw, index) => {
            const event = getBaseEvent(raw);
            if (!event) return;

            event.name.de = event.name.en = raw.summary;
            event.name['en-gb'] = event.name.en;
            event.location = raw.location;
            event.url =
                raw.attach ?
                    Array.isArray(raw.attach) ?
                        raw.attach[0]
                    :   raw.attach
                :   undefined;

            if (raw.rrule) {
                event.rruleString = {
                    en: rruleToText(raw.rrule),
                    de: rruleToText(raw.rrule, 'de'),
                };
                event.rruleString['en-gb'] = event.rruleString.en;
            }

            if (raw.rrule) recurringEvents.push([index, event]);
            else if (event.end >= Temporal.Now.instant().epochMilliseconds) return event;
        })
        .filter(Boolean);

    const nowInstant = Temporal.Now.instant();
    const oneYearLater = nowInstant.add({ days: 365 });
    
    recurringEvents.forEach(([index, event]) =>
        events.push(
            ...expandRecuringEvent(
                rawEvents[index],
                event,
                new Date(nowInstant.epochMilliseconds),
                new Date(oneYearLater.epochMilliseconds)
            )
        )
    );

    sortEvents(events);

    return events;
};

export default {
    async fetch(request, env, ctx): Promise<Response> {
        const [_, cat, uni] = new URL(request.url).pathname.split('/');

        const url = URLS[cat]?.[uni];

        let events = [];
        if (url) {
            const icsContent = await fetch(url, {
                cacheTtl: SERVER_CACHE_DUR,
                cacheEverything: true,
            }).then(res => res.text());
            const calendar = await ical.async.parseICS(icsContent);

            const rawEvents = Object.values(calendar)
                .filter(v => v.type === 'VEVENT')
                .toSorted((a, b) => a.start - b.start);
            switch (cat) {
                case 'semesterzeiten':
                    events = mapSemesterzeiten(rawEvents);
                    break;
                case 'events':
                    events = mapEvents(rawEvents);
                    break;
                default:
                    events = rawEvents;
            }
        }

        const res = new Response(JSON.stringify(events));
        res.headers.set('Cache-Control', `max-age=${CLIENT_CACHE_DUR}`);
        res.headers.set('Content-Type', 'application/json');
        return res;
    },
} satisfies ExportedHandler<Env>;
