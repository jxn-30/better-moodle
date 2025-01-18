import { animate } from '@/helpers';
import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import { marquee } from './index';
import { SliderSetting } from '@/Settings/SliderSetting';
import { timeToString } from '@/localeString';

const enabled = new BooleanSetting('enabled', false);
const seconds = new BooleanSetting('seconds', true).disabledIf(
    enabled,
    '!=',
    true
);

const fuzzy = new SliderSetting('fuzzy', 0, {
    min: 0,
    max: 5,
    step: 1,
    labels: ['off', '5min', '15min', 'food', 'day', 'week'],
});

const clockSpan = <span>00:00:00</span>;
let clockSpanClone: HTMLSpanElement;
const fuzzySpan = <span>Kurz vor knapp</span>;
let fuzzySpanClone: HTMLSpanElement;

let cancelAnimation: (() => void) | null = null;

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
