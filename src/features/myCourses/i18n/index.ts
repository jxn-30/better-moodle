import cardsPerRow from './cardsPerRow';
import type { FeatureGroupTranslation } from '#/i18n';
import navbarDropdown from './navbarDropdown';

export const de = {
    name: 'Kurse & Meine Kurse',
    features: {
        navbarDropdown: navbarDropdown.de,
        cardsPerRow: cardsPerRow.de,
    },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'Courses & My Courses',
    features: {
        navbarDropdown: navbarDropdown.en,
        cardsPerRow: cardsPerRow.en,
    },
} satisfies typeof de;

export default { de, en };
