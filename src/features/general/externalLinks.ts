import { BooleanSetting } from '../../_lib/Settings/BooleanSetting';
import Feature from '../../_lib/Feature';

const enabled = new BooleanSetting('enabled', true).onInput(() =>
    enabled.feature?.reload()
);

const modifiedElements = new Map<HTMLAnchorElement, string>();

/**
 * An event listener setting the target to '_blank' for clicked links of their targets origin does not match the current origin.
 * @param event - the MouseEvent that is being fired
 */
const openInNewTabListener = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof HTMLAnchorElement) || target.target) return;
    const { origin, protocol } = new URL(target.href, window.location.origin);
    if (['javascript:', 'vbscript:'].includes(protocol)) return;
    if (
        origin &&
        origin !== window.location.origin &&
        target.target !== '_blank'
    ) {
        modifiedElements.set(target, target.target);
        target.target = '_blank';
    }
};

/**
 * Adds the event listener that handles mouse clicks
 */
const onload = () => {
    if (enabled.value) document.addEventListener('click', openInNewTabListener);
};

/**
 * Removes the event listener that handles mouse clicks and cleans up modifications
 */
const onunload = () => {
    document.removeEventListener('click', openInNewTabListener);
    modifiedElements.forEach(
        (origTarget, anchor) => (anchor.target = origTarget)
    );
    modifiedElements.clear();
};

export default Feature.register({
    settings: new Set([enabled]),
    onload,
    onunload,
});
