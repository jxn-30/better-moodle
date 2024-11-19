import type { FeatureGroupTranslation } from '#/i18n';

export const de = {
    name: 'Links kennzeichnen',
    settings: {
        external: {
            name: 'Externe Links',
            description:
                'Zeigt ein kleines Icon an, wenn ein Link extern ist, also aus Moodle heraus führt.',
        },
        mail: {
            name: 'Emails',
            description:
                'Zeigt ein kleines Icon an, wenn ein Link deinen Email-Client öffnen kann.',
        },
    },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'Mark links',
    settings: {
        external: {
            name: 'Mark links: external links',
            description:
                'Shows a small icon next to links that lead away from this Moodle instance.',
        },
        mail: {
            name: 'Mark links: Emails',
            description:
                'Shows a small icon next to links that can open your Email-Client.',
        },
    },
} satisfies typeof de;

export default { de, en };
