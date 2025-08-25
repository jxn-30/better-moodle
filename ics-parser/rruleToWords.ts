// This has been generated with ChatGPT so no guarantee to work very well.
// We may need to adjust this a little if Bugs are occuring.
// However, this gives the best results of everything we tried!
// We wonder why there doesn't seem to be a library that already solved this problem...

type Language = 'en' | 'de';

interface TranslationMap {
    freq: Record<string, string>;
    on: string;
    and: string;
    until: string;
    count: (count: number) => string;
    weekdays: Record<string, string>;
    ordinals: (n: number) => string;
    date: (date: Date) => string;
    every: (interval: number, unit: string) => string;
}

const translations: Record<Language, TranslationMap> = {
    en: {
        freq: {
            DAILY: 'day',
            WEEKLY: 'week',
            MONTHLY: 'month',
            YEARLY: 'year',
        },
        on: 'on',
        and: 'and',
        until: 'until',
        count: count => `for ${count} times`,
        weekdays: {
            MO: 'Monday',
            TU: 'Tuesday',
            WE: 'Wednesday',
            TH: 'Thursday',
            FR: 'Friday',
            SA: 'Saturday',
            SU: 'Sunday',
        },
        ordinals: n => {
            const suffixes = ['th', 'st', 'nd', 'rd'];
            const v = n % 100;
            const s = suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
            return `${n}${s}`;
        },
        date: d =>
            d.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
        every: (interval, unit) =>
            `Every ${interval > 1 ? `${interval} ${unit}s` : unit}`,
    },

    de: {
        freq: {
            DAILY: 'Tag',
            WEEKLY: 'Woche',
            MONTHLY: 'Monat',
            YEARLY: 'Jahr',
        },
        on: 'am',
        and: 'und',
        until: 'bis zum',
        count: count => `${count} Mal`,
        weekdays: {
            MO: 'Montag',
            TU: 'Dienstag',
            WE: 'Mittwoch',
            TH: 'Donnerstag',
            FR: 'Freitag',
            SA: 'Samstag',
            SU: 'Sonntag',
        },
        ordinals: n => {
            const map: Record<number, string> = {
                1: '1.',
                2: '2.',
                3: '3.',
                4: '4.',
                [-1]: 'letzten',
                [-2]: 'vorletzten',
            };
            return map[n] || `${n}.`;
        },
        date: d =>
            d.toLocaleDateString('de-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
        every: (interval, unit) =>
            `Jeden ${interval > 1 ? `${interval} ${unit}e` : unit}`,
    },
};

function parseRRule(rrule: string): Record<string, string> {
    const parts = rrule.replace('RRULE:', '').split(/;|\n/g);
    const ruleObj: Record<string, string> = {};
    for (const part of parts) {
        const [key, value] = part.split('=');
        ruleObj[key] = value;
    }
    return ruleObj;
}

function rruleToText(rrule: string, lang: Language): string {
    const rule = parseRRule(rrule);
    const t = translations[lang];
    const parts: string[] = [];

    const freq = rule['FREQ'];
    const interval = parseInt(rule['INTERVAL'] || '1', 10);
    const byDay = rule['BYDAY']?.split(',') ?? [];
    const byMonthDay = rule['BYMONTHDAY']?.split(',') ?? [];
    const bySetPos = rule['BYSETPOS']?.split(',').map(Number);
    const count = rule['COUNT'] ? parseInt(rule['COUNT'], 10) : null;
    const until =
        rule['UNTIL'] ? new Date(rule['UNTIL'].replace(/Z$/, '')) : null;

    // 1. Frequency & Interval
    if (freq) {
        parts.push(t.every(interval, t.freq[freq]));
    }

    // 2. Ordinals (BYSETPOS + BYDAY)
    if (bySetPos?.length && byDay.length) {
        const ordinals = bySetPos.map(pos => t.ordinals(pos)).join(', ');
        const days = byDay.map(d => t.weekdays[d]).join(` ${t.and} `);
        parts.push(`${t.on} ${ordinals} ${days}`);
    } else if (byDay.length) {
        const days = byDay.map(d => t.weekdays[d]);
        parts.push(
            `${t.on} ${days.slice(0, -1).join(', ')}${days.length > 1 ? ` ${t.and} ` : ''}${days.slice(
                -1
            )}`
        );
    } else if (byMonthDay.length) {
        const days = byMonthDay.map(Number).map(n => t.ordinals(n));
        parts.push(`${t.on} ${days.join(', ')}`);
    }

    // 3. End condition
    if (until) {
        parts.push(`${t.until} ${t.date(until)}`);
    } else if (count) {
        parts.push(t.count(count));
    }

    return parts.filter(Boolean).join(' ');
}

export default rruleToText;
