import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import { ready } from '@/DOM';
import { domID, mdToHtml } from '@/helpers';
import { requirePromise } from '@/require.js';

/**
 * The setting for enabling markdown support
 */
const enabled = new BooleanSetting('markdownSupport', true).addAlias(
    'messages.markdown'
).requireReload(); // TODO: I don't want to require a reload

/**
 * Returns a promise that resolves when MathJax is ready
 * @returns A promise that resolves to Moodles MathJax instance
 */
const mathJaxReady = (): Promise<(typeof window)['MathJax']> =>
    new Promise<(typeof window)['MathJax']>(resolve => {
        const interval = setInterval(() => {
            if (unsafeWindow.MathJax) {
                clearInterval(interval);
                resolve(unsafeWindow.MathJax);
            }
        }, 10);
    });

/**
 * Parses the markdown in the input field and returns the HTML
 * @param inputElem - The input field to parse
 * @returns The parsed HTML
 */
const parseMarkdown = async (
    inputElem: HTMLTextAreaElement
): Promise<string> => {
    const MathJax = await mathJaxReady();
    const raw = inputElem.value;

    const dummy = document.createElement('span');
    dummy.innerHTML = raw.replace(
        // Replace $math$ with \(math\)
        /(?<!\\)\$(.*?)(?<!\\)\$/g,
        '\\($1\\)'
    );
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, dummy]);
    const mathJaxed = dummy.innerHTML;
    const markdowned = mdToHtml(`\n${mathJaxed}`, 1);
    // Moodle does weird stuff with spaces (for 15 years...)
    const spacecaped = markdowned.replaceAll('> <', '>&#32;<');
    // This removes unnecessary spaces inside of html tags (as they somehow break Moodles html rendering)
    dummy.innerHTML = spacecaped;
    return dummy.innerHTML;
};

/**
 * The input field region identifier
 */
const inputFieldRegion: string = domID('send-message-txt');
/**
 * The dummy field for markdown parsing
 */
const dummyField: HTMLTextAreaElement = (
    <textarea class="d-none" // TODO: remove debug css
        style="display: block !important; position: fixed; top: var(--navbar-height); left: 0; width: 50vw; height: calc(100vh - var(--navbar-height)); background-color: black; color: lime; font-family: monospace; z-index:100000;"
    ></textarea>
) as HTMLTextAreaElement;

let inputField: HTMLTextAreaElement | null = null;
let sendBtn: HTMLButtonElement | null = null;

let inputEvent: EventListener | null = null;
let sendEvent: EventListener | null = null;

let emojiAutoComplete: HTMLDivElement | null = null;
let emojiPicker: HTMLDivElement | null = null;
let originalEmojiPicker: HTMLDivElement | null = null;

/**
 * Enables markdown support in the message app
 */
