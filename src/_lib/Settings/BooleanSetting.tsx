import { FeatureGroupID } from '../FeatureGroup';
import { FeatureID } from '../Feature';
import Setting from '../Setting';
import { Switch, SwitchComponent } from '../Components';

/**
 * A setting that can be either true or false
 * displayed as a switch
 */
export class BooleanSetting<
    Group extends FeatureGroupID = FeatureGroupID,
    Feat extends FeatureID<Group> = FeatureID<Group>,
> extends Setting<
    Group,
    Feat,
    boolean,
    SwitchComponent['params'],
    SwitchComponent
> {
    /**
     * Constructor
     * @param id - the setting id
     * @param defaultValue - the default value of this setting
     */
    constructor(id: string, defaultValue: boolean) {
        super(id, defaultValue, Switch, {});
    }
}
