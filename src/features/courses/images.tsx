import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import maxWidthStyle from './images/maxWidth.scss?inline';
import { ready } from '@/DOM';
import zoomStyle from './images/zoom.module.scss';

const maxWidth = new BooleanSetting('maxWidth', true).addAlias(
    'courses.imgMaxWidth'
);
const zoom = new BooleanSetting('zoom', true).addAlias('courses.imageZoom');

let maxWidthStyleEl: HTMLStyleElement;

const zoomOverlay = <div id={zoomStyle.overlay}></div>;
let zoomCopiedImage: HTMLImageElement;
let zoomEventListenerAdded = false;
let zoomResizeListenerAdded = false;

zoomOverlay.addEventListener('click', () => {
    zoomOverlay.remove();
    zoomCopiedImage?.remove();
});

/**
 * Zooms an image into the overlay
 * @param e - the click event that is to be processed
 */
const zoomImage = (e: MouseEvent) => {
    const target = e.target;
    if (!(target instanceof HTMLImageElement)) return;

    if (target.classList.contains('activityicon')) return;

    e.preventDefault();

    zoomCopiedImage = target.cloneNode(true) as HTMLImageElement;

    // remove additional styles that could produce weird results
    zoomCopiedImage.style.removeProperty('margin');
    zoomCopiedImage.style.removeProperty('width');
    zoomCopiedImage.style.removeProperty('height');
    zoomCopiedImage.style.setProperty('display', 'block');
    zoomCopiedImage.removeAttribute('width');
    zoomCopiedImage.removeAttribute('height');

    zoomCopiedImage.addEventListener('load', adjustZoomedImageSize);

    zoomOverlay.append(zoomCopiedImage);
    document.body.append(zoomOverlay);
};

/**
 * Adjusts the zoom size of the currently zoomed image
 */
const adjustZoomedImageSize = () => {
    if (!zoom.value || !zoomCopiedImage) return;

    const { naturalWidth: width, naturalHeight: height } = zoomCopiedImage;

    // a size could not be determined
    if (!width || !height) {
        zoomCopiedImage.style.setProperty('max-width', `90%`);
        zoomCopiedImage.style.setProperty('max-height', `90%`);
        zoomCopiedImage.style.setProperty('transform', `scale(1)`);
    }

    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.9;

    const scale = Math.min(maxWidth / width, maxHeight / height);

    zoomCopiedImage.style.setProperty('transform', `scale(${scale})`);
};

/**
 * Applies Style and adds event listeners or removes them
 */
const onload = async () => {
    await ready();

    if (maxWidth.value) {
        maxWidthStyleEl ??= GM_addStyle(maxWidthStyle);
        document.head.append(maxWidthStyleEl);
    } else {
        maxWidthStyleEl?.remove();
    }

    document.body.classList.toggle(zoomStyle.zoomEnabled, zoom.value);

    const courseContent = document.querySelector<HTMLDivElement>(
        '#page-content .course-content'
    );
    if (zoom.value) {
        if (!zoomEventListenerAdded) {
            courseContent?.addEventListener('click', zoomImage);
            zoomEventListenerAdded = true;
        } else {
            courseContent?.removeEventListener('click', zoomImage);
            zoomEventListenerAdded = false;
        }
    }

    if (zoom.value) {
        if (!zoomResizeListenerAdded) {
            window.addEventListener('resize', adjustZoomedImageSize);
            zoomResizeListenerAdded = true;
        } else {
            window.removeEventListener('resize', adjustZoomedImageSize);
            zoomResizeListenerAdded = false;
        }
    }
};

maxWidth.onInput(() => void onload());
zoom.onInput(() => void onload());

/**
 * Removes all event listeners and styles
 */
const onunload = () => {
    maxWidthStyleEl?.remove();

    document.body.classList.remove(zoomStyle.zoomEnabled);
    document
        .querySelector<HTMLDivElement>('#page-content .course-content')
        ?.removeEventListener('click', zoomImage);
    window.removeEventListener('resize', adjustZoomedImageSize);

    zoomEventListenerAdded = false;
    zoomResizeListenerAdded = false;
};

export default Feature.register({
    settings: new Set([maxWidth, zoom]),
    onload,
    onunload,
});
