import Feature from './Feature';
import FeatureGroup from './FeatureGroup';
import { JSX } from 'jsx-dom';
import { domID, PREFIX } from './helpers';

/**
 * A base class
 */
export default abstract class Setting<Type = unknown> {
    readonly #id: string;
    readonly #default: Type;
    #feature: Feature | FeatureGroup | undefined;

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
     * Set the feature this setting belongs to
     * @param feature - the feature this setting belongs to
     * @throws {Error} if the feature is already set
     */
    set feature(feature: Feature | FeatureGroup) {
        if (this.#feature) throw new Error('Cannot reassign feature');
        this.#feature = feature;
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
    get value() {
        return GM_getValue(this.settingKey, this.#default);
    }

    /**
     * sets the value of the setting and saves it to storage
     */
    set value(newVal: Type) {
        GM_setValue(this.settingKey, newVal);
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
        return (
            <div className="form-group row fitem">
                <div className="col-md-5 col-form-label d-flex pb-0 pt-0">
                    <label
                        className="d-inline word-break"
                        htmlFor={this.inputID}
                    >
                        {this.id}
                    </label>
                    <div className="form-label-addon d-flex align-items-center align-self-start">
                        <button
                            className="btn btn-link p-0"
                            data-container="body"
                            data-toggle="popover"
                            data-placement="right"
                            data-content="Placeholder"
                            data-trigger="focus"
                            tabIndex={0}
                        >
                            <i className="icon fa fa-question-circle text-info fa-fw"></i>
                        </button>
                    </div>
                </div>
                <div
                    className="col-md-7 form-inline align-items-start felement overflow-hidden"
                    data-setting={this.id}
                >
                    {this.formControl}
                </div>
            </div>
        );
    }
}
