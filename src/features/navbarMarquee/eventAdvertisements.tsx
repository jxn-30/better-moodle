import { BETTER_MOODLE_LANG } from '#i18n';
import { BooleanSetting } from '#lib/Settings/BooleanSetting';
import { datetimeToString } from '#lib/localeString';
import Feature from '#lib/Feature';
import { type Locales } from '../../i18n/i18n-types';
import { marquee } from './index';
import { ONE_DAY } from '#lib/times';
import { SliderSetting } from '#lib/Settings/SliderSetting';
import style from './eventAdvertisements.module.scss';
import { getEvents, openEventModal } from './eventAdvertisements/util';

const enabled = new BooleanSetting('enabled', true).addAlias(
    'general.eventAdvertisements'
);
const noticeTime = new SliderSetting('noticeTime', 14, {
    min: 1,
    max: 33,
    step: 1,
    labels: 5,
}).disabledIf(enabled, '!=', true);

export interface Event {
    start: string;
    end: string;
    startDateOnly: boolean;
    endDateOnly: boolean;
    desc?: string;
    name: Record<Locales, string>;
    location?: string;
    url?: string;
    rruleString?: Record<Locales, string>;
}

const spans = new Map<HTMLSpanElement, Event>();

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

    /**
     * The event-listener to open the modal with details
     * @param e - the click event
     */
    const clickListener = (e: MouseEvent) => {
        e.preventDefault();
        openEventModal(event);
    };

    span.addEventListener('click', clickListener);

    return [span, clickListener] as const;
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
                const [eventSpan, clickListener] = createEventSpan(event);
                marquee
                    .add(eventSpan)[0][1]
                    .addEventListener('click', clickListener);
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
