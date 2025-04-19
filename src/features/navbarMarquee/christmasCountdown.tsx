import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import { LLF } from 'i18n';
import { marquee } from './index';
import { mdToHtml } from '@/helpers';

const LL = LLF('navbarMarquee', 'christmasCountdown');

const enabled = new BooleanSetting('enabled', true)
    .addAlias('general.christmasCountdown')
    .addTag('fun');

const countdownSpan = (<span>🎄</span>) as HTMLSpanElement;
let countdownSpanClone: HTMLSpanElement;
let timeout: ReturnType<typeof setTimeout>;

const ONE_DAY = 24 * 60 * 60 * 1000;

/**
 * Updates the countdown content based on current time
 */
const updateCountdown = () => {
    if (!countdownSpanClone) return;
    const now = new Date();
    if (now.getDate() === 24 && now.getMonth() === 11) {
        countdownSpan.innerHTML = countdownSpanClone.innerHTML = LL.christmas();
        return;
    }
    const christmas = new Date(now);
    christmas.setDate(24);
    christmas.setMonth(11);
    if (now > christmas) {
        christmas.setFullYear(christmas.getFullYear() + 1);
    }
    const tillThen = christmas.getTime() - now.getTime();
    const daysTillThen = Math.floor(tillThen / ONE_DAY);
    countdownSpan.innerHTML = countdownSpanClone.innerHTML = mdToHtml(
        LL.remaining({
            days: daysTillThen,
        }),
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
    if (enabled.value) {
        [[, countdownSpanClone]] = marquee.add(countdownSpan);
        updateCountdown();
        const midnight = new Date();
        midnight.setHours(0, 0, 0, 0);
        midnight.setTime(midnight.getTime() + ONE_DAY);
        timeout = setTimeout(updateCountdown, midnight.getTime() - Date.now());
    } else {
        marquee.remove(countdownSpan);
        if (timeout) clearTimeout(timeout);
    }
};

enabled.onInput(reload);

export default Feature.register({
    settings: new Set([enabled]),
    onload: reload,
    onunload: reload,
});
