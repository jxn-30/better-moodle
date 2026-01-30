import { FeatureTranslation } from '#types/i18n';

export const de = {
    settings: {
        enabled: {
            name: 'Seitenleiste ein-/ausklappen',
            description:
                'Fügt Knöpfe hinzu, die ermöglichen, all Abschnitte der Seitenleiste auf einmal ein- bzw. auszuklappen.',
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        enabled: {
            name: 'Fully collapse/expand sidebar',
            description:
                'Adds controls to collapse/expand all sections in the sidebar at once.',
        },
    },
} as typeof de;

export default { de, en };
