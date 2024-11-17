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
    },
    changelog: 'Changelog',
    requireReload:
        'Die Änderungen dieser Einstellung werden erst nach einem Neuladen der Seite übernommen.<br/>Das Speichern der Einstellungen führt daher automatisch zu einem Neuladen der Seite.',
    tags: {
        fun: 'Spaßeinstellung',
    } satisfies Record<Tag, string>,
} satisfies BaseTranslation;
