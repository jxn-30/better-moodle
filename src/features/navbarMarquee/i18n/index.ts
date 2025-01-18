import clock from './clock';
import type { FeatureGroupTranslation } from '#/i18n';

export const de = {
    name: 'Laufband (Navigationsleiste)',
    description:
        'Die Navigationsleiste eignet sich prima, um dort nützliche Informationen anzuzeigen.',
    features: { clock: clock.de },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'Marquee (Navigation bar)s',
    description:
        'The top navigation bar is perfect to show usefull information.',
    features: { clock: clock.en },
} satisfies typeof de;

export default { de, en };
