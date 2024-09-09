import externalLinks from './externalLinks';
import type { FeatureGroupTranslation } from '../../../../types/i18n';
import fullWidth from './fullWidth';
import truncatedTexts from './truncatedTexts';

export const de = {
    name: 'Allgemeine Einstellungen',
    settings: {
        updateNotification: {
            name: 'Benachrichtigung bei Better-Moodle Updates',
            description:
                'Zeigt einen kleinen roten Punkt bei den Zahnrädern in der Navigationsleiste an, wenn es ein Update für Better-Moodle gibt.',
        },
        language: {
            name: 'Better-Moodle Sprache',
            description: 'Wähle die Sprache von Better-Moodle aus.',
            options: {
                auto: '🌐 Auto (Moodle Sprache)',
            },
        },
    },
    features: {
        fullWidth: fullWidth.de,
        externalLinks: externalLinks.de,
        truncatedTexts: truncatedTexts.de,
    },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'General Settings',
    settings: {
        updateNotification: {
            name: 'Notification for Better-Moodle updates',
            description:
                'Displays a small red dot by the cogs in the navigation bar when there is an update for Better-Moodle.',
        },
        language: {
            name: 'Better-Moodle Language',
            description: 'Choose the language of Better-Moodle.',
            options: {
                auto: '🌐 Auto (Moodle language)',
            },
        },
    },
    features: {
        fullWidth: fullWidth.en,
        externalLinks: externalLinks.en,
        truncatedTexts: truncatedTexts.en,
    },
} satisfies typeof de;

export default { de, en };
