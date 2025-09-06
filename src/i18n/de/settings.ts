import type { BaseTranslation } from '../i18n-types';
import { Tag } from '@/Setting';

export default {
    newBadge: 'Neu!',
    modal: {
        title: 'Einstellungen',
        moodleSettings: 'Zu den Moodle Einstellungen',
        installedVersion: 'installierte Version',
        latestVersion: 'aktuellste Version',
        import: 'Einstellungen importieren',
        export: 'Einstellungen exportieren',
        search: 'Suche...',
    },
    changelog: 'Changelog',
    requireReload:
        'Die Änderungen dieser Einstellung (*{name: string}*) werden erst nach einem Neuladen der Seite übernommen.  \nDas Speichern der Einstellungen führt daher automatisch zu einem Neuladen der Seite.',
    saved: 'Alle Einstellungen wurden erfolgreich gespeichert und angewendet. Viel Spaß mit deinem individualisierten Better-Moodle! 😊',
    sync: 'Die Einstellung "{name: string}" wurde in einem anderen Tab geändert und von dort übernommen.',
    syncRequireReload:
        'Du hast eine Einstellung (*{name: string}*) in einem anderen Tab geändert, die ein Neuladen der Seite erfordert.  \nBitte lade die Seite neu, um diese Änderungen zu übernehmen.',
    tags: { fun: 'Spaßeinstellung' } satisfies Record<Tag, string>,
} satisfies BaseTranslation;
