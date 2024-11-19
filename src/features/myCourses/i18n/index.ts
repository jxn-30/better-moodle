import cardsPerRow from './cardsPerRow';
import type { FeatureGroupTranslation } from '#/i18n';
import navbarDropdown from './navbarDropdown';

export const de = {
    name: 'Meine Kurse',
    features: {
        navbarDropdown: navbarDropdown.de,
        cardsPerRow: cardsPerRow.de,
    },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'My Courses',
    features: {
        navbarDropdown: navbarDropdown.en,
        cardsPerRow: cardsPerRow.en,
    },
} satisfies typeof de;

export default { de, en };
