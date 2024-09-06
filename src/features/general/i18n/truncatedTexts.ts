import { FeatureTranslation } from '../../../../types/i18n';

export const de = {
    settings: {
        enabled: {
            name: 'Abgeschnittene Texte',
            description:
                'Fügt ein Title-Attribut bei potentiell abgeschnittenen Texten hinzu, damit man per Maus-Hover den vollen Text lesen kann.',
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        enabled: {
            name: 'Truncated texts',
            description:
                'Adds a title attribute to potentially truncated texts so that you can read the full text via mouse hover.',
        },
    },
} satisfies typeof de;

export default { de, en };
