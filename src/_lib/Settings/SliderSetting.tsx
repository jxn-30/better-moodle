import { FeatureGroupID } from '../FeatureGroup';
import { FeatureID } from '../Feature';
import Setting from '../Setting';
import { Slider, SliderSetting as SliderSettingType } from '../Components';

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
    SliderSettingType['params'],
    SliderSettingType
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
        params: SliderSettingType['params']
    ) {
        super(id, defaultValue, Slider, params);
    }
}
