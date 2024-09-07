import { BooleanSetting } from '../../_lib/Settings/BooleanSetting';
import Feature from '../../_lib/Feature';

const enabled = new BooleanSetting('enabled', true).onInput(() => {
    // TODO: this.feature.reload() once `this` set
    enabled.feature?.reload();
});

const modifiedElements = new Set<HTMLElement>();

/**
 * An event listener setting the title of elements with no title and class 'text-truncate'
 * @param event - the MouseEvent that is being fired
 */
const setTitleListener = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
        return;
    }
    if (target.title || !target.classList.contains('text-truncate')) return;
    target.title = target.textContent?.trim() ?? '';
    modifiedElements.add(target);
};

/**
 * Adds the event listener that handles the mouseover event
 */
const onload = () => {
    if (enabled.value) {
        document.addEventListener('mouseover', setTitleListener);
    }
};

/**
 * Removes the event listener that handles the mouseover event and cleans up modifications
 */
const onunload = () => {
    document.removeEventListener('mouseover', setTitleListener);
    modifiedElements.forEach(element => element.removeAttribute('title'));
    modifiedElements.clear();
};

export default Feature.register({
    settings: new Set([enabled]),
    onload,
    onunload,
});
