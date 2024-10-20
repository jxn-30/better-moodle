import CanBeReady from './CanBeReady';
import { GenericSetting } from './Components';
import { JSX } from 'jsx-dom';
import { LL } from '../i18n/i18n';
import { LocalizedString } from 'typesafe-i18n';
import { require } from './require.js';
import TempStorage from './TempStorage';
import { UUID } from 'node:crypto';
import { domID, PREFIX } from './helpers';
import Feature, { FeatureID, FeatureTranslations } from './Feature';
import FeatureGroup, { FeatureGroupID } from './FeatureGroup';

export type SettingTranslations<
    Group extends FeatureGroupID,
    Feat extends FeatureID<Group>,
    T extends
        FeatureTranslations<Group>[Feat] = FeatureTranslations<Group>[Feat],
> = 'settings' extends keyof T ? T['settings'] : Record<string, never>;

type ComparisonCondition = '==' | '!=' | '>' | '<';

const tags = {
    fun: '🎡',
} as const;

type Tags = typeof tags;
export type Tag = keyof Tags;

/**
 * Create a span element for a tag
 * @param tag - the tag to display
 * @returns the tag element
 */
const Tag = (tag: Tag) => (
    <span title={`${tags[tag]}: ${LL.settings.tags[tag]()}`}>{tags[tag]}</span>
);

/**
 * A base class
 */
export default abstract class Setting<
    Group extends FeatureGroupID = FeatureGroupID,
    Feat extends FeatureID<Group> = FeatureID<Group>,
    Type = unknown,
    Params extends Record<string, unknown> = Record<string, unknown>,
    Component extends GenericSetting<
        Type,
        JSX.Element,
        Params
    > = GenericSetting<Type, JSX.Element, Params>,
