import { Temporal } from '@js-temporal/polyfill';
import { BooleanSetting } from '#lib/Settings/BooleanSetting';
import Feature from '#lib/Feature';
import { LLF } from '#i18n';
import { marquee } from './index';
import { mdToHtml } from '#lib/helpers';

const LL = LLF('navbarMarquee', 'christmasCountdown');

const enabled = new BooleanSetting('enabled', true)
    .addAlias('general.christmasCountdown')
    .addTag('fun');
const short = new BooleanSetting('short', false)
    .addTag('fun')
    .disabledIf(enabled, '!=', true);

const countdownSpan = (<span>🎄</span>) as HTMLSpanElement;
let countdownSpanClone: HTMLSpanElement;
let timeout: ReturnType<typeof setTimeout>;

/**
 * Updates the countdown content based on current time
 */
const updateCountdown = () => {
    if (!countdownSpanClone) return;
    const now = Temporal.Now.plainDateISO();
    if (now.day === 24 && now.month === 12) {
        countdownSpan.innerHTML = countdownSpanClone.innerHTML = LL.christmas();
        return;
    }
    const christmas = Temporal.PlainDate.from({
        year: now.year,
        month: 12,
        day: 24,
    });
    const tillThen = 
        now.until(christmas).total('days') < 0 ?
            now.until(christmas.add({ years: 1 })).total('days')
        :   now.until(christmas).total('days');
    const daysTillThen = Math.floor(tillThen);
    const text =
        short.value ?
            LL.short({ days: daysTillThen })
        :   LL.remaining({ days: daysTillThen });
    countdownSpan.innerHTML = countdownSpanClone.innerHTML = mdToHtml(
        text,
        undefined,
        undefined,
        false
    );
    marquee.recalculate();
};

/**
 * Adds or removes the countdown based on setting state and triggers updating the countdown
 */
const reload = () => {
    if (timeout) clearTimeout(timeout);
    if (enabled.value) {
        [[, countdownSpanClone]] = marquee.add(countdownSpan);
        updateCountdown();
        const midnight = Temporal.Now.zonedDateTimeISO()
            .startOfDay()
            .add({ days: 1 });
        const msUntilMidnight = midnight.epochMilliseconds - Temporal.Now.instant().epochMilliseconds;
        timeout = setTimeout(updateCountdown, msUntilMidnight);
    } else {
        marquee.remove(countdownSpan);
    }
};

enabled.onInput(reload);
short.onInput(reload);

export default Feature.register({
    settings: new Set([enabled, short]),
    onload: reload,
    onunload: reload,
});
