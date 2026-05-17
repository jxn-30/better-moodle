import { BooleanSetting } from '#lib/Settings/BooleanSetting';
import Feature from '#lib/Feature';
import maxWidthStyleEl from './images/maxWidth.scss?style';
import { moodleReady } from '#lib/helpers';
import { ready } from '#lib/DOM';
import zoomStyle from './images/zoom.module.scss';

const maxWidth = new BooleanSetting('maxWidth', true).addAlias(
    'courses.imgMaxWidth'
);
const zoom = new BooleanSetting('zoom', true).addAlias('courses.imageZoom');

const zoomOverlay = <div id={zoomStyle.overlay}></div>;
let zoomCopiedImage: HTMLImageElement;
let zoomEventListenerAdded = false;
let zoomResizeListenerAdded = false;

/**
 * Closes the zoomed in image view
 */
const closeZoom = () => {
    zoomCopiedImage?.addEventListener(
        'transitionend',
        () => {
            zoomOverlay.remove();
            zoomCopiedImage?.remove();
        },
        { once: true }
    );
    zoomCopiedImage?.style.removeProperty('transform');
};
zoomOverlay.addEventListener('click', closeZoom);
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeZoom();
});

/**
 * Zooms an image into the overlay
 * @param e - the click event that is to be processed
 */
const zoomImage = (e: MouseEvent) => {
    const target = e.target;
    if (!(target instanceof HTMLImageElement)) return;

    if (getComputedStyle(target).cursor !== 'zoom-in') return;

    e.preventDefault();

    zoomCopiedImage = target.cloneNode(true) as HTMLImageElement;

    const modifiedUrl = new URL(target.src);

    // use a profile picture with a higher resolution (by replacing f1|f2 with f3).
    // this needs to be within a moodleReady as we use `M` global variable.
    // profile pictures and their smaller version seen to always be squares,
    // so we don't need to adjust zoom image size, however in other cases,
    // this would have to be done after loading the new URL
    void moodleReady().then(() => {
        zoomCopiedImage.src = target.src = modifiedUrl
            .toString()
            .replace(
                new RegExp(
                    `(?<=/pluginfile.php/\\d+/user/icon/${M.cfg.theme}/f)\\d(?=$|\\?)`
                ),
                '3'
            );
    });

    // image files have small preview icons. Zooming into them will now load the original file
    // by removing `?preview=tinyicon` from the URL
    if (
        modifiedUrl.pathname.startsWith('/pluginfile.php/') &&
        modifiedUrl.searchParams.get('preview') === 'tinyicon'
    ) {
        modifiedUrl.searchParams.delete('preview');
    }

    // finally set the modified URL
    zoomCopiedImage.src = modifiedUrl.toString();

    // remove additional styles that could produce weird results
    zoomCopiedImage.style.setProperty('margin', 'unset', 'important');
    zoomCopiedImage.style.setProperty('width', 'unset', 'important');
    zoomCopiedImage.style.setProperty('height', 'unset', 'important');
    zoomCopiedImage.style.setProperty('max-width', 'unset', 'important');
    zoomCopiedImage.style.setProperty('max-height', 'unset', 'important');
    zoomCopiedImage.style.setProperty('display', 'block');
    zoomCopiedImage.removeAttribute('width');
    zoomCopiedImage.removeAttribute('height');

    /**
     * Check which image the adjusting should use and abort if it is not the correct one.
     * @param event - the loading event
     */
    const triggerAdjust = (event: Event) => {
        const target = event.target;
        if (!target || !(target instanceof HTMLImageElement)) return;
        // if the loading has not been triggered by the latest URL, do not try to adjust
        if (target.currentSrc !== zoomCopiedImage.src) return;
        adjustZoomedImageSize();
        // we don't need the listener anymore now.
        zoomCopiedImage.removeEventListener('load', triggerAdjust);
    };
    zoomCopiedImage.addEventListener('load', triggerAdjust);

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
        return;
    }

    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.9;

    const scale = Math.min(maxWidth / width, maxHeight / height);

    // we need to set the base size
    // otherwise we could try not to set scale on svgs but that would be more difficult
    zoomCopiedImage.style.setProperty('width', `${width}px`, 'important');
    zoomCopiedImage.style.setProperty('height', `${height}px`, 'important');
    zoomCopiedImage.style.setProperty('transform', `scale(${scale})`);
};

/**
 * Applies Style and adds event listeners or removes them
 */
const onload = async () => {
    await ready();

    if (maxWidth.value) document.head.append(maxWidthStyleEl);
    else maxWidthStyleEl.remove();

    document.body.classList.toggle(zoomStyle.zoomEnabled, zoom.value);

    const mainRegion = document.querySelector<HTMLDivElement>('#region-main');
    if (zoom.value) {
        if (!zoomEventListenerAdded) {
            mainRegion?.addEventListener('click', zoomImage);
            zoomEventListenerAdded = true;
        } else {
            mainRegion?.removeEventListener('click', zoomImage);
            zoomEventListenerAdded = false;
        }

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
        .querySelector<HTMLDivElement>('#region-main')
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
