import { JSX } from 'jsx-dom';
import { LocalizedString } from 'typesafe-i18n';
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
> {
    readonly #id: string;
    readonly #default: Type;
    #feature: Feature<Group, Feat> | FeatureGroup<Group> | undefined;

    /**
     * Constructor
     * @param id - the setting id
     * @param defaultValue - the default value of this setting
     */
    protected constructor(id: string, defaultValue: Type) {
        this.#id = id;
        this.#default = defaultValue;

        // in V1, setting keys in storage were prefixed
        // this migrates the old storage key for this setting
        const prefixedKey = PREFIX(this.settingKey);
        const undefinedValue = crypto.randomUUID();
        const oldValue = GM_getValue(prefixedKey, undefinedValue);
        if (oldValue !== undefinedValue) {
            GM_setValue(this.settingKey, oldValue);
            GM_deleteValue(prefixedKey);
        }
    }

    /**
     * The feature this setting belongs to
     * @returns the feature this setting belongs to
     */
    get feature(): Feature<Group, Feat> | FeatureGroup<Group> | undefined {
        return this.#feature;
    }

    abstract get formControl(): JSX.Element;

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
     */
    abstract get value(): Type;

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

        // TODO: use Moodle mustache templates instead?
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
     * Adds an input event listener
     * @param listener - the event listener
     * @returns the setting itself
     */
    onInput(listener: EventListener) {
        // TODO: bind this to the listener
        this.formControl.addEventListener('input', listener);
        return this;
    }
}
