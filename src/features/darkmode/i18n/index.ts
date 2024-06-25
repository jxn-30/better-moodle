import type { FeatureGroupTranslation } from '../../../../types/i18n';

export const de = {
    name: 'Darkmode',
    description:
        'Der in Better-Moodle integrierte Darkmode wird durch [Dark Reader](https://darkreader.org/) generiert. 😊',
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'Darkmode',
    description:
        'Darkmode in Better-Moodle is brought to you through [Dark Reader](https://darkreader.org/). 😊',
} satisfies typeof de;

export default { de, en };
