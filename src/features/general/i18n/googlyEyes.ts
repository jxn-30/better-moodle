import { FeatureTranslation } from '#types/i18n';

export const de = {
    settings: {
        enabled: { name: 'xEyes für Better-Moodle', description: '👀' },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        enabled: { name: 'xEyes for Better-Moodle', description: '👀' },
    },
} satisfies typeof de;

export default { de, en };
