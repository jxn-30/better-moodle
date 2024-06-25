import { en as darkmode } from '../../features/darkmode/i18n';
import { en as general } from '../../features/general/i18n';
import { en as myCourses } from '../../features/myCourses/i18n';
import settings from './settings';
import type { Translation } from '../i18n-types';

export default {
    settings,
    language: {
        flag: '🇬🇧',
        name: 'English',
    },
    darkmode,
    general,
    myCourses,
} satisfies Translation;