const enable = async () => {
    if (!enabled.value || inputField) return;
    await ready();

    // Get the message app
    const messageApp = document.querySelector<HTMLDivElement>('.message-app');
    if (!messageApp) return;
    sendBtn = messageApp.querySelector<HTMLButtonElement>(
        '[data-action="send-message"]'
    );
    inputField = messageApp.querySelector<HTMLTextAreaElement>(
        'textarea[data-region="send-message-txt"]'
    );
    if (!sendBtn || !inputField) return;

    // Replace the input field with a dummy field
    dummyField.dataset.region = inputField.dataset.region;
    inputField.dataset.region = inputFieldRegion;
    inputField.after(dummyField);
    dummyField.addEventListener('focus', () => inputField?.focus());

    // Add the input event listener
    /**
     * When the input field changes, update the dummy field
     */
    inputEvent = () => {
        if (!dummyField || !inputField) return;
        void parseMarkdown(inputField).then(md => (dummyField.value = md));
    };
    inputField.addEventListener('input', inputEvent);
    inputEvent(new Event('input'));

    // TODO: Send Enter key event to the right element
    // inputField.addEventListener('keydown', (e) => dummyField?.dispatchEvent(e));

    // Add the send button event listener
    /**
     * When the send button is clicked, clear the input field
     */
    sendEvent = () => {
        if (!inputField) return;
        inputField.value = '';
    };
    sendBtn.addEventListener('click', sendEvent);

    void requirePromise(
        [
            'core/templates',
            'core/emoji/auto_complete',
            'core/emoji/picker'
        ] as const
    ).then(
        ([templates, initialiseEmojiAutoComplete, initialiseEmojiPicker]) => {
            const emojiAutoCompleteContainer = document.querySelector<HTMLDivElement>('[data-region="emoji-auto-complete-container"]');
            const emojiPickerContainer = document.querySelector<HTMLDivElement>('[data-region="emoji-picker-container"]');
            if (!emojiAutoCompleteContainer || !emojiPickerContainer) return;
            originalEmojiPicker = document.querySelector<HTMLDivElement>('[data-region="emoji-picker"]');

            const getEmojiCallback = (containerElement: HTMLDivElement, replaceWord: boolean = false) => {
                return (emoji: string) => {
                    containerElement.classList.add('hidden');

                    if (!inputField) return;
                    inputField.focus();
                    const cursorPos = inputField.selectionStart;

                    if (!cursorPos) return;
                    const currentText = inputField.value;
                    const textBefore = currentText.substring(0, cursorPos).replace(replaceWord ? /\S*$/ : '', '');
                    const textAfter = currentText.substring(cursorPos).replace(replaceWord ? /^\S*/ : '', '');

                    inputField.value = textBefore + emoji + textAfter;
                    inputField.setSelectionRange(textBefore.length + emoji.length, textBefore.length + emoji.length);

                    parseMarkdown(inputField).then(md => (dummyField.value = md));
                };
            };

            templates.renderForPromise('core/emoji/auto_complete', {}).then(({ html }) => {
                const dummyEmojiAutoComplete = document.createElement('div');
                dummyEmojiAutoComplete.innerHTML = html;
                emojiAutoComplete = dummyEmojiAutoComplete.querySelector<HTMLDivElement>('[data-region="emoji-auto-complete"]');
                if (!emojiAutoComplete) return;
                emojiAutoComplete.dataset.region = domID('emoji-auto-complete');

                emojiAutoCompleteContainer.append(emojiAutoComplete);
                emojiAutoCompleteContainer.classList.add('hidden');

                if (!inputField) return;
                initialiseEmojiAutoComplete(
                    emojiAutoCompleteContainer,
                    inputField,
                    (show) => void emojiAutoCompleteContainer.classList.toggle('hidden', !show),
                    getEmojiCallback(emojiAutoComplete, true),
                );
            });

            templates.renderForPromise('core/emoji/picker', {}).then(({ html }) => {
                const dummyEmojiPicker = document.createElement('div');
                dummyEmojiPicker.innerHTML = html;
                emojiPicker = dummyEmojiPicker.querySelector<HTMLDivElement>('[data-region="emoji-picker"]');
                if (!emojiPicker) return;
                emojiPicker.dataset.region = domID('emoji-picker');

                emojiPickerContainer.append(emojiPicker);
                emojiPickerContainer.classList.add('hidden');

                initialiseEmojiPicker(emojiPicker,
                    getEmojiCallback(emojiPickerContainer),
                    // TODO: The emojiPickerButton needs to update it's state - currently it thinks it is still open
                );
                originalEmojiPicker?.classList.add('d-none');
            });
        });
};
/**
 * Disables markdown support in the message app
 */
const disable = () => {
    if (enabled.value || !inputField) return;

    // Remove the dummy field and restore the original input field
    inputField.dataset.region = dummyField.dataset.region;
    dummyField.dataset.region = '';
    dummyField.remove();

    // Remove the event listeners
    if (inputEvent) {
        inputField.removeEventListener('input', inputEvent);
        inputEvent = null;
    }
    if (sendEvent) {
        sendBtn?.removeEventListener('click', sendEvent);
        sendEvent = null;
    }
    inputField = null;

    emojiAutoComplete?.remove();
    emojiAutoComplete = null;

    emojiPicker?.remove();
    emojiPicker = null;
    originalEmojiPicker?.classList.remove('d-none');
};

/**
 * Reloads the markdown support
 */
const reload = async () => {
    if (enabled.value) {
        await enable();
    } else {
        disable();
    }
};

enabled.onInput(() => void reload());

export default Feature.register({
    settings: new Set([enabled]),
    /**
     * Loads the feature
     */
    onload: () => {
        void reload();
    },
    /**
     * Unloads the feature
     */
    onunload: () => {
        void disable();
    },
});
