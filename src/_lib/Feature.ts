import FeatureGroup from './FeatureGroup';

/**
 * A class representing a generic Feature
 */
export abstract class Feature {
    readonly #id: string;
    readonly #group: FeatureGroup;

    /**
     * create a new feature with a specific id
     * @param id - the id of this feature without the group prefix
     * @param group - the group this feature belongs to
     */
    protected constructor(id: string, group: FeatureGroup) {
        this.#id = id;
        this.#group = group;
    }

    /**
     * the full ID of this feature, prefixed by the group ID
     * @returns the ID of this feature
     */
    get id() {
        return `${this.#group.id}.${this.#id}`;
    }
}
