import Feature from './Feature';
import { FieldSet } from './Components';
import globalStyle from '../style/global.module.scss';
import { LL } from '../i18n/i18n';
import Setting from './Setting';
import settingsStyle from '../style/settings.module.scss';
import { Translation } from '../i18n/i18n-types';

export type FeatureGroupID = keyof Translation['features'];
export type FeatureGroupTranslations<
    ID extends FeatureGroupID = FeatureGroupID,
> = Translation['features'][ID];

type FeatureGroupMethods<ID extends FeatureGroupID> = Partial<
    Record<'init' | 'onload' | 'onunload', (this: FeatureGroup<ID>) => void>
>;

/**
 * A class that represents a group of features
 * cannot be instantiated directly but using the register method will return an instantiable version of this class
 */
export default abstract class FeatureGroup<ID extends FeatureGroupID> {
    /**
     * This registering workaround is necessary so that we can have readonly private id that is automatically generated from the filepath
     * @param args - the methods that are to be implemented
     * @param args.settings - a set of settings for this group (but not settings for features)
     * @param args.features - a set of feature-IDs this group contains in order of appearance in settings
     * @returns a class that can be instantiated
     */
    static register<ID extends FeatureGroupID>({
        settings = new Set<Setting<ID>>(),
        features = new Set<string>(),
        ...methods
    }: {
        settings?: Set<Setting<ID>>;
        features?: Set<string>;
    } & FeatureGroupMethods<ID>) {
        /**
         * The instantiable version of the FeatureGroup class
         */
        return class FeatureGroup extends this<ID> {
            /**
             * The constructor for the FeatureGroup class
             * methods are not passed via constructor but via the register method
             * @param id - the ID of this feature group
             */
            constructor(id: ID) {
                super(id, settings ?? new Set<Setting<ID>>(), methods);
            }

            /**
             * load the features for this group
             * @param loadFn - a function that actually loads the feature
             * @throws {Error} if the features are already loaded
             */
            async loadFeatures(
                loadFn: (featureId: string) => Feature<ID> | undefined
            ) {
                if (this.#features.size) throw Error('Features already loaded');
                if (!features) return;
                for (const id of features) {
                    const feature = loadFn(id);
                    if (feature) {
                        feature.load();
                        this.#features.add(feature);
                        await this.#FieldSet.appendToContainer(
                            ...feature.formGroups
                        );
                    }
                }

                if (this.hasNewSetting) {
                    void this.#FieldSet.heading.then(heading =>
                        heading?.append(
                            <span
                                className={[
                                    'badge badge-success text-uppercase',
                                    globalStyle.shining,
                                    globalStyle.sparkling,
                                    settingsStyle.newSettingBadge,
                                ]}
                            >
                                {LL.settings.newBadge()}
                            </span>
                        )
                    );
                }
            }
        };
    }

    readonly #id: ID;
    readonly #settings: Set<Setting<ID>>;
    readonly #init: FeatureGroupMethods<ID>['init'];
    readonly #onload: FeatureGroupMethods<ID>['onload'];
    readonly #onunload: FeatureGroupMethods<ID>['onunload'];

    readonly #features = new Set<Feature<ID>>();

    readonly #FieldSet: ReturnType<typeof FieldSet>;

    #initCalled = false;
    #settingsLoaded = false;
    #loaded = false;

    /**
     * create a new feature group with a specific id
     * @param id - the id of this feature group
     * @param settings - the settings for this feature group that are independent of a specific feature
     * @param methods - the methods that are to be implemented (init, onload, onunload)
     */
    protected constructor(
        id: ID,
        settings: Set<Setting<ID>>,
        methods: FeatureGroupMethods<ID>
    ) {
        this.#id = id;
        this.#settings = settings;
        this.#init = methods.init;
        this.#onload = methods.onload;
        this.#onunload = methods.onunload;

        this.#FieldSet = FieldSet({
            id: `settings-fieldset-${this.id}`,
            title: this.title,
            description: this.description,
            collapsed: id !== 'general',
        });
    }

    /**
     * Append the setting form groups to the fieldset.
     */
    async loadSettings() {
        if (this.#settingsLoaded) {
            throw new Error(
                'Settings for this FeatureGroup are already loaded!'
            );
        }
        this.#settingsLoaded = true;
        for (const setting of this.#settings) {
            setting.feature = this;
            await this.#FieldSet.appendToContainer(setting.formGroup);
        }
    }

    /**
     * The ID of this feature group
     * @returns the ID of this feature group
     */
    get id(): ID {
        return this.#id;
    }

    /**
     * The <fieldset> Element containing all settings for this group
     * @returns the <fieldset> Element containing all settings for this group
     */
    get FieldSet() {
        return this.#FieldSet;
    }

    /**
     * Get the translations for exactly this feature group
     * @returns the translations for this feature group
     */
    get Translation() {
        return LL.features[this.id];
    }

    /**
     *  The title of the feature group
     *  @returns the title of the feature group
     */
    get title() {
        return this.Translation.name();
    }

    /**
     * The description of the feature group
     * @returns the description of the feature group or an empty string otherwise
     */
    get description() {
        return 'description' in this.Translation ?
                this.Translation.description()
            :   '';
    }

    /**
     * Does this feature group have a setting that is unseen?
     * @returns wether this feature group or any of its features has a new setting
     */
    get hasNewSetting() {
        return (
            this.#settings.values().some(setting => setting.isNewSetting) ||
            this.#features.values().some(feature => feature.hasNewSetting)
        );
    }

    /**
     * The IDs of all settings this featureGroup has
     * @returns a list of IDs
     */
    get settingIDs() {
        return [
            ...this.#settings.values().map(setting => setting.id),
            ...this.#features.values().flatMap(feature => feature.settingIDs),
        ];
    }

    /**
     * A map that allows accessing all settings of this featureGroup by all of their IDs
     * @returns the map
     */
    get settingIDMap() {
        return new Map([
            ...this.#settings
                .values()
                .flatMap(setting => setting.idMap.entries()),
            ...this.#features
                .values()
                .flatMap(feature => feature.settingIDMap.entries()),
        ]);
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

    /**
     * Reload (unload and load) the feature group
     */
    reload() {
        this.unload();
        this.load();
    }

    /**
     * Reset all settings of this feature group and of it's features
     */
    resetSettings() {
        this.#settings.forEach(setting => setting.reset());
        this.#features.forEach(feature => feature.resetSettings());
    }

    /**
     * Undo all settings of this feature group and of it's features
     */
    undoSettings() {
        this.#settings.forEach(setting => setting.undo());
        this.#features.forEach(feature => feature.undoSettings());
    }

    /**
     * Save all settings of this feature group and of it's features
     */
    saveSettings() {
        this.#settings.forEach(setting => setting.save());
        this.#features.forEach(feature => feature.saveSettings());
    }
}
