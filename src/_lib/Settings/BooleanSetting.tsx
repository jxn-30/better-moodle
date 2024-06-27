import { FeatureGroupID } from '../FeatureGroup';
import { FeatureID } from '../Feature';
import Setting from '../Setting';
import { Switch } from '../Components';

/**
 * A setting that can be either true or false
 * displayed as a switch
 */
export class BooleanSetting<
    Group extends FeatureGroupID = FeatureGroupID,
    Feat extends FeatureID<Group> = FeatureID<Group>,
> extends Setting<Group, Feat, boolean> {
    readonly #formControl = Switch({ id: this.inputID, value: this.value });

    /**
     * Constructor
     * @param id - the setting id
     * @param defaultValue - the default value of this setting
     */
    constructor(id: string, defaultValue: boolean) {
        super(id, defaultValue);

        this.#formControl.addEventListener(
            'change',
            () => (this.value = this.#formControl.value)
        );
    }

    /**
     * The form control element used in the settings modal
     * @returns the form control element
     */
    get formControl() {
        return this.#formControl;
    }

    /**
     * gets the value of the setting
     * required as getter and setter both need to be overridden
     * @returns the current value of this setting
     */
    get value() {
        return super.value;
    }

    /**
     * sets the value of the setting and saves it to storage
     * @param newVal - the new value of the setting
     */
    set value(newVal: boolean) {
        this.#formControl.value = newVal;
        super.value = newVal;
    }
}
