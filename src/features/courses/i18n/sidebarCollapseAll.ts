import { FeatureTranslation } from '#/i18n';

export const de = {
    settings: {
        enabled: {
            name: 'Seitenleiste vollständig ein-/ausklappen',
            description:
                'Klappt alle Abschnitte in der Seitenleiste ein oder aus, wenn doppelt auf einen der Pfeile in der Seitenleiste geklickt wird.',
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        enabled: {
            name: 'Fully collapse/expand sidebar',
            description:
                'Collapses or expands all sections in the sidebar when one of the arrows in the sidebar is double-clicked.',
        },
    },
} as typeof de;

export default { de, en };
