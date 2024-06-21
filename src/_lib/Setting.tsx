import { domID, PREFIX } from './helpers';

/**
 * A base class
 */
export abstract class Setting<Type> {
    readonly #id: string;
    readonly #default: Type;

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

    abstract get formControl(): Element;

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
        return `settings.${this.#id}`;
    }
}