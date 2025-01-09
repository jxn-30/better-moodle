import FeatureGroup from '@/FeatureGroup';

const features = new Set<string>(['cardsPerRow', 'navbarDropdown', 'grades']);

export default FeatureGroup.register({
    features,
});
