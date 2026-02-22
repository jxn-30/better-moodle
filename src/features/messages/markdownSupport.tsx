import { BooleanSetting } from '#lib/Settings/BooleanSetting';
import Feature from '#lib/Feature';
import { ready } from '#lib/DOM';
import { require } from '#lib/require.js';
import { domID, mdToHtml } from '#lib/helpers';
import { putTemplate, render } from '#lib/templates';

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
    const dummy = document.createElement('span');
    const raw = inputElem.value;

    // Get MathJax to render the math
    dummy.innerHTML = raw.replace(
        // Replace $math$ with \(math\)
        /(?<!\\)\$(.*?)(?<!\\)\$/g,
        '\\($1\\)'
    );
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, dummy]);
    const mathJaxed = dummy.innerHTML;

    // Parse the markdown to HTML
    const markdowned = mdToHtml(`\n${mathJaxed}`, 1);

    // Remove spaces inside of html tags
    dummy.innerHTML = markdowned;
    const cleanMarkdowned = dummy.innerHTML;

    // Moodle has been doing weird stuff with spaces (for as long as the Better-Moodle devs are alive...). See MDL-85010
    const spacecaped = cleanMarkdowned.replaceAll('> <', '>&#32;<');

    // Check if there is anything to send (or if the message is empty)
    dummy.innerHTML = spacecaped;
    return dummy.innerText.length > 0 ? spacecaped : '';
};

/**
 * The input field region identifier
 */
const inputFieldRegion: string = domID('send-message-txt');

/**
 * The selectors for the message app
 */
const SELECTORS = {
    messageApp: '.message-app',
    inputField: '[data-region="send-message-txt"]',
    sendBtn: '[data-action="send-message"]',
    emojiPickerBtn: '[data-action="toggle-emoji-picker"]',
    emojiPickerContainer: '[data-region="emoji-picker-container"]',
    emojiAutoCompleteContainer: '[data-region="emoji-auto-complete-container"]',
    emojiAutoComplete: '[data-region="emoji-auto-complete"]',
    emojiPicker: '[data-region="emoji-picker"]',
};

/**
 * The message apps that have been modified
 */
const messageApps = new Map<
    HTMLDivElement,
    {
        inputField?: HTMLTextAreaElement;
        dummyField?: HTMLTextAreaElement;
        sendBtn?: HTMLButtonElement;
        inputEvent?: EventListener;
        sendEvent?: EventListener;
        keyRelayEvent?: EventListener;
    }
>();

/**
 * The dummy field for markdown parsing
 */
const dummyFieldTemplate: HTMLTextAreaElement = (
    <textarea className="d-none"></textarea>
) as HTMLTextAreaElement;

/**
 * The event listener for the emoji picker button
 * @param messageApp - The message app to get the emoji picker from
 * @returns The event listener
 */
const emojiPickerBtnClickEventGenerator =
    (messageApp: HTMLDivElement) => () => {
        const container = messageApp.querySelector<HTMLDivElement>(
            SELECTORS.emojiPickerContainer
        );
        if (!container) return;
        container.classList.toggle('hidden');
    };

/**
 * Returns a callback that inserts the emoji into the input field
 * @param containerElement - The container element to hide
 * @param messageApp - The message app to get the input field from
 * @param replaceWord - Whether to replace the word before the cursor
 * @returns The callback
 */
const getEmojiCallback = (
    containerElement: HTMLDivElement,
    messageApp: HTMLDivElement,
    replaceWord = false
) => {
    const { inputField, dummyField } = messageApps.get(messageApp) ?? {};

    return (emoji: string) => {
        if (!inputField || !dummyField) return;

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

        if (dummyField) {
            void parseMarkdown(inputField).then(md => (dummyField.value = md));
        }
    };
};
/**
 * Replaces the current emoji auto complete with a new emoji auto complete for the given input field
 * @param messageApp - The message app for the emoji auto complete
 */
const putEmojiAutoComplete = async (messageApp: HTMLDivElement) => {
    await ready();
    const container = messageApp.querySelector<HTMLDivElement>(
        SELECTORS.emojiAutoCompleteContainer
    );
    const inputField = messageApps.get(messageApp)?.inputField;
    if (!container || !inputField) return;
    container.classList.add('hidden');
    container
        .querySelector<HTMLDivElement>(SELECTORS.emojiAutoComplete)
        ?.remove();
    void render('core/emoji/auto_complete', {})
        .then(template =>
            Promise.all([
                require(['core/emoji/auto_complete'] as const),
                putTemplate<HTMLDivElement[]>(container, template, 'append'),
            ])
        )
        .then(([[initialiseEmojiAutoComplete], [emojiAutoComplete]]) =>
            initialiseEmojiAutoComplete(
                container,
                inputField,
                show => container.classList.toggle('hidden', !show),
                getEmojiCallback(emojiAutoComplete, messageApp, true)
            )
        );
};
/**
 * Replaces the current emoji picker with a new emoji picker for the given input field
 * @param messageApp - The message app for the emoji picker
 */
