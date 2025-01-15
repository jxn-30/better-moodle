import cardsPerRow from './cardsPerRow';
import courseIndexDrawerControls from './courseIndexDrawerControls';
import type { FeatureGroupTranslation } from '#/i18n';
import grades from './grades';
import images from './images';
import navbarDropdown from './navbarDropdown';

export const de = {
    name: 'Kurse & Meine Kurse',
    features: {
        navbarDropdown: navbarDropdown.de,
        cardsPerRow: cardsPerRow.de,
        grades: grades.de,
        courseIndexDrawerControls: courseIndexDrawerControls.de,
        images: images.de,
    },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'Courses & My Courses',
    features: {
        navbarDropdown: navbarDropdown.en,
        cardsPerRow: cardsPerRow.en,
        grades: grades.en,
        courseIndexDrawerControls: courseIndexDrawerControls.en,
        images: images.en,
    },
} satisfies typeof de;

export default { de, en };
