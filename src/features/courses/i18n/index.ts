import cardsPerRow from './cardsPerRow';
import courseIndexDrawerControls from './courseIndexDrawerControls';
import type { FeatureGroupTranslation } from '#/i18n';
import grades from './grades';
import hideSelfEnrolHint from './hideSelfEnrolHint';
import images from './images';
import navbarDropdown from './navbarDropdown';
import noDownload from './noDownload';
import quickRoleChange from './quickRoleChange';
import sectionCourseIndex from './sectionCourseIndex';

export const de = {
    name: 'Kurse & Meine Kurse',
    description:
        'Hier findest du diverse Einstellungen, die die Moodle-Kurse und die "Meine Kurse"-Seite betrifft.',
    features: {
        navbarDropdown: navbarDropdown.de,
        cardsPerRow: cardsPerRow.de,
        grades: grades.de,
        courseIndexDrawerControls: courseIndexDrawerControls.de,
        images: images.de,
        quickRoleChange: quickRoleChange.de,
        noDownload: noDownload.de,
        hideSelfEnrolHint: hideSelfEnrolHint.de,
        sectionCourseIndex: sectionCourseIndex.de,
    },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'Courses & My Courses',
    description:
        'You can find diverse settings regarding the moodle courses and the "My courses" page.',
    features: {
        navbarDropdown: navbarDropdown.en,
        cardsPerRow: cardsPerRow.en,
        grades: grades.en,
        courseIndexDrawerControls: courseIndexDrawerControls.en,
        images: images.en,
        quickRoleChange: quickRoleChange.en,
        noDownload: noDownload.en,
        hideSelfEnrolHint: hideSelfEnrolHint.en,
        sectionCourseIndex: sectionCourseIndex.en,
    },
} as typeof de;

export default { de, en };
