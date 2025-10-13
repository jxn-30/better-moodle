import type { FeatureGroupTranslation } from '#/i18n';

export const de = {
    name: 'Links kennzeichnen',
    description:
        'Manchmal ist es nicht ganz einfach zu erkennen, was sich hinter einem Link versteckt. Diese Einstellungen helfen dir, besondere Links besser zu erkennen.',
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
        phone: {
            name: 'Telefonnummern',
            description:
                'Zeigt ein kleines Icon an, wenn ein Link zu einer Telefonnummer führt.',
        },
        webex: {
            name: 'Webex',
            description:
                'Zeigt ein kleines Icon an, wenn ein Link zu Webex führt.',
        },
    },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'Mark links',
    description:
        'Sometimes it is hard to identify what is hidden behind a link. These settings help you identify special links.',
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
        phone: {
            name: 'Phone',
            description:
                'Shows a small icon next to links that are phone numbers.',
        },
        webex: {
            name: 'Webex',
            description: 'Shows a small icon next to links that lead to webex.',
        },
    },
} as typeof de;

export default { de, en };
