import FeatureGroup from '#lib/FeatureGroup';

const features = new Set<string>([
    'cardsPerRow',
    'navbarDropdown',
    'grades',
    'images',
    'quickRoleChange',
    'noDownload',
    'sectionCourseIndex',
    'hideSelfEnrolHint',
    'sidebarCollapseAll',
]);

// this was introduced during 401.
if (__MOODLE_VERSION__ < 402) features.add('courseIndexDrawerControls');

export default FeatureGroup.register({ features });
