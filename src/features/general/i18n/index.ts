import externalLinks from './externalLinks';
import type { FeatureGroupTranslation } from '#/i18n';
import fullWidth from './fullWidth';
import googlyEyes from './googlyEyes';
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
        hideDisabledSettings: {
            name: 'Deaktivierte Einstellungen ausblenden',
            description:
                'Blendet Einstellungen aus, die gerade deaktiviert sind (z.\xa0B. weil sie von einer anderen Einstellung abhängig sind).',
        },
        hideFunSettings: {
            name: 'Spaß-Einstellungen ausblenden',
            description:
                'Blendet Einstellungen aus, die nur für mehr Spaß im Moodle da sind.',
        },
    },
    features: {
        fullWidth: fullWidth.de,
        externalLinks: externalLinks.de,
        truncatedTexts: truncatedTexts.de,
        googlyEyes: googlyEyes.de,
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
        hideDisabledSettings: {
            name: 'Hide disabled settings',
            description:
                'Hides settings that are currently disabled (e.g. because they depend on another setting).',
        },
        hideFunSettings: {
            name: 'Hide fun settings',
            description: 'Hides settings that are just for more fun in Moodle.',
        },
    },
    features: {
        fullWidth: fullWidth.en,
        externalLinks: externalLinks.en,
        truncatedTexts: truncatedTexts.en,
        googlyEyes: googlyEyes.en,
    },
} satisfies typeof de;

export default { de, en };
