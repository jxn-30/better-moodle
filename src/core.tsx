import './style/global.module.scss';
import './settingsModal';
import { BooleanSetting } from './_lib/Settings/BooleanSetting';
import featureGroups from './_lib/featureGroups';
import { ready } from './_lib/DOM';

const test = new BooleanSetting('test', true);
ready(() => document.getElementById('page-footer')?.append(test.formControl));

console.log(test);

console.log(featureGroups);