const putEmojiPicker = async (messageApp: HTMLDivElement) => {
    await ready();
    const container = messageApp.querySelector<HTMLDivElement>(
        SELECTORS.emojiPickerContainer
    );
    if (!container) return;
    container.classList.add('hidden');
    container.querySelector<HTMLDivElement>(SELECTORS.emojiPicker)?.remove();

    void render('core/emoji/picker', {})
        .then(template =>
            Promise.all([
                require(['core/emoji/picker'] as const),
                putTemplate<HTMLDivElement[]>(container, template, 'append'),
            ])
        )
        .then(([[initialiseEmojiPicker], [emojiPicker]]) =>
            initialiseEmojiPicker(
                emojiPicker,
                getEmojiCallback(container, messageApp)
            )
        );
};

/**
 * Enables markdown support in the message app
 */
const enable = async () => {
    if (!enabled.value) return;
    await ready();

    // Get the message app
    void document
        .querySelectorAll<HTMLDivElement>(SELECTORS.messageApp)
        .forEach(messageApp => {
            if (messageApps.get(messageApp)?.inputField) return; // Already active

            const dummyField = dummyFieldTemplate.cloneNode(
                true
            ) as HTMLTextAreaElement;
            const inputField = messageApp.querySelector<HTMLTextAreaElement>(
                SELECTORS.inputField
            );
            const sendBtn = messageApp.querySelector<HTMLButtonElement>(
                SELECTORS.sendBtn
            );
            if (!inputField || !sendBtn) return;

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
            const inputEvent: EventListener = () => {
                if (!dummyField || !inputField) return;
                void parseMarkdown(inputField).then(
                    md => (dummyField.value = md)
                );
            };
            inputField.addEventListener('input', inputEvent);
            inputEvent(new Event('input'));

            /**
             * Relays the keydown event from the input field to the dummy field
             * @param e - The keydown event
             */
            const keyRelayEvent: EventListener = e => {
                if (!(e instanceof KeyboardEvent)) return;
                const beforeValue = dummyField?.value;
                if (
                    !dummyField?.dispatchEvent(
                        new KeyboardEvent('keydown', {
                            altKey: e.altKey,
                            code: e.code,
                            ctrlKey: e.ctrlKey,
                            key: e.key,
                            keyCode: e.keyCode, // I really hate JQuery for making me include a deprecated property
                            location: e.location,
                            metaKey: e.metaKey,
                            shiftKey: e.shiftKey,
                            bubbles: true,
                            cancelable: true,
                        })
                    )
                ) {
                    e.preventDefault();
                }
                if (
                    inputField &&
                    beforeValue !== dummyField?.value &&
                    dummyField?.value === ''
                ) {
                    inputField.value = '';
                }
            };
            inputField.addEventListener('keydown', keyRelayEvent);

            // Add the send button event listener
            /**
             * When the send button is clicked, clear the input field
             */
            const sendEvent: EventListener = () => {
                if (!inputField) return;
                inputField.value = '';
            };
            sendBtn.addEventListener('click', sendEvent);

            const emojiPickerBtn = messageApp.querySelector<HTMLButtonElement>(
                SELECTORS.emojiPickerBtn
            );
            emojiPickerBtn?.addEventListener(
                'click',
                emojiPickerBtnClickEventGenerator(messageApp)
            );
            emojiPickerBtn?.setAttribute(
                'data-action',
                domID('toggle-emoji-picker')
            );

            messageApps.set(messageApp, {
                dummyField,
                inputField,
                sendBtn,
                inputEvent,
                sendEvent,
                keyRelayEvent,
            });

            void putEmojiAutoComplete(messageApp);
            void putEmojiPicker(messageApp);
        });
};
/**
 * Disables markdown support in the message app
 */
const disable = () => {
    if (enabled.value) return;

    document
        .querySelectorAll<HTMLDivElement>(SELECTORS.messageApp)
        .forEach(messageApp => {
            const app = messageApps.get(messageApp);
            if (!app) return;

            const {
                inputField,
                dummyField,
                sendBtn,
            } = app;

            let {
                inputEvent,
                sendEvent,
                keyRelayEvent,
            } = app;

            if (!inputField || !dummyField) return;

            // Remove the event listeners
            if (sendEvent) {
                sendBtn?.removeEventListener('click', sendEvent);
                sendEvent = undefined;
            }
            if (inputEvent) {
                inputField.removeEventListener('input', inputEvent);
                inputEvent = undefined;
            }
            if (keyRelayEvent) {
                inputField.removeEventListener('keydown', keyRelayEvent);
                keyRelayEvent = undefined;
            }

            // Remove the dummy field and restore the original input field
            inputField.dataset.region = dummyField.dataset.region;
            dummyField.dataset.region = '';
            dummyField.remove();

            const originalInputField =
                messageApp.querySelector<HTMLTextAreaElement>(
                    SELECTORS.inputField
                );

            messageApps.set(messageApp, {
                inputField: originalInputField ?? undefined,
                dummyField: undefined,
                sendBtn: undefined,
                inputEvent,
                sendEvent,
                keyRelayEvent,
            });

            if (originalInputField) {
                void putEmojiAutoComplete(messageApp);
                void putEmojiPicker(messageApp);
            }
        });
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
