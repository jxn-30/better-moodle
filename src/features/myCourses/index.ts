import FeatureGroup from '../../_lib/FeatureGroup';

console.log("we're loading the myCourses feature group");

export default FeatureGroup.register({
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
