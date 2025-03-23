import { FeatureTranslation } from '#/i18n';

export const de = {
    settings: {
        hide: {
            name: 'Hinweis zur Selbsteinschreibung ohne Einschreibeschlüssel ausblenden',
            description:
                'Moodle zeigt einen Hinweis an, wenn bei einem Kurs die Selbsteinschreibung ohne Einschreibeschlüssel aktiviert ist. Manche empfinden diesen Hinweis als störend, deshalb kann er mit dieser Einstellung ausgeblendet werden.',
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        hide: {
            name: 'Hide hint for self-enrollment without enrollment key',
            description:
                'Moodle displays a hint when self-enrollment without an enrollment key is enabled for a course. Some people find this hint annoying, so it can be hidden with this setting.',
        },
    },
} as typeof de;

export default { de, en };
