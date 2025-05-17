import { FeatureTranslation } from '#/i18n';

export const de = {
    settings: {
        mode: {
            name: 'CAU Knöpfe',
            description:
                'Wähle einen schöneren Weg, um die SOS Knöpfe der CAU darzustellen.',
            options: {
                default: 'Standard',
            },
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        mode: {
            name: 'CAU Buttons',
            description:
                'Choose a nicer way to display the SOS buttons of the CAU.',
            options: {
                default: 'Default',
            },
        },
    },
} as typeof de;

export default { de, en };
