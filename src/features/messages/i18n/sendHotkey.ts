import type { FeatureTranslation } from '#types/i18n';

export const de = {
    settings: {
        sendHotkey: {
            name: 'Mitteilungen per Tastenkombination absenden',
            description:
                'Ermöglicht das Absenden von Mitteilungen per Tastenkombination (z. B. Strg + Enter).',
            options: {
                '': '[Deaktiviert] Kein Absenden per Tastenkombination',
                'shiftEnter': 'Umschalt + Enter',
                'ctrlEnter': 'Strg + Enter',
            },
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        sendHotkey: {
            name: 'Send messages by hotkey',
            description:
                'Allows messages to be sent using a key combination (e.g. Ctrl + Enter).',
            options: {
                '': '[Disabled] Do not send by hotkey',
                'shiftEnter': 'Shift + Enter',
                'ctrlEnter': 'Ctrl + Enter',
            },
        },
    },
} as typeof de;

export default { de, en };
