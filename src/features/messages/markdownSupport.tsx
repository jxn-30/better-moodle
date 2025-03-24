import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import { ready } from '@/DOM';
import { domID, mdToHtml } from '@/helpers';

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
    // Moodle does weird stuff with spaces (for 15 years...)
    const spacecaped = markdowned.replaceAll('> <', '>&#32;<');

    return raw.length > 0 ? spacecaped : '';
};

const inputFieldRegion = domID('send-message-txt');
const dummyField = (
    <textarea class="d-none"></textarea>
) as HTMLTextAreaElement;
let inputField: HTMLTextAreaElement | null = null;
let sendBtn: HTMLButtonElement | null = null;

let inputEvent: EventListener | null = null;
let sendEvent: EventListener | null = null;

// TODO: Fix Enter key to send messages
// TODO: Fix Emoji picker
// TODO: Fix Emoji shortcodes

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

    // Add the send button event listener
    /**
     * When the send button is clicked, clear the input field
     */
    sendEvent = () => {
        if (!inputField) return;
        inputField.value = '';
    };
    sendBtn.addEventListener('click', sendEvent);
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
