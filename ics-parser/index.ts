import ical from 'node-ical';
import german from './i18n/de';

/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const URLS = {
    semesterzeiten: {
        uzl: 'http://files.asta.uni-luebeck.de/remote.php/dav/public-calendars/AH4pFg6pqb7AfBXo?export',
    },
    events: {
        cau: 'https://cloud.rz.uni-kiel.de/remote.php/dav/public-calendars/6i9dfBcXyqsLYKZK/?export',
    },
};

const SERVER_CACHE_DUR = 10 * 60; // 10 * 60s = 10 minutes
const CLIENT_CACHE_DUR = 30 * 60; // 30 * 60s = 30 minutes

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

        const events = Object.values(calendar)
            .filter(v => v.type === 'VEVENT')
            .map(e => {
                const desc = e.description;
                const name =
                    desc ?
                        Object.fromEntries(
                            desc.split(/\n/g).map(l => {
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

        const res = new Response(JSON.stringify(events));
        res.headers.set('Cache-Control', `max-age=${CLIENT_CACHE_DUR}`);
        res.headers.set('Content-Type', 'application/json');
        return res;
    },
} satisfies ExportedHandler<Env>;
