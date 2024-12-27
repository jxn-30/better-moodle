import './style/index.module.scss';
import './migrateStorage';
import awaitImports from '@/imports';

import './settingsModal';

void awaitImports().then(featureGroups => console.log(featureGroups));

// prints wether the current browser is officially supported
console.log(
    new RegExp(__UA_REGEX__, __UA_REGEX_FLAGS__).test(navigator.userAgent)
);
