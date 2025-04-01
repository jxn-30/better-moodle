import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import { render } from '@/templates';
import { requirePromise } from '@/require.js';
import { domID, mdToHtml } from '@/helpers';
import { putTemplate, ready } from '@/DOM';

/**
 * The setting for enabling markdown support
 */
const enabled = new BooleanSetting('markdownSupport', true).addAlias(
    'messages.markdown'
);

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
    // Moodle has been doing weird stuff with spaces (for as long as the Better-Moodle devs are alive...). See MDL-85010
    const spacecaped = markdowned.replaceAll('> <', '>&#32;<');
    // This removes unnecessary spaces inside of html tags (as they somehow break Moodles html rendering)
    dummy.innerHTML = spacecaped;
    return dummy.innerText.length > 0 ? dummy.innerHTML : '';
};

/**
 * The input field region identifier
 */
const inputFieldRegion: string = domID('send-message-txt');
/**
 * The dummy field for markdown parsing
 */
const dummyField: HTMLTextAreaElement = (
    <textarea className="d-none"></textarea>
) as HTMLTextAreaElement;

let inputField: HTMLTextAreaElement | null = null;
let sendBtn: HTMLButtonElement | null = null;

let inputEvent: EventListener | null = null;
let sendEvent: EventListener | null = null;
let keyRelayEvent: EventListener | null = null;

/**
 * The event listener for the emoji picker button
 */
const emojiPickerBtnClickEvent: EventListener = () => {
    const container = document.querySelector<HTMLDivElement>(
        '[data-region="emoji-picker-container"]'
    );
    if (!container) return;
    container.classList.toggle('hidden');
};

/**
 * Returns a callback that inserts the emoji into the input field
 * @param containerElement - The container element to hide
 * @param inputField - The input field to insert the emoji into
 * @param replaceWord - Whether to replace the word before the cursor
 * @returns The callback
 */
const getEmojiCallback = (
    containerElement: HTMLDivElement,
    inputField: HTMLTextAreaElement,
    replaceWord = false
) => {
    return (emoji: string) => {
        containerElement.classList.add('hidden');

        inputField.focus();
        const cursorPos = inputField.selectionStart;

        if (!cursorPos) return;
        const currentText = inputField.value;
        const textBefore = currentText
            .substring(0, cursorPos)
            .replace(replaceWord ? /\S*$/ : '', '');
        const textAfter = currentText
            .substring(cursorPos)
            .replace(replaceWord ? /^\S*/ : '', '');

        inputField.value = textBefore + emoji + textAfter;
        inputField.setSelectionRange(
            textBefore.length + emoji.length,
            textBefore.length + emoji.length
        );

        void parseMarkdown(inputField).then(md => (dummyField.value = md));
    };
};
/**
 * Replaces the current emoji auto complete with a new emoji auto complete for the given input field
 * @param inputField - The input field for the emoji auto complete
 */
const putEmojiAutoComplete = async (inputField: HTMLTextAreaElement) => {
    await ready();
    const container = document.querySelector<HTMLDivElement>(
        '[data-region="emoji-auto-complete-container"]'
    );
    if (!container) return;
    container.classList.add('hidden');
    container
        .querySelector<HTMLDivElement>('[data-region="emoji-auto-complete"]')
        ?.remove();
    void render('core/emoji/auto_complete', {})
        .then(template =>
            Promise.all([
                requirePromise(['core/emoji/auto_complete'] as const),
                putTemplate<HTMLDivElement[]>(container, template, 'append'),
            ])
        )
        .then(([[initialiseEmojiAutoComplete], templateElements]) => {
            const emojiAutoComplete = templateElements[0];
            initialiseEmojiAutoComplete(
                container,
                inputField,
                show => container.classList.toggle('hidden', !show),
                getEmojiCallback(emojiAutoComplete, inputField, true)
            );
        });
};
/**
 * Replaces the current emoji picker with a new emoji picker for the given input field
 * @param inputField - The input field for the emoji picker
 */
const putEmojiPicker = async (inputField: HTMLTextAreaElement) => {
    await ready();
    const container = document.querySelector<HTMLDivElement>(
        '[data-region="emoji-picker-container"]'
    );
    if (!container) return;
    container.classList.add('hidden');
    container
        .querySelector<HTMLDivElement>('[data-region="emoji-picker"]')
        ?.remove();

    void render('core/emoji/picker', {})
        .then(template =>
            Promise.all([
                requirePromise(['core/emoji/picker'] as const),
                putTemplate<HTMLDivElement[]>(container, template, 'append'),
            ])
        )
        .then(([[initialiseEmojiPicker], templateElements]) => {
            const emojiPicker = templateElements[0];
            initialiseEmojiPicker(
                emojiPicker,
                getEmojiCallback(container, inputField)
            );
        });
};

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
        '[data-region="send-message-txt"]'
    );
    if (!sendBtn || !inputField) return;

    // Replace the input field with a dummy field
    dummyField.dataset.region = inputField.dataset.region;
    inputField.dataset.region = inputFieldRegion;
    inputField.after(dummyField);

    // This event will be removed when dummyField is removed,
    //  so it doesn't need to be stored in a variable
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

    /**
     * Relays the keydown event from the input field to the dummy field
     * @param e - The keydown event
     */
    keyRelayEvent = e => {
        if (!(e instanceof KeyboardEvent)) return;
        if (
            !dummyField?.dispatchEvent(
                new KeyboardEvent('keydown', {
                    // TODO: find out minimal set of necessary properties
                    altKey: e.altKey,
                    charCode: e.charCode,
                    code: e.code,
                    ctrlKey: e.ctrlKey,
                    isComposing: e.isComposing,
                    key: e.key,
                    keyCode: e.keyCode,
                    location: e.location,
                    metaKey: e.metaKey,
                    repeat: e.repeat,
                    shiftKey: e.shiftKey,
                    detail: e.detail,
                    view: e.view,
                    which: e.which,
                    bubbles: true,
                    cancelable: true,
                    composed: true,
                })
            )
        ) {
            e.preventDefault();
        }
        if (inputField && dummyField?.value === '') {
            inputField.value = '';
        }
    };
    inputField.addEventListener('keydown', keyRelayEvent);

    // Add the send button event listener
    /**
     * When the send button is clicked, clear the input field
     */
    sendEvent = () => {
        if (!inputField) return;
        inputField.value = '';
    };
    sendBtn.addEventListener('click', sendEvent);

    const emojiPickerBtn = document.querySelector<HTMLButtonElement>(
        '[data-action="toggle-emoji-picker"]'
    );
    if (emojiPickerBtn) {
        emojiPickerBtn.addEventListener('click', emojiPickerBtnClickEvent);
        emojiPickerBtn.setAttribute(
            'data-action',
            domID('toggle-emoji-picker')
        );
    }

    void putEmojiAutoComplete(inputField);
    void putEmojiPicker(inputField);
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
    if (keyRelayEvent) {
        inputField.removeEventListener('keydown', keyRelayEvent);
        keyRelayEvent = null;
    }
    inputField = null;

    const originalInputField = document.querySelector<HTMLTextAreaElement>(
        '[data-region="send-message-txt"]'
    );
    if (originalInputField) {
        void putEmojiAutoComplete(originalInputField);
        void putEmojiPicker(originalInputField);
    }
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
