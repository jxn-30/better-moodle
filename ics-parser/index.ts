import ical from 'node-ical';
import german from './i18n/de';

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
    if (!rawEvent.rrule && (new Date(rawEvent.end).getTime() < Date.now() - timeOver))
        return null;
    const desc = rawEvent.description.val;
    const start = new Date(rawEvent.start);
    const end = new Date(rawEvent.end);
    if (
        end.getHours() === 0 &&
        end.getMinutes() === 0 &&
        end.getSeconds() === 0 &&
        end.getMilliseconds() === 0
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

const mapSemesterzeiten = rawEvents => {
    const semesters: Semester[] = [];
    let minStartDate = new Date();
    let maxEndDate = new Date();
    const recurringEvents: [number, Event][] = [];
    const events = rawEvents
        .map((e, i) => {
            const event = getBaseEvent(e, 183 * 24 * 60 * 60 * 1000); // half a year
            if (!event) return;

            minStartDate = Math.min(minStartDate, event.start);
            maxEndDate = Math.max(maxEndDate, event.end);

            event.type = event.desc.match(/(?<=^@type:).*$/m)?.[0];
            event.color = event.desc.match(/(?<=^@color:).*$/m)?.[0];
            event.name = Object.fromEntries(
                    event.desc
                        .matchAll(
                            /(?<=^@name:(?<lang>[a-z]{2}):)(?<name>.*)$/gm
                        )
                        .map(n => [n.groups.lang, n.groups.name])
                );

            if (event.type === 'semester') {
                event.events = [];
                // Only output semesters that have no ended yet.
                if (new Date(e.end) > new Date()) semesters.push(event);
                return null;
            }

            if (e.rrule) recurringEvents.push([i, event]);
            else return event;
        })
        .filter(Boolean);

    recurringEvents.forEach(([idx, e]) => {
        const event = rawEvents[idx];
        const duration = e.end.getTime() - e.start.getTime();
        event.rrule
            .between(new Date(minStartDate), new Date(maxEndDate))
            .forEach(rDate => {
                events.push({
                    ...e,
                    start: rDate,
                    end: new Date(rDate.getTime() + duration),
                });
            });
    });

    events.forEach(event => {
        // TODO: This just works but I guess it may be done way more efficient!
        semesters.forEach(semester => {
            const start = new Date(event.start);
            const end = new Date(event.end);
            const seStart = new Date(semester.start);
            const seEnd = new Date(semester.end);
            if (
                (start >= seStart && start < seEnd) || // start is during semester or
                (end > seStart && end <= seEnd) // end is during semester
            )
                semester.events.push(event);
        });
    });

    semesters.forEach(semester =>
        semester.events.sort((a, b) => a.start - b.start)
    );

    return semesters;
};

export default {
    async fetch(request, env, ctx): Promise<Response> {
        const [_, cat, uni] = new URL(request.url).pathname.split('/');

        const url = URLS[cat]?.[uni];

        if (!url) return new Response(null, { status: 404 });

        const icsContent = await fetch(url, {
            cacheTtl: SERVER_CACHE_DUR,
            cacheEverything: true,
        }).then(res => res.text());
        const calendar = await ical.async.parseICS(icsContent);

        const rawEvents = Object.values(calendar)
            .filter(v => v.type === 'VEVENT')
            .toSorted((a, b) => a.start - b.start);
        let events = [];
        switch (cat) {
            case 'semesterzeiten':
                events = mapSemesterzeiten(rawEvents);
                break;
            /*
                .map(e => {
                    const desc = e.description;
                    const name =
                        desc ?
                            Object.fromEntries(
                                (desc.val ?? desc).split(/\n/g).map(l => {
                                    const [lang, ...rest] = l.split(':');
                                    return [lang.toLowerCase(), rest.join(':')];
                                })
                            )
                        :   e.summary;

                    const categories = new Set(e.categories);

                    let color = 'info';
                    let storage = 'dummy';
                    categories.forEach(category => {
                        if (category.startsWith('color-')) {
                            color = category.replace('color-', '');
                            categories.delete(category);
                        } else if (category.startsWith('storage-')) {
                            storage = category.replace('storage-', '');
                            categories.delete(category);
                        }
                    });

                    const rruleString =
                        e.rrule ?
                            {
                                en: e.rrule.toText(),
                                de: e.rrule.toText(undefined, german),
                            }
                        :   undefined;

                    const cleanedEvent = {
                        start: e.start,
                        end: e.end,
                        name,
                        color,
                        storage,
                        location: e.location,
                        urls:
                            Array.isArray(e.attach) ? e.attach
                            : e.attach ? [e.attach]
                            : [],
                        categories: Array.from(categories),
                        rruleString,
                        rrule: e.rrule?.origOptions ?? undefined,
                    };

                    let duration =
                        new Date(e.end).getTime() - new Date(e.start).getTime();
                    const firstDate = e.rrule?.after(
                        new Date(Date.now() - duration),
                        true
                    ); // a workaround to also get the current instance
                    if (firstDate) {
                        cleanedEvent.start = firstDate.toISOString();
                        cleanedEvent.end = new Date(
                            firstDate.getTime() + duration
                        ).toISOString();
                    }

                    return cleanedEvent;
                });
                */
                break;
            default:
                events = rawEvents;
        }

        const res = new Response(JSON.stringify(events));
        res.headers.set('Cache-Control', `max-age=${CLIENT_CACHE_DUR}`);
        res.headers.set('Content-Type', 'application/json');
        return res;
    },
} satisfies ExportedHandler<Env>;
