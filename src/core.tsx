import './style/index.module.scss';
import './migrateStorage';
import awaitImports from '@/imports';

import './settingsModal';

void awaitImports().then(featureGroups => console.log(featureGroups));
