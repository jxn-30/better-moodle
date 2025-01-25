import { FeatureTranslation } from '#/i18n';

export const de = {
    settings: {
        enabled: {
            name: 'Schneller Rollenwechsel',
            description:
                'Ermöglicht es (mit den passenden Berechtigungen), die Betrachtung eines Kurses mit einer anderen Rolle direkt über das Profil-Dropdown zu ändern.',
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        enabled: {
            name: 'Quick role change',
            description:
                'Allows (with the appropriate permissions) to change the view of a course with a different role directly via the profile dropdown.',
        },
    },
} satisfies typeof de;

export default { de, en };
