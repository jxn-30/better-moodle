import type { FeatureGroupTranslation } from '#/i18n';
import layout from './layout';

export const de = {
    name: 'Dashboard',
    features: {
        layout: layout.de,
    },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'Dashboard',
    features: {
        layout: layout.en,
    },
} as typeof de;

export default { de, en };
