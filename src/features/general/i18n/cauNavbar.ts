import { FeatureTranslation } from '#/i18n';

export const de = {
    settings: {
        mode: {
            name: 'CAU Knöpfe',
            description:
                'Wähle einen schöneren Weg, um die SOS Knöpfe der CAU darzustellen.',
            options: { default: 'Standard' },
        },
    },
    buttons: {
        sos: { sos: 'SOS' },
        discrimination: {
            discriminationSexism: 'Diskriminierung / Sexismus',
            report: 'melden',
            getHelp: 'Hilfe erhalten',
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        mode: {
            name: 'CAU Buttons',
            description:
                'Choose a nicer way to display the SOS buttons of the CAU.',
            options: { default: 'Default' },
        },
    },
    buttons: {
        sos: { sos: 'SOS' },
        discrimination: {
            discriminationSexism: 'Discrimination / Sexism',
            report: 'report',
            getHelp: 'get help',
        },
    },
} as typeof de;

export default { de, en };
