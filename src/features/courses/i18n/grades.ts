import { FeatureTranslation } from '#types/i18n';

export const de = {
    grades: 'Bewertungen',
    settings: {
        enabled: {
            name: 'Link zu Bewertungen in der Sidebar',
            description:
                'Zeigt einen Link zu den Bewertungen des Kurses in der linken Seitenleiste an.',
        },
        newTab: {
            name: 'Bewertungen in neuem Tab öffnen',
            description:
                'Öffnet die Bewertungen standardmäßig einem neuen Tab.',
        },
    },
} satisfies FeatureTranslation;

export const en = {
    grades: 'Grades',
    settings: {
        enabled: {
            name: 'Link to grades in the sidebar',
            description:
                "Displays a link to the course's grades in the left sidebar.",
        },
        newTab: {
            name: 'Open grades in new tab',
            description: 'Opens the grades in a new tab by default.',
        },
    },
} as typeof de;

export default { de, en };