> extends CanBeReady {
    readonly #id: string;
    readonly #default: Type;
    readonly #tags = new Set<Tag>();
    #feature: Feature<Group, Feat> | FeatureGroup<Group> | undefined;

    #formControl: Component['element'] | undefined;

    #unsavedValue: Type;

    #conditionalDisabledStates = new Map<string, boolean>();

    /**
     * Constructor
     * @param id - the setting id
     * @param defaultValue - the default value of this setting
     * @param createComponent - the function that creates the component
     * @param params - further parameters for this setting
     */
    protected constructor(
        id: string,
        defaultValue: Type,
        createComponent: Component['create'],
        params: Component['params']
    ) {
        super();

        this.#id = id;
        this.#default = defaultValue;

        this.#unsavedValue = this.savedValue;

        void this.callWhenReady(() => {
            this.#formControl = createComponent({
                id: this.inputID,
                value: this.savedValue,
                ...params,
            });

            this.#formControl.addEventListener(
                'change',
                () => (this.#unsavedValue = this.#formControl!.value)
            );

            // in V1, setting keys in storage were prefixed
            // this migrates the old storage key for this setting
            this.#migrateSettingStorage();
        });
    }

    /**
     * Migrates the stored value of this setting from an old format to the new one
     * Extending classes should override this method if they need to migrate the stored value
     * @param oldValue - the old stored value
     * @returns the new value
     */
    migrateStoredValue(oldValue: unknown): Type {
        return oldValue as Type;
    }

    /**
     * This migrates a settings storage from an old key to a new one.
     * It tries both, a prefixed (V1) and a non-prefixed version of the key
     * @param key - the old key of this setting
     */
    #migrateSettingStorage(key = PREFIX(this.settingKey)) {
        const undefinedValue = crypto.randomUUID();
        const oldValue: UUID | Type = GM_getValue(key, undefinedValue);
        if (oldValue !== undefinedValue) {
            if (!GM_listValues().includes(this.settingKey)) {
                const migratedValue =
                    this.migrateStoredValue(oldValue) ?? (oldValue as Type);
                GM_setValue(this.settingKey, migratedValue);
                this.#formControl!.value = this.#unsavedValue = migratedValue;
                this.save();
            }
            GM_deleteValue(key);
        } else if (!key.startsWith(__PREFIX__)) {
            this.#migrateSettingStorage(PREFIX(key));
        }
    }

    /**
     * Sets an alias for this setting (e.g. if the key has been renamed) to allow migrating the storage
     * @param key - the alias key of this setting
     * @returns the setting itself
     */
    addAlias(key: string) {
        void this.callWhenReady(() => this.#migrateSettingStorage(key));
        return this;
    }

    /**
     * The feature this setting belongs to
     * @returns the feature this setting belongs to
     */
    get feature(): Feature<Group, Feat> | FeatureGroup<Group> | undefined {
        return this.#feature;
    }
    /**
     * Set the feature this setting belongs to
     * @param feature - the feature this setting belongs to
     * @throws {Error} if the feature is already set
     */
    set feature(feature: Feature<Group, Feat> | FeatureGroup<Group>) {
        if (this.#feature) throw new Error('Cannot reassign feature');
        this.#feature = feature;
        this.instanceReady();
    }

    /**
     * The form control element used in the settings modal
     * @returns the form control element
     */
    get formControl() {
        if (!this.#formControl) throw new Error('Form control not ready');
        return this.#formControl;
    }

    /**
     * The ID of this setting
     * @returns the full ID of this setting
     */
    get id() {
        return `${this.#feature?.id ?? ''}.${this.#id}`;
    }

    /**
     * The actual saved value of this setting or alternatively the default value
     * @returns the current value of this setting
     */
    get savedValue() {
        return GM_getValue(this.settingKey, this.#default);
    }

    /**
     * sets the value of the setting and saves it to storage
     */
    set savedValue(newVal: Type) {
        GM_setValue(this.settingKey, newVal);
    }

    /**
     * The current (live) value of this setting
     * @returns the current value of this setting
     */
    get value(): Type {
        return this.#formControl!.value;
    }

    /**
     * The ID of the input element
     * @returns the input ID
     */
    get inputID() {
        return domID(this.settingKey);
    }

    /**
     * The fully qualified setting key
     * @returns the setting key
     */
    get settingKey() {
        return `settings.${this.id}`;
    }

    /**
     * The translation of this setting
     * @returns the translation of this setting
     */
    get Translation(): SettingTranslations<Group, Feat> {
        // @ts-expect-error we need to find a way to type this correctly
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
        return this.#feature?.Translation.settings[this.#id];
    }

    /**
     * The FormGroup for this setting
     * @returns the form group
     */
    get formGroup() {
        // TODO: remove typing issue suppressing comments once Feature.Translation is correctly typed

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const title: LocalizedString =
            // @ts-expect-error we need to find a way to type this correctly
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this.Translation?.name() ?? this.#id;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const description: LocalizedString =
            // @ts-expect-error we need to find a way to type this correctly
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            this.Translation?.description() ?? this.#id;

        const descriptionBtn = (
            <button
                className="btn btn-link p-0"
                data-container="body"
                data-toggle="popover"
                data-placement="right"
                data-content={description}
                data-trigger="focus"
                tabIndex={0}
            >
                <i className="icon fa fa-question-circle text-info fa-fw"></i>
            </button>
        );

        descriptionBtn.addEventListener('click', e => e.preventDefault());

        const tags = Array.from(this.#tags.values());

        return (
            <div
                className="form-group row fitem"
                data-tags={JSON.stringify(tags)}
            >
                <div className="col-md-5 col-form-label d-flex pb-0 pt-0">
                    <label
                        className="d-inline word-break"
                        htmlFor={this.inputID}
                    >
                        {this.#tags.size ?
                            <>[{tags.map(tag => Tag(tag))}]&nbsp;</>
                        :   ''}
                        {title}
                    </label>
                    <div className="form-label-addon d-flex align-items-center align-self-start">
                        {descriptionBtn}
                    </div>
                </div>
                <div
                    className="col-md-7 form-inline align-items-start felement overflow-hidden"
                    data-setting={this.id}
                >
                    {this.formControl}
                </div>
            </div>
        ) as HTMLDivElement;
    }

    /**
     * Saves the current value of this setting
     */
    public save() {
        this.savedValue = this.#unsavedValue;
    }

    /**
     * Resets the setting to its default value
     */
    reset() {
        this.savedValue = this.#default;
        if (this.#formControl) {
            this.#formControl.value = this.savedValue;
            this.#formControl.dispatchEvent(new Event('input'));
        }
    }

    /**
     * Undoes the last change to the setting
     */
    undo() {
        this.#unsavedValue = this.savedValue;
        if (this.#formControl) {
            this.#formControl.value = this.savedValue;
            this.#formControl.dispatchEvent(new Event('input'));
        }
    }

    /**
     * Tell the user that a reload is required to apply the changes of this setting.
     * This is used for settings that require a reload to apply the changes because live changes would be to complex to implement.
     * @returns the setting itself
     */
    requireReload() {
        this.onChange(() => {
            // we don't want to show or set if the value stays the same (e.g. after an undo operation)
            if (this.#unsavedValue === this.savedValue) return;
            // show a toast notification
            require(['core/toast'] as const, ({ add }) => {
                void add(LL.settings.requireReload(), {
                    type: 'info',
                    autohide: false,
                    closeButton: true,
                });
            });
            // remember that a reload is required
            TempStorage.settingsRequireReload = true;
        });
        return this;
    }

    /**
     * Adds a change event listener. Do NOT update the setting value in the listener, otherwise this may result in infinite loops!
     * @param listener - the event listener
     * @returns the setting itself
     */
    onChange(listener: EventListener) {
        void this.callWhenReady(() =>
            this.formControl.addEventListener('change', listener)
        );
        return this;
    }

    /**
     * Adds an input event listener
     * @param listener - the event listener
     * @returns the setting itself
     */
    onInput(listener: EventListener) {
        void this.callWhenReady(() =>
            this.formControl.addEventListener('input', listener)
        );
        return this;
    }

    /**
     * Conditionally disables this setting based on the value of another setting
     * @param otherSetting - the other setting to check the value of
     * @param condition - the condition to use for comparison
     * @param comparisonValue - the value to compare against
     * @returns the setting itself
     */
    disabledIf<S extends Setting>(
        otherSetting: S,
        condition: ComparisonCondition,
        comparisonValue: S['value']
    ) {
        const uuid = crypto.randomUUID();

        /**
         * Check if the setting should be disabled.
         * Disabled if the condition is met.
         */
        const check = () => {
            if (!this.#formControl) return;

            const currentValue = otherSetting.#unsavedValue;
            let isDisabled = false;
            switch (condition) {
                case '==':
                    isDisabled = currentValue === comparisonValue;
                    break;
                case '!=':
                    isDisabled = currentValue !== comparisonValue;
                    break;
            }
            this.#conditionalDisabledStates.set(uuid, isDisabled);

            this.#formControl.disabled = Array.from(
                this.#conditionalDisabledStates.values()
            ).some(s => s);
        };

        otherSetting.onChange(check);
        void this.callWhenReady(() => otherSetting.callWhenReady(check));

        return this;
    }

    /**
     * Adds a tag to this setting.
     * @param tag - the tag to add
     * @returns the setting itself
     */
    addTag(tag: Tag) {
        this.#tags.add(tag);
        return this;
    }
}
