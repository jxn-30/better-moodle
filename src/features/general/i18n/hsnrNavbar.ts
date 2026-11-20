import { FeatureTranslation } from '#types/i18n';

export const de = {
    settings: {
        enabled: {
            name: 'Kursanfrage im Support-Menü',
            description:
                'Verschiebt den "neuer Kursantrag"-Link aus der Hauptnavigation in das Support-Dropdown.',
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        enabled: {
            name: 'Course request in Support menu',
            description:
                'Moves the "New course request" link from the primary navigation into the Support dropdown.',
        },
    },
} satisfies typeof de;

export default { de, en };
