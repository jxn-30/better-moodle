import FeatureGroup from '@/FeatureGroup';

const features = new Set<string>(['markdownSupport']);

export default FeatureGroup.register({
    features,
});
