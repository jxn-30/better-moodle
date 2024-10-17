import { BooleanSetting } from '../../_lib/Settings/BooleanSetting';
import Feature from '../../_lib/Feature';
import { getAvailableCourseFiltersAsOptions } from '../../_lib/myCourses';
import { SelectSetting } from '../../_lib/Settings/SelectSetting';

const enabled = new BooleanSetting('enabled', true).addAlias(
    'myCourses.navbarDropdown'
);
const filter = new SelectSetting(
    'filter',
    '_sync',
    getAvailableCourseFiltersAsOptions()
)
    .addAlias('myCourses.navbarDropdownFilter')
    .disabledIf(enabled, '==', false);

export default Feature.register({
    settings: new Set([enabled, filter]),
    /**
     * TODO
     */
    init(this) {
        console.log('init', this.id);
    },
});
