import { BooleanSetting } from '#lib/Settings/BooleanSetting';
import Feature from '#lib/Feature';
import { LLF } from '#i18n';
import { marquee } from './index';
import { mdToHtml } from '#lib/helpers';
import { getToday, getTodayNow } from '#lib/temporal';

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
    const today = getToday();
    const thisYearChristmas = today.with({ day: 24, month: 12 });
    if (today.equals(thisYearChristmas)) {
        countdownSpan.innerHTML = countdownSpanClone.innerHTML = LL.christmas();
        return;
    }
    const nextChristmas =
        Temporal.PlainDate.compare(today, thisYearChristmas) < 0 ?
            thisYearChristmas
        :   thisYearChristmas.add({ years: 1 });
    const daysTillThen = today.until(nextChristmas).total('days');
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
        const msTillMidnight = getTodayNow()
            .until(getToday().add({ days: 1 }))
            .total('milliseconds');
        timeout = setTimeout(updateCountdown, msTillMidnight);
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
