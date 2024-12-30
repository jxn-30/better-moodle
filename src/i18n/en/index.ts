import { en as darkmode } from '../../features/darkmode/i18n';
import { en as dashboard } from '../../features/dashboard/i18n';
import { en as general } from '../../features/general/i18n';
import { en as linkIcons } from '../../features/linkIcons/i18n';
import { en as myCourses } from '../../features/myCourses/i18n';
import settings from './settings';
import type { Translation } from '../i18n-types';

export default {
    settings,
    update: {
        btn: 'Install update',
        title: 'Update Better-Moodle',
        close: 'Close without reload',
        reload: 'Reload moodle',
        body: `
Uh, an update for Better-Moodle is ready for installation 👀

If you haven't already done so, please follow the instructions of your userscript manager to install the update. A new tab may have been opened in the background. To complete the update, please reload Moodle once after the installation.

To find out what has changed since your last update, here is the relevant extract from the changelog:
`.trim(),
    },
    support: {
        title: 'Support for Better-Moodle',
        close: 'Thanks for the great support! 😊',
    },
    language: {
        flag: '🇬🇧',
        name: 'English',
    },
    features: {
        darkmode,
        dashboard,
        general,
        linkIcons,
        myCourses,
    },
} satisfies Translation;
