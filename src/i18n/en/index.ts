import { en as bookmarks } from '../../features/bookmarks/i18n';
import { en as courses } from '../../features/courses/i18n';
import { en as darkmode } from '../../features/darkmode/i18n';
import { en as dashboard } from '../../features/dashboard/i18n';
import { en as general } from '../../features/general/i18n';
import { en as linkIcons } from '../../features/linkIcons/i18n';
import { en as messages } from '../../features/messages/i18n';
import { en as navbarMarquee } from '../../features/navbarMarquee/i18n';
import { en as semesterzeiten } from '../../features/semesterzeiten/i18n';
import settings from './settings';
import { en as speiseplan } from '../../features/speiseplan/i18n';
import type { Translation } from '../i18n-types';
import { en as weather } from '../../features/weather/i18n';

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
    browserCheck: {
        title: 'Better-Moodle: Unsupported Browser',
        browser: 'Browser',
        minVersion: 'Minimum supported version',
        dismiss: {
            version: 'Hide for this Browser-Version',
            session: 'Hide for this session',
        },
        body: `
Moin!


Unfortunately you seem to use a Browser that is not officially supported by Better-Moodle.
Some features may not work correctly.

To allow the use of modern Code and to maintain maximum security, Better-Moodle suggests using an up-to-date browser.
For further information, please see [https://better-moodle.dev](https://better-moodle.dev).

These Browsers are officially supported (Better-Moodle Core-Developers recommend Firefox):
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
        semesterzeiten,
        speiseplan,
        weather,
    },
    numbers: {
        1: 'one',
        2: 'two',
        3: 'three',
        4: 'four',
        5: 'five',
        6: 'six',
        7: 'seven',
        8: 'right',
        9: 'nine',
        10: 'ten',
        11: 'eleven',
        12: 'twelve',
    },
} as Translation;
