import FeatureGroup from '@/FeatureGroup';

const features = new Set<string>([
    'cardsPerRow',
    'navbarDropdown',
    'grades',
    'images',
    'quickRoleChange',
]);

// this was introduced during 401.
if (__MOODLE_VERSION__ < 402) features.add('courseIndexDrawerControls');

export default FeatureGroup.register({
    features,
});
