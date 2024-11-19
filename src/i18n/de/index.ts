import type { BaseTranslation } from '../i18n-types';
import { de as darkmode } from '../../features/darkmode/i18n';
import { de as dashboard } from '../../features/dashboard/i18n';
import { de as general } from '../../features/general/i18n';
import { de as linkIcons } from '../../features/linkIcons/i18n';
import { de as myCourses } from '../../features/myCourses/i18n';
import settings from './settings';

export default {
    settings,
    update: {
        btn: 'Update installieren',
        title: 'Better-Moodle aktualisieren',
        close: 'Ohne Neuladen schließen',
        reload: 'Moodle neuladen',
        body: `
Uiiii, ein Update für Better-Moodle ist bereit zur Installation 👀

Falls noch nicht geschehen, befolge bitte die Anweisungen deines Userscript-Managers, um das Update zu installieren. Ggf. wurde ein neuer Tab im Hintergrund geöffnet. Um das Update abzuschließen, lade bitte Moodle nach der Installation einmal neu.

Um zu erfahren, was sich seit deinem letzten Update getan hat, hier der relevante Auszug aus dem Changelog:
`.trim(),
    },
    support: {
        title: 'Hilfe zu Better-Moodle',
        close: 'Vielen Dank für die Hilfe! 😊',
    },
    language: {
        flag: '🇩🇪',
        name: 'Deutsch',
    },
    features: {
        darkmode,
        dashboard,
        general,
        linkIcons,
        myCourses,
    },
} satisfies BaseTranslation;
