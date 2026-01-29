import FeatureGroup from '#lib/FeatureGroup';

const features = new Set<string>(['markdownSupport', 'sendHotkey']);

export default FeatureGroup.register({ features });
