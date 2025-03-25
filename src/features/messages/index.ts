import FeatureGroup from '@/FeatureGroup';
import type Setting from '@/Setting';

const settings = new Set<Setting>();

const features = new Set<string>(['markdownSupport']);

export default FeatureGroup.register({
    settings,
    features,
});
