import type { FeatureGroupTranslation } from '#/i18n';
import markdownSupport from './markdownSupport';

export const de = {
    name: 'Mitteilungen',
    features: {
        markdownSupport: markdownSupport.de,
    },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'Messages',
    features: {
        markdownSupport: markdownSupport.en,
    },
} as typeof de;

export default { de, en };
