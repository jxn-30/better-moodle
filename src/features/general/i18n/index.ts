import externalLinks from './externalLinks';
import type { FeatureGroupTranslation } from '../../../../types/i18n';
import fullWidth from './fullWidth';
import truncatedTexts from './truncatedTexts';

export const de = {
    name: 'Allgemeine Einstellungen',
    features: {
        fullWidth: fullWidth.de,
        externalLinks: externalLinks.de,
        truncatedTexts: truncatedTexts.de,
    },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'General Settings',
    features: {
        fullWidth: fullWidth.en,
        externalLinks: externalLinks.en,
        truncatedTexts: truncatedTexts.en,
    },
} satisfies typeof de;

export default { de, en };
