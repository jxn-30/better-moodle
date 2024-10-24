import { BooleanSetting } from '@/Settings/BooleanSetting';
import { debounce } from '@/helpers';
import Feature from '@/Feature';
import { ready } from '@/DOM';
import styles from './googlyEyes.module.scss';

const enabled = new BooleanSetting('enabled', false).addTag('fun');

const pupils = new Map<HTMLSpanElement, DOMRect>();

/**
 * Creates a new pupil.
 * @returns The pupil.
 */
const Pupil = () => {
    const pupil = (<span className={styles.pupil}></span>) as HTMLSpanElement;
    pupils.set(pupil, pupil.getBoundingClientRect());
    return pupil;
};

/**
 * Creates a new eye.
 * @returns The eye.
 */
const Eye = () => (
    <span className={styles.eye}>
        <Pupil />
    </span>
);

const eyes = (
    <div id={styles.eyes}>
        <Eye />
        <Eye />
    </div>
) as HTMLDivElement;

/**
 * Updates the stored positions (bounding client rect) of the pupils.
 * @returns void
 */
const updatePupilPositions = () =>
    pupils.forEach((_, pupil) =>
        pupils.set(pupil, pupil.getBoundingClientRect())
    );
const updatePupilPositionsDebounced = debounce(updatePupilPositions, 100);

/**
 * Updates the translation of the pupils based on the mouse position.
 * @param event - the mouse event triggering the update.
 */
const updatePupilTranslations = (event: MouseEvent) => {
    const { clientX: mouseLeft, clientY: mouseTop } = event;
    pupils.forEach((rect, pupil) => {
        const { top, left } = rect;
        const translateX =
            mouseLeft < left ?
                mouseLeft / left - 1
            :   (mouseLeft - left) / (innerWidth - left);
        const translateY =
            mouseTop < top ?
                mouseTop / top - 1
            :   (mouseTop - top) / (innerHeight - top);
        /**
         * Eases the pupil movement for better visibility of the effect.
         * @param translation - The translation to ease.
         * @returns The eased translation.
         */
        const ease = (translation: number): number =>
            translation < 0 ?
                -1 * ease(-1 * translation)
            :   100 - Math.pow(1 - translation, 2) * 100;
        pupil.style.setProperty(
            'transform',
            `translateX(${ease(translateX)}%) translateY(${ease(translateY)}%)`
        );
    });

    updatePupilPositionsDebounced();
};

let oldElement: HTMLElement | null;

/**
 * Adds Eyes to the DOM and stores the item that was replaced.
 * @returns void
 */
const addEyes = () =>
    ready().then(() => {
        oldElement = document.querySelector<HTMLElement>(
            '.btn-footer-popover > .icon'
        );
        oldElement?.replaceWith(eyes);
        document.addEventListener('mousemove', updatePupilTranslations);
        updatePupilPositions();
    });

/**
 * Removes the eyes from the DOM and replaces the old element.
 * @returns void
 */
const removeEyes = () =>
    ready().then(() => {
        if (oldElement) eyes.replaceWith(oldElement);
        document.removeEventListener('mousemove', updatePupilTranslations);
    });

const isTouchDevice = window.matchMedia('(hover: none)').matches;

/**
 * Adds or removes the eyes based on the setting state
 */
const updateEyesStatus = () => {
    if (isTouchDevice) return;
    if (enabled.value) void addEyes();
    else void removeEyes();
};

enabled.onInput(updateEyesStatus);

export default Feature.register({
    settings: new Set([enabled]),
    onload: updateEyesStatus,
    onunload: updateEyesStatus,
});
