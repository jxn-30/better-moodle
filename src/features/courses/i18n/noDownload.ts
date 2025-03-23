import { FeatureTranslation } from '#/i18n';

export const de = {
    settings: {
        enabled: {
            name: 'Download verhindern',
            description:
                'Versucht den automatischen Download von Dateien so oft wie möglich zu verhindern (klappt nicht immer).',
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        enabled: {
            name: 'Prevent download',
            description:
                "Tries to prevent the automatic download of files as often as possible (doesn't always work).",
        },
    },
} as typeof de;

export default { de, en };
