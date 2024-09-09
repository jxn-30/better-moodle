import CanBeReady from './CanBeReady';
import { GenericSetting } from './Components';
import { JSX } from 'jsx-dom';
import { LL } from '../i18n/i18n';
import { LocalizedString } from 'typesafe-i18n';
import { require } from './require.js';
import TempStorage from './TempStorage';
import { UUID } from 'node:crypto';
import { domID, PREFIX } from './helpers';
import Feature, { FeatureID } from './Feature';
import FeatureGroup, { FeatureGroupID } from './FeatureGroup';

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
    #feature: Feature<Group, Feat> | FeatureGroup<Group> | undefined;

    #formControl: Component['element'] | undefined;

    #unsavedValue: Type;

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

        // in V1, setting keys in storage were prefixed
        // this migrates the old storage key for this setting
        this.#migrateSettingStorage();

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
        });
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
            void this.callWhenReady(() => {
                if (!GM_listValues().includes(this.settingKey)) {
                    GM_setValue(this.settingKey, oldValue);
                    this.#formControl!.value = this.#unsavedValue =
                        oldValue as Type;
                    this.save();
                }
            });
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
     * The FormGroup for this setting
     * @returns the form group
     */
    get formGroup() {
        // TODO: remove typing issue suppressing comments once Feature.Translation is correctly typed

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const title: LocalizedString =
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
            this.#feature?.Translation.settings?.[this.#id]?.name() ?? this.#id;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const description: LocalizedString =
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
            this.#feature?.Translation.settings?.[this.#id]?.description() ??
            this.#id;

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

        return (
            <div className="form-group row fitem">
                <div className="col-md-5 col-form-label d-flex pb-0 pt-0">
                    <label
                        className="d-inline word-break"
                        htmlFor={this.inputID}
                    >
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
}
