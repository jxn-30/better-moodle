import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';

const enabled = new BooleanSetting('enabled', true).addAlias(
    'general.externalLinks'
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
 * Adds or removes the event listener that handles mouse clicks
 */
const reload = () => {
    if (enabled.value) document.addEventListener('click', openInNewTabListener);
    else {
        document.removeEventListener('click', openInNewTabListener);
        modifiedElements.forEach(
            (origTarget, anchor) => (anchor.target = origTarget)
        );
        modifiedElements.clear();
    }
};

enabled.onInput(reload);

export default Feature.register({
    settings: new Set([enabled]),
    onload: reload,
    onunload: reload,
});
