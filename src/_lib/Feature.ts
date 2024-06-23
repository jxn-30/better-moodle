import FeatureGroup from './FeatureGroup';
import Setting from './Setting';

type FeatureMethods = Partial<
    Record<'init' | 'onload' | 'onunload', (this: Feature) => void>
>;

/**
 * A class that represents a single feature
 * cannot be instantiated directly but using the register method will return an instantiable version of this class
 */
export default abstract class Feature {
    /**
     * This registering workaround is necessary so that we can have readonly private id that is automatically generated from the filepath
     * @param args - the methods that are to be implemented
     * @param args.settings - the settings for this feature
     * @returns a class that can be instantiated
     */
    static register({
        settings,
        ...methods
    }: { settings?: Setting[] } & FeatureMethods) {
        console.log(settings, methods);

        /**
         * The instantiable version of the Feature class
         */
        return class Feature extends this {
            /**
             * The constructor for the Feature class
             * methods are not passed via constructor but via the register method
             * @param id - the ID of this feature
             * @param group
             */
            constructor(id: string, group: FeatureGroup) {
                super(id, group, methods);
            }
        };
    }

    readonly #id: string;
    readonly #group: FeatureGroup;
    readonly #init: FeatureMethods['init'];
    readonly #onload: FeatureMethods['onload'];
    readonly #onunload: FeatureMethods['onunload'];

    #initCalled = false;
    #loaded = false;

    /**
     * create a new feature with a specific id
     * @param id - the id of this feature
     * @param group
     * @param methods - the methods that are to be implemented (init, onload, onunload)
     */
    protected constructor(
        id: string,
        group: FeatureGroup,
        methods: FeatureMethods
    ) {
        this.#id = id;
        this.#group = group;
        this.#init = methods.init;
        this.#onload = methods.onload;
        this.#onunload = methods.onunload;
    }

    /**
     * The ID of this feature
     * @returns the ID of this feature
     */
    get id() {
        return `${this.#group.id}.${this.#id}`;
    }

    /**
     *  Initialize the feature
     *  calls #init internally
     *  @returns the result of the init method
     *  @throws {Error} if init is called multiple times
     */
    init() {
        if (this.#initCalled) {
            throw Error(
                'init already called. Cannot init a Feature multiple times.'
            );
        }
        this.#initCalled = true;

        return this.#init?.();
    }

    /**
     * Load the feature
     * calls #onload internally
     * @throws {Error} if the feature is already loaded
     */
    load() {
        if (this.#loaded) {
            throw Error(`Feature ${this.id} already loaded.`);
        }
        this.#loaded = true;

        this.#onload?.();
    }

    /**
     * Unload the feature
     * calls #onunload internally
     * cleans if the feature is no longer needed
     * @throws {Error} if the feature is already unloaded
     */
    unload() {
        if (!this.#loaded) {
            throw Error(`Feature ${this.id} already unloaded.`);
        }
        this.#loaded = false;

        this.#onunload?.();
    }
}
