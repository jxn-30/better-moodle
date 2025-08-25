import { FeatureGroupID } from '../FeatureGroup';
import { FeatureID } from '../Feature';
import Setting from '../Setting';
import { type TextComponent, TextInput } from '../Components';

/**
 * A setting that can be either true or false
 * displayed as a switch
 */
export class TextSetting<
    Group extends FeatureGroupID = FeatureGroupID,
    Feat extends FeatureID<Group> = FeatureID<Group>,
> extends Setting<Group, Feat, string, TextComponent['params'], TextComponent> {
    /**
     * Constructor
     * @param id - the setting id
     * @param defaultValue - the default value of this setting
     */
    constructor(id: string, defaultValue: string) {
        super(id, defaultValue, TextInput, {});
    }
}
