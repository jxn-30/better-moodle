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
    #formControl: ReturnType<typeof Switch> | undefined;

    /**
     * Constructor
     * @param id - the setting id
     * @param defaultValue - the default value of this setting
     */
    constructor(id: string, defaultValue: boolean) {
        super(id, defaultValue);

        void this.callWhenReady(() => {
            this.#formControl = Switch({
                id: this.inputID,
                value: this.savedValue,
            });

            this.#formControl.addEventListener(
                'change',
                () => (this.unsafedValue = this.#formControl!.value)
            );
        });
    }

    /**
     * Do the undo action
     */
    undo() {
        super.undo();
        this.#formControl!.value = this.savedValue;
        this.#formControl!.dispatchEvent(new Event('input'));
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
     * gets the current (live) value of this setting
     * @returns the current value of this setting
     */
    get value() {
        return this.#formControl!.value;
    }
}
