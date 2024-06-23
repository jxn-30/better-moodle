import FeatureGroup from '../../_lib/FeatureGroup';

const features = new Set<string>(['cardsPerRow', 'navbarDropdown']);

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
