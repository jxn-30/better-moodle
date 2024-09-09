import { FeatureGroupID } from '../FeatureGroup';
import { FeatureID } from '../Feature';
import Setting from '../Setting';
import { Select, SelectComponent } from '../Components';

/**
 * A setting that can be either true or false
 * displayed as a switch
 */
export class SelectSetting<
    Group extends FeatureGroupID = FeatureGroupID,
    Feat extends FeatureID<Group> = FeatureID<Group>,
> extends Setting<
    Group,
    Feat,
    string,
    SelectComponent['params'],
    SelectComponent
> {
    /**
     * Constructor
     * @param id - the setting id
     * @param defaultValue - the default value of this setting
     * @param options - the options of this select
     */
    constructor(
        id: string,
        defaultValue: string,
        options: SelectComponent['params']['options']
    ) {
        super(id, defaultValue, Select, { options });
    }
}
