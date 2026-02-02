import { FeatureTranslation } from '#types/i18n';

export const de = {
    settings: {
        enabled: {
            name: 'Volle Breite',
            description:
                'Entfernt den seltsamen weißen Rand und sorgt dafür, dass die Seiten die volle Breite nutzen.',
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        enabled: {
            name: 'Full Width',
            description:
                'Removes the weird white border and makes pages use the full width.',
        },
    },
} as typeof de;

export default { de, en };
