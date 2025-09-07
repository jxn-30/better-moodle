import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';

const enabled = new BooleanSetting('enabled', true).addAlias(
    'general.truncatedTexts'
);

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
 * Adds or removes the event listener that handles the mouseover event
 */
const reload = () => {
    if (enabled.value) {
        document.addEventListener('mouseover', setTitleListener);
    } else {
        document.removeEventListener('mouseover', setTitleListener);
        modifiedElements.forEach(element => element.removeAttribute('title'));
        modifiedElements.clear();
    }
};

enabled.onInput(reload);

export default Feature.register({
    settings: new Set([enabled]),
    onload: reload,
    onunload: reload,
});
