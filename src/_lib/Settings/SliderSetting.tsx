import { FeatureGroupID } from '../FeatureGroup';
import { FeatureID } from '../Feature';
import Setting from '../Setting';
import { Slider, SliderComponent } from '../Components';

/**
 * A setting that can be either true or false
 * displayed as a switch
 */
export class SliderSetting<
    Group extends FeatureGroupID = FeatureGroupID,
    Feat extends FeatureID<Group> = FeatureID<Group>,
> extends Setting<
    Group,
    Feat,
    number,
    SliderComponent['params'],
    SliderComponent
> {
    /**
     * Constructor
     * @param id - the setting id
     * @param defaultValue - the default value of this setting
     * @param params - further parameters for this setting
     */
    constructor(
        id: string,
        defaultValue: number,
        params: SliderComponent['params']
    ) {
        super(id, defaultValue, Slider, params);
    }

    /**
     * Turns the old storage format (string) into the new format (number)
     * @param oldValue - the old value
     * @returns the numbered value
     */
    migrateStoredValue(oldValue: unknown): number {
        return Number(oldValue);
    }
}
