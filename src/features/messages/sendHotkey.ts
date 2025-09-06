import Feature from '@/Feature';
import { SelectSetting } from '@/Settings/SelectSetting';

const hotkey = new SelectSetting('sendHotkey', '', [
    '',
    'shiftEnter',
    'ctrlEnter',
]).addAlias('messages.sendHotkey');

const messageApps = new Map<
    HTMLTextAreaElement,
    { messageApp: HTMLDivElement; submitBtn: HTMLButtonElement }
>();

/**
 * Triggers sending the message if the hotkey has been fired
 * @param e - the keydown event that has been fired
 */
const listener = (e: KeyboardEvent) => {
    // All of the combinations contain the Enter key
    if (e.key !== 'Enter') return;

    // Now, if the keydown event has not been fired by the input field, abort
    const input = e.target;
    if (
        !(input instanceof HTMLTextAreaElement) ||
        input.dataset.region !== 'send-message-txt'
    ) {
        return;
    }

    // let's find the message app and abort if there is none
    const messageApp =
        messageApps.get(input)?.messageApp ??
        input.closest<HTMLDivElement>('.message-app');
    if (!messageApp) return;

    // If the emoji-picker is open, do not send
    if (
        messageApp.querySelector('.emoji-auto-complete-container:not(.hidden)')
    ) {
        return;
    }

    // now find the submit button
    const submitBtn =
        messageApps.get(input)?.submitBtn ??
        messageApp.querySelector<HTMLButtonElement>(
            '[data-action="send-message"]'
        );
    if (!submitBtn) return;

    // do some caching to reduce the amount of DOM searches
    messageApps.set(input, { messageApp, submitBtn });

    switch (hotkey.value) {
        case 'shiftEnter':
            if (e.shiftKey) {
                submitBtn.click();
                e.preventDefault();
            }
            return;
        case 'ctrlEnter':
            if (e.ctrlKey) {
                submitBtn.click();
                e.preventDefault();
            }
    }
};

/**
 * Adds or removes the event listener, depending on the settings value
 */
const reload = () => {
    if (hotkey.value === '') document.removeEventListener('keydown', listener);
    else document.addEventListener('keydown', listener);
};

export default Feature.register({
    settings: new Set([hotkey]),
    onload: reload,
    onunload: reload,
});
