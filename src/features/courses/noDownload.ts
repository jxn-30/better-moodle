import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import { ready } from '@/DOM';

const enabled = new BooleanSetting('enabled', true).addAlias(
    'general.noDownload'
);

/**
 * Removes the part of a link that tries to forcedownload the file
 * @param anchor - the anchor to remove the forcedownload link part from
 */
const removeForceDownload = (anchor: HTMLAnchorElement) => {
    try {
        const url = new URL(anchor.href, window.location.origin);
        if (url.searchParams.has('forcedownload')) {
            url.searchParams.delete('forcedownload');
            anchor.href = url.href;
        }
    } catch {
        // if href is not a valid URL just ignore it.
    }
};

/**
 * An event listener for removing the forcedownload part of links on click
 * @param event - the mouse event that is being triggered
 */
const removeListener = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const anchor = target?.closest<HTMLAnchorElement>(
        'a[href*="forcedownload"]'
    );
    if (!anchor) return;
    removeForceDownload(anchor);
};

/**
 * Toggles the event listener based on the setting and removes forcedownload links if necessary
 */
const reload = () => {
    if (enabled.value) {
        void ready().then(() =>
            document
                .querySelectorAll<HTMLAnchorElement>('a[href*="forcedownload"]')
                .forEach(removeForceDownload)
        );
        document.addEventListener('mousedown', removeListener);
    } else document.removeEventListener('mousedown', removeListener);
};

enabled.onInput(() => void reload());

export default Feature.register({
    settings: new Set([enabled]),
    onload: reload,
    onunload: reload,
});
