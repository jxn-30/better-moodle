import cardsPerRow from './cardsPerRow';
import type { FeatureGroupTranslation } from '../../../../types/i18n';
import navbarDropdown from './navbarDropdown';

export const de = {
    name: 'Meine Kurse',
    features: {
        fullWidth: navbarDropdown.de,
        externalLinks: cardsPerRow.de,
    },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'My Courses',
    features: {
        fullWidth: navbarDropdown.en,
        externalLinks: cardsPerRow.en,
    },
} satisfies typeof de;

export default { de, en };
