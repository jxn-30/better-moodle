import { animate } from '@/helpers';
import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import { LLF } from 'i18n';
import { marquee } from './index';
import { SliderSetting } from '@/Settings/SliderSetting';
import { timeToString } from '@/localeString';

const enum FUZZYNESS {
    off,
    '5min',
    '15min',
    food,
    day,
    week,
}

type Fuzzyness = keyof typeof FUZZYNESS;

const enabled = new BooleanSetting('enabled', false).addAlias('clock.clock');
const seconds = new BooleanSetting('seconds', true)
    .addAlias('clock.clock.seconds')
    .disabledIf(enabled, '!=', true);

const oldFuzzyKey = 'better-moodle-settings.clock.fuzzyClock';
const oldFuzzyEnabled = GM_getValue(oldFuzzyKey, false);
GM_deleteValue(oldFuzzyKey);

const fuzzy = new SliderSetting('fuzzy', 0, {
    min: 0,
    max: 5,
    step: 1,
    labels: ['off', '5min', '15min', 'food', 'day', 'week'] as Fuzzyness[],
}).addAlias('clock.fuzzyClock.fuzziness', old =>
    oldFuzzyEnabled ? Math.round(Number(old) / 10) : 0
);

const clockSpan = (<span>00:00:00</span>) as HTMLSpanElement;
let clockSpanClone: HTMLSpanElement;
const fuzzySpan = (<span>🕛️🕒🕕🕘</span>) as HTMLSpanElement;
let fuzzySpanClone: HTMLSpanElement;

let cancelAnimation: (() => void) | null = null;

const fuzzyTranslations = LLF('navbarMarquee', 'clock').fuzzy;

/**
 * Gets the time in the currently set fuzzy format
 * @param now - the current time as a Date
 * @returns the fuzzy time string
 */
const fuzzyTime = (now: Date): string => {
    const fuzzyness = fuzzy.value as FUZZYNESS;
    if (fuzzyness === FUZZYNESS.off) return '';
    else if (
        fuzzyness === FUZZYNESS['5min'] ||
        fuzzyness === FUZZYNESS['15min']
    ) {
        const translations = fuzzyTranslations.minutes;
        const sectorSize = (
            { [FUZZYNESS['5min']]: 5, [FUZZYNESS['15min']]: 15 } as const
        )[fuzzyness];
        const minutes = (now.getTime() % (60 * 60 * 1000)) / (60 * 1000);
        const section = (Math.floor((minutes + sectorSize / 2) / sectorSize) *
            sectorSize) as unknown as keyof typeof translations; // need this unknown conversion here
        return translations[section]({ hour: now.getHours() % 12 || 12 });
    } else if (fuzzyness === FUZZYNESS.food || fuzzyness === FUZZYNESS.day) {
        const translationKey = (
            { [FUZZYNESS.food]: 'food', [FUZZYNESS.day]: 'day' } as const
        )[fuzzyness];
        const translations = fuzzyTranslations[translationKey];
        const hour = now.getHours();
        const section = Math.floor(
            hour / (24 / Object.keys(translations).length)
        ).toString() as keyof typeof translations;
        return translations[section]();
    } else if (fuzzyness === FUZZYNESS.week) {
        const dayOfWeek = now.getDay();
        const weekSection =
            dayOfWeek === 1 ?
                0 // Monday
            : dayOfWeek >= 2 && dayOfWeek <= 3 ?
                1 // Tuesday, Wednesday
            : dayOfWeek <= 5 ?
                2 // Thursday, Friday
            :   3; // Saturday, Sunday
        return fuzzyTranslations.week[weekSection]();
    }
    return '';
};

/**
 * Appends the clock spans to the marquee, if needed and sets animation
 */
const onload = () => {
    if (enabled.value) {
        [[, clockSpanClone]] = marquee.add(clockSpan);
    } else {
        marquee.remove(clockSpan);
    }

    if (fuzzy.value !== 0) {
        [[, fuzzySpanClone]] = marquee.add(fuzzySpan);
    } else {
        marquee.remove(fuzzySpan);
    }

    if (cancelAnimation === null && (enabled.value || fuzzy.value !== 0)) {
        cancelAnimation = animate(
            1000,
            () => {
                const now = new Date();

                if (enabled.value && clockSpanClone) {
                    clockSpan.textContent = clockSpanClone.textContent =
                        timeToString(now, seconds.value);
                }

                if (fuzzy.value !== 0 && fuzzySpanClone) {
                    fuzzySpan.textContent = fuzzySpanClone.textContent =
                        fuzzyTime(now);
                    fuzzySpan.title = fuzzySpanClone.title = timeToString(
                        now,
                        true
                    );
                }
            },
            true
        );
    } else if (!enabled.value && fuzzy.value === 0) {
        cancelAnimation?.();
        cancelAnimation = null;
    }
};

enabled.onInput(onload);
fuzzy.onInput(onload);

/**
 * Removes all clock spans and disables animations
 */
const onunload = () => {
    marquee.remove(clockSpan);
    marquee.remove(fuzzySpan);
    cancelAnimation?.();
    cancelAnimation = null;
};

export default Feature.register({
    settings: new Set([enabled, seconds, fuzzy]),
    onload,
    onunload,
});
