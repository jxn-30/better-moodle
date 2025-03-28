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
        search: 'Search...',
    },
    changelog: 'Changelog',
    requireReload:
        'The changes of this setting (*{name}*) will only take effect after reloading the page.  \nSaving the settings will therefore automatically reload the page.',
    saved: 'All settings have been successfully saved and applied. Have fun with your customised Better-Moodle! 😊',
    tags: {
        fun: 'Fun setting',
    },
} satisfies Translation['settings'];
