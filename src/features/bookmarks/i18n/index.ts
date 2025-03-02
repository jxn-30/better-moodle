import type { FeatureGroupTranslation } from '#/i18n';

export const de = {
    name: 'Lesezeichen',
    description:
        'Wer nutzt schon den Lesezeichenmanager des Browsers? Der hier in Better-Moodle eingebaute ist einfach viel cooler!',
    settings: {
        enabled: {
            name: 'Lesezeichenmanager aktivieren',
            description:
                'Aktiviert einen Lesezeichenmanager, um Lesezeichen direkt im Moodle zu haben.',
        },
    },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'Bookmarks',
    description:
        'Who even uses the bookmarks feature of their browser? The one integrated in Better-Moodle is way cooler!',
    settings: {
        enabled: {
            name: 'Lesezeichenmanager aktivieren',
            description:
                'Aktiviert einen Lesezeichenmanager, um Lesezeichen direkt im Moodle zu haben.',
        },
    },
} as typeof de;

export default { de, en };
