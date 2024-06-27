import Setting from './Setting';
import FeatureGroup, {
    FeatureGroupID,
    FeatureGroupTranslations,
} from './FeatureGroup';

export type FeatureTranslations<
    Group extends FeatureGroupID,
    T extends FeatureGroupTranslations<Group> = FeatureGroupTranslations<Group>,
> = 'features' extends keyof T ? T['features'] : Record<string, never>;

export type FeatureID<Group extends FeatureGroupID> =
    keyof FeatureTranslations<Group>;

type FeatureMethods<
    Group extends FeatureGroupID,
    ID extends FeatureID<Group>,
> = Partial<
    Record<'init' | 'onload' | 'onunload', (this: Feature<Group, ID>) => void>
>;

/**
 * A class that represents a single feature
 * cannot be instantiated directly but using the register method will return an instantiable version of this class
 */
export default abstract class Feature<
    Group extends FeatureGroupID,
    ID extends FeatureID<Group> = FeatureID<Group>,
> {
    /**
     * This registering workaround is necessary so that we can have readonly private id that is automatically generated from the filepath
     * @param args - the methods that are to be implemented
     * @param args.settings - the settings for this feature
     * @returns a class that can be instantiated
     */
    static register<Group extends FeatureGroupID, ID extends FeatureID<Group>>({
        settings,
        ...methods
    }: { settings?: Set<Setting<Group, ID>> } & FeatureMethods<Group, ID>) {
        console.log(settings, methods);

        /**
         * The instantiable version of the Feature class
         */
        return class Feature extends this<Group, ID> {
            /**
             * The constructor for the Feature class
             * methods are not passed via constructor but via the register method
             * @param id - the ID of this feature
             * @param group - the group this feature belongs to
             */
            constructor(id: ID, group: FeatureGroup<Group>) {
                super(
                    id,
                    group,
                    settings ?? new Set<Setting<Group, ID>>(),
                    methods
                );
            }
        };
    }

    readonly #id: ID;
    readonly #group: FeatureGroup<Group>;
    readonly #settings: Set<Setting<Group, ID>>;
    readonly #init: FeatureMethods<Group, ID>['init'];
    readonly #onload: FeatureMethods<Group, ID>['onload'];
    readonly #onunload: FeatureMethods<Group, ID>['onunload'];

    readonly #FormGroups: Element[] = [];

    #initCalled = false;
    #loaded = false;

    /**
     * create a new feature with a specific id
     * @param id - the id of this feature
     * @param group - the group this feature belongs to
     * @param settings - the settings of this group
     * @param methods - the methods that are to be implemented (init, onload, onunload)
     */
    protected constructor(
        id: ID,
        group: FeatureGroup<Group>,
        settings: Set<Setting<Group, ID>>,
        methods: FeatureMethods<Group, ID>
    ) {
        this.#id = id;
        this.#group = group;
        this.#settings = settings;
        this.#init = methods.init;
        this.#onload = methods.onload;
        this.#onunload = methods.onunload;

        this.#settings.forEach(setting => {
            setting.feature = this;
            this.#FormGroups.push(setting.formGroup);
        });
    }

    /**
     * The ID of this feature
     * @returns the ID of this feature
     */
    get id() {
        // @ts-expect-error as TS for some reason thinks that ID can be a symbol???
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        return `${this.#group.id}.${this.#id}`;
    }

    /**
     * Get the translations for exactly this feature
     * @returns the translations for this feature
     */
    get Translation() {
        // TODO!
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return 'features' in this.#group.Translation ?
                // @ts-expect-error TODO: is there a way to make this work without ts-expect-error?
                this.#group.Translation.features[this.#id]
            :   undefined;
    }

    /**
     * get the form groups of the settings of this feature
     * @returns the form groups of the settings of this feature
     */
    get formGroups() {
        return this.#FormGroups;
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
