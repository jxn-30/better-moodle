import type { BaseTranslation } from '../i18n-types';
import { de as darkmode } from '../../features/darkmode/i18n';
import { de as dashboard } from '../../features/dashboard/i18n';
import { de as general } from '../../features/general/i18n';
import { de as myCourses } from '../../features/myCourses/i18n';
import settings from './settings';

export default {
    settings,
    language: {
        flag: '🇩🇪',
        name: 'Deutsch',
    },
    features: {
        darkmode,
        dashboard,
        general,
        myCourses,
    },
} satisfies BaseTranslation;
