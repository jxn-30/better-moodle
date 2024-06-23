import Feature from './Feature';
import Setting from './Setting';

type FeatureGroupMethods = Partial<
    Record<'init' | 'onload' | 'onunload', (this: FeatureGroup) => void>
>;

/**
 * A class that represents a group of features
 * cannot be instantiated directly but using the register method will return an instantiable version of this class
 */
export default abstract class FeatureGroup {
    /**
     * This registering workaround is necessary so that we can have readonly private id that is automatically generated from the filepath
     * @param args - the methods that are to be implemented
     * @param args.settings - a list of settings for this group but not for the features
     * @param args.features - a list of feature-IDs this group contains in order of appearance in settings
     * @returns a class that can be instantiated
     */
    static register({
        settings = [],
        features = new Set<string>(),
        ...methods
    }: { settings?: Setting[]; features?: Set<string> } & FeatureGroupMethods) {
        console.log(settings, features, methods);

        /**
         * The instantiable version of the FeatureGroup class
         */
        return class FeatureGroup extends this {
            /**
             * The constructor for the FeatureGroup class
             * methods are not passed via constructor but via the register method
             * @param id - the ID of this feature group
             */
            constructor(id: string) {
                super(id, methods);
            }

            /**
             * @param loadFn
             */
            loadFeatures(loadFn: (featureId: string) => Feature | undefined) {
                if (this.#features.size) throw Error('Features already loaded');
                console.log(features);
                features.forEach(id => {
                    const feature = loadFn(id);
                    if (feature) {
                        this.#features.add(feature);
                    }
                });
            }
        };
    }

    readonly #id: string;
    readonly #init: FeatureGroupMethods['init'];
    readonly #onload: FeatureGroupMethods['onload'];
    readonly #onunload: FeatureGroupMethods['onunload'];

    readonly #features = new Set<Feature>();

    #initCalled = false;
    #loaded = false;

    /**
     * create a new feature group with a specific id
     * @param id - the id of this feature group
     * @param methods - the methods that are to be implemented (init, onload, onunload)
     */
    protected constructor(id: string, methods: FeatureGroupMethods) {
        this.#id = id;
        this.#init = methods.init;
        this.#onload = methods.onload;
        this.#onunload = methods.onunload;
    }

    /**
     * The ID of this feature group
     * @returns the ID of this feature group
     */
    get id() {
        return this.#id;
    }

    /**
     *  Initialize the feature group
     *  calls #init internally
     *  @throws {Error} if init is called multiple times
     */
    init() {
        if (this.#initCalled) {
            throw Error(
                'init already called. Cannot init a FeatureGroup multiple times.'
            );
        }
        this.#initCalled = true;

        this.#init?.();
    }

    /**
     * Load the feature group
     * calls #onload internally
     * @throws {Error} if the feature group is already loaded
     */
    load() {
        if (this.#loaded) {
            throw Error(`FeatureGroup ${this.id} already loaded.`);
        }
        this.#loaded = true;

        this.#onload?.();
    }

    /**
     * Unload the feature group
     * calls #onunload internally
     * cleans if the feature group is no longer needed
     * @throws {Error} if the feature group is already unloaded
     */
    unload() {
        if (!this.#loaded) {
            throw Error(`FeatureGroup ${this.id} already unloaded.`);
        }
        this.#loaded = false;

        this.#onunload?.();
    }
}
