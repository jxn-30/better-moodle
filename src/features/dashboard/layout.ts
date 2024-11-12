//import { isDashboard, isLoggedIn } from '@/helpers';
import { BooleanSetting } from '@/Settings/BooleanSetting';
import Feature from '@/Feature';

const leftSidebarEnabled = new BooleanSetting('leftSidebar', true);
const rightSidebarEnabled = new BooleanSetting('rightSidebar', true);

export default Feature.register({
    settings: new Set([leftSidebarEnabled, rightSidebarEnabled]),
});
