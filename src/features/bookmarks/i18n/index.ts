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
    bookmarks: 'Lesezeichen',
    add: 'Lesezeichen hinzufügen',
    edit: 'Lesezeichen bearbeiten',
    empty: 'Es sind noch keine Lesezeichen angelegt.',
    savedNotification: 'Deine Lesezeichen wurden erfolgreich gespeichert! 😊',
    modal: {
        title: 'Bezeichnung',
        url: 'Adresse',
    },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'Bookmarks',
    description:
        'Who even uses the bookmarks feature of their browser? The one integrated in Better-Moodle is way cooler!',
    settings: {
        enabled: {
            name: 'Enable bookmarks manager',
            description:
                'Enables a bookmarks manager to allow bookmarks within Moodle.',
        },
    },
    bookmarks: 'Bookmarks',
    add: 'Add bookmark',
    edit: 'Edit bookmarks',
    empty: 'No bookmarks created yet.',
    savedNotification: 'Your bookmarks were saved successfully! 😊',
    modal: {
        title: 'Title',
        url: 'Adress',
    },
} as typeof de;

export default { de, en };
