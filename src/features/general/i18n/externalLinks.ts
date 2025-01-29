import { FeatureTranslation } from '#/i18n';

export const de = {
    settings: {
        enabled: {
            name: 'Externe Links',
            description:
                'Sorgt dafür, dass externe Links immer automatisch in einem neuen Tab geöffnet werden.',
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        enabled: {
            name: 'External links',
            description:
                'Ensures that external links are always automatically opened in a new tab.',
        },
    },
} as typeof de;

export default { de, en };
