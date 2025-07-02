import { FeatureTranslation } from '#/i18n';

export const de = {
    settings: {
        enabled: {
            name: 'Sekundäre Navigation nach links',
            description:
                'Sorgt dafür, dass die sekundäre Navigation (z.\xa0B. unter dem Kurs-Namen) nach links geschoben statt zentriert ist.',
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        enabled: {
            name: 'Pull secondary navigation to the left',
            description:
                'Pulls the secondary navigation (e.g. below the course name) to the left instead of it being centered',
        },
    },
} as typeof de;

export default { de, en };
