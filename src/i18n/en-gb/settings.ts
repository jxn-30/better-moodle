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
    sync: 'The setting "{name}" has been changed in another tab and has been adopted from there.',
    syncRequireReload:
        'You have changed a setting (*{name}*) in another tab that require reloading the page.  \nPlease reload the page to apply these changes.',
    tags: { fun: 'Fun setting' },
} satisfies Translation['settings'];
