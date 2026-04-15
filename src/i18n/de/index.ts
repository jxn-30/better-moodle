import type { BaseTranslation } from '../i18n-types';
import { de as bookmarks } from '../../features/bookmarks/i18n';
import { de as courses } from '../../features/courses/i18n';
import { de as darkmode } from '../../features/darkmode/i18n';
import { de as dashboard } from '../../features/dashboard/i18n';
import { de as general } from '../../features/general/i18n';
import { de as linkIcons } from '../../features/linkIcons/i18n';
import { de as messages } from '../../features/messages/i18n';
import { de as navbarMarquee } from '../../features/navbarMarquee/i18n';
import { de as nina } from '../../features/nina/i18n';
import { de as semesterzeiten } from '../../features/semesterzeiten/i18n';
import settings from './settings';
import { de as speiseplan } from '../../features/speiseplan/i18n';
import { de as weather } from '../../features/weather/i18n';

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

{{|Um zu erfahren, was sich seit deinem letzten Update getan hat, hier der relevante Auszug aus dem Changelog:}}
`.trim(),
    },
    support: {
        title: 'Hilfe zu Better-Moodle',
        close: 'Vielen Dank für die Hilfe! 😊',
    },
    language: { flag: '🇩🇪', name: 'Deutsch' },
    browserCheck: {
        title: 'Better-Moodle: Browser nicht unterstützt',
        browser: 'Browser',
        minVersion: 'Älteste noch unterstützte Version',
        dismiss: {
            version: 'Für diese Browser-Version ausblenden',
            session: 'Für diese Sitzung ausblenden',
        },
        body: `
Hallo!

Leider scheinst du einen Browser zu nutzen, der nicht offiziell von Better-Moodle unterstützt wird.
Daher kann es sein, dass manche Features nicht korrekt funktionieren.

Um möglichst modernen Code schreiben zu können und aus Sicherheitsgründen, empfiehlt Better-Moodle die Verwendung eines aktuellen Browsers.
Für weitere Informationen kann [https://better-moodle.dev](https://better-moodle.dev) konsultiert werden.

Die offiziell unterstützten Browser (Das Better-Moodle Core-Team empfiehlt Firefox):
`.trim(),
    },
    features: {
        bookmarks,
        courses,
        darkmode,
        dashboard,
        general,
        linkIcons,
        messages,
        navbarMarquee,
        nina,
        semesterzeiten,
        speiseplan,
        weather,
    },
    numbers: {
        1: 'eins',
        2: 'zwei',
        3: 'drei',
        4: 'vier',
        5: 'fünf',
        6: 'sechs',
        7: 'sieben',
        8: 'acht',
        9: 'neun',
        10: 'zehn',
        11: 'elf',
        12: 'zwölf',
    },
    switchReleaseChannel: {
        modal: { abort: 'Wechsel abbrechen', install: 'Installation beginnen' },
        channels: {
            stable: `
Hallo!

Du wechselst nun zurück zum Release-Channel \`stable\`!

Das heißt: Du erhälst Updates, sobald sie als stabil genug angesehen werden. Manchmal kann es daher ein bisschen brauchen, bis neue Features und Bugfixes bei dir ankommen. Dafür ist es unwahrscheinlicher (wenn auch nicht ausgeschlossen), dass du dann auch nervige Bugs in Better-Moodle hast.

Um den Wechsel zu vollziehen musst du einmal das Userscript neu installieren.
Hierzu wirst du von deinem Userscript-Manager ein Popup erhalten, in dem du die Installation dann noch bestätigen musst.
`,
            nightly: `
Hallo!

Du wechselst nun zum Release-Channel \`nightly\`!

Das heißt: Du erhälst Updates sobald sie geschrieben wurden. Zwar erhälst du neue Features und Bugfixes dann früher, aber du hast auch potentiell mehr Bugs in Better-Moodle. Wenn du einen neuen Bug durch ein Nightly-Update entdeckst, freuen wir uns natürlich über eine entsprechende Meldung.

Um den Wechsel zu vollziehen musst du einmal das Userscript neu installieren.
Hierzu wirst du von deinem Userscript-Manager ein Popup erhalten, in dem du die Installation dann noch bestätigen musst.
`,
        },
    },
} satisfies BaseTranslation;
