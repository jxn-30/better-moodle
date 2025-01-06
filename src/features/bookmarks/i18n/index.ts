import type { FeatureGroupTranslation } from '#/i18n';

export const de = {
    name: 'Lesezeichen',
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
    settings: {
        enabled: {
            name: 'Lesezeichenmanager aktivieren',
            description:
                'Aktiviert einen Lesezeichenmanager, um Lesezeichen direkt im Moodle zu haben.',
        },
    },
} satisfies typeof de;

export default { de, en };
