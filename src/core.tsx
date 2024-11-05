import './style/global.module.scss';
import featureGroups from '@/imports';

import './settingsModal';
import Drawer from '@/Drawer';
console.log(featureGroups);

void new Drawer('test')
    .setIcon('graduation-cap')
    .setToggleTitle('Öffne Test-Sidebar')
    .setContent(
        (
            <>
                Hello <b>world</b>! 🦣
            </>
        ) as DocumentFragment
    )
    .create()
    .then(console.log);
