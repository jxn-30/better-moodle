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
    },
    features: {
        fullWidth: fullWidth.en,
        externalLinks: externalLinks.en,
        truncatedTexts: truncatedTexts.en,
    },
} satisfies typeof de;

export default { de, en };
