import type { FeatureGroupTranslation } from '#/i18n';
import layout from './layout';

export const de = {
    name: 'Dashboard',
    description:
        'Mit diesen Einstellungen kannst du dir das Aussehen des Dashboards ein kleines bisschen individualisieren.',
    features: { layout: layout.de },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'Dashboard',
    description:
        'These settings allow you to customise the dashboard a little.',
    features: { layout: layout.en },
} as typeof de;

export default { de, en };
