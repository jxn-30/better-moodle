import FeatureGroup from '../../_lib/FeatureGroup';

console.log("we're loading the general feature group");

const features = new Set<string>();
features.add('fullWidth');

export default FeatureGroup.register({
    features,
    /**
     * TODO
     */
    init(this) {
        console.log('init', this.id);
    },

    /**
     * TODO
     */
    onload(this) {
        console.log('load', this.id);
    },

    /**
     * TODO
     */
    onunload(this) {
        console.log('unload', this.id);
    },
});
