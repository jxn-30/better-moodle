import Feature from '@/Feature';
import { ready } from '@/DOM';
import { BooleanSetting } from '@/Settings/BooleanSetting';
import { domID, mdToHtml } from '@/helpers';

const enabled = new BooleanSetting('markdownSupport', true).addAlias(
    'messages.markdown'
);

const mathJaxReady = () =>
    new Promise<typeof MathJax>(resolve => {
        const interval = setInterval(() => {
            if (unsafeWindow.MathJax) {
                clearInterval(interval);
                resolve(unsafeWindow.MathJax);
            }
        }, 10);
    });

const parseMarkdown = async (inputElem: HTMLTextAreaElement) => {
    const MathJax = await mathJaxReady();
    const raw = inputElem.value;

    const dummy = document.createElement('span');
    dummy.innerHTML = raw.replace( // Replace $math$ with \(math\)
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
const dummyField = <textarea class="d-none"></textarea> as HTMLTextAreaElement;
let inputField: HTMLTextAreaElement | null = null;
let sendBtn: HTMLButtonElement | null = null;

let inputEvent: EventListener | null = null;
let sendEvent: EventListener | null = null;

// TODO: Fix Enter key to send messages
// TODO: Fix Emoji picker
// TODO: Fix Emoji shortcodes

const enable = async () => {
    if (!enabled.value || inputField) return;
    await ready();

    // Get the message app
    const messageApp =
        document.querySelector<HTMLDivElement>('.message-app');
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
    inputEvent = async () => {
        if (!dummyField || !inputField) return;
        dummyField.value = await parseMarkdown(inputField);
    };
    inputField.addEventListener('input', inputEvent);
    dummyField.value = await parseMarkdown(inputField);

    // Add the send button event listener
    sendEvent = () => {
        if (!inputField) return;
        inputField.value = '';
    };
    sendBtn.addEventListener('click', sendEvent);
}
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
}

const reload = async () => enabled.value ? await enable() : disable();

enabled.onInput(() => void reload());

export default Feature.register({
    settings: new Set([enabled]),
    onload: () => void reload(),
    onunload: () => void disable(),
});
