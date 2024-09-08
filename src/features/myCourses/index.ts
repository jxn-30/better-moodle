import FeatureGroup from '../../_lib/FeatureGroup';

const features = new Set<string>(['cardsPerRow', 'navbarDropdown']);

export default FeatureGroup.register({
    features,
});
