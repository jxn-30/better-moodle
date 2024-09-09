import type { BaseTranslation } from '../i18n-types';

export default {
    newBadge: 'Neu!',
    modal: {
        title: 'Einstellungen',
        moodleSettings: 'Zu den Moodle Einstellungen',
        installedVersion: 'installierte Version',
        latestVersion: 'aktuellste Version',
        updateBtn: 'Update installieren',
        import: 'Einstellungen importieren',
        export: 'Einstellungen exportieren',
    },
    changelog: 'Changelog',
    requireReload:
        'Die Änderungen dieser Einstellung werden erst nach einem Neuladen der Seite übernommen.<br/>Das Speichern der Einstellungen führt daher automatisch zu einem Neuladen der Seite.',
} satisfies BaseTranslation;
