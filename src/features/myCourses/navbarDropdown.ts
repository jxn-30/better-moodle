import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';
import { getAvailableCourseFiltersAsOptions } from '@/myCourses';
import { SelectSetting } from '@/Settings/SelectSetting';

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
