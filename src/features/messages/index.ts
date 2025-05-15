import FeatureGroup from '@/FeatureGroup';

const features = new Set<string>(['markdownSupport', 'sendHotkey']);

export default FeatureGroup.register({ features });
