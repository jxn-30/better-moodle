import { Translation } from '../i18n-types';

export default {
    newBadge: 'New!',
    modal: {
        title: 'Preferences',
        moodleSettings: 'Go to Moodle-Preferences',
        installedVersion: 'installed version',
        latestVersion: 'latest Version',
        import: 'import preferences',
        export: 'export preferences',
    },
    changelog: 'Changelog',
    requireReload:
        'The changes of this setting will only take effect after reloading the page.<br/>Saving the settings will therefore automatically reload the page.',
    tags: {
        fun: 'Fun setting',
    },
} satisfies Translation['settings'];
