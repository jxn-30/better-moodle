import christmasCountdown from './christmasCountdown';
import clock from './clock';
import type { FeatureGroupTranslation } from '#/i18n';

export const de = {
    name: 'Laufband (Navigationsleiste)',
    description:
        'Die Navigationsleiste eignet sich prima, um dort nützliche Informationen anzuzeigen.',
    settings: {
        speed: {
            name: 'Geschwindigkeit',
            description: 'Passe hier die Geschwindigkeit des Laufbands an.',
        },
    },
    features: { clock: clock.de, christmasCountdown: christmasCountdown.de },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'Marquee (Navigation bar)',
    description:
        'The top navigation bar is perfect to show usefull information.',
    settings: {
        speed: {
            name: 'Speed',
            description: 'Adjust the speed of the Marquee here.',
        },
    },
    features: { clock: clock.en, christmasCountdown: christmasCountdown.en },
} as typeof de;

export default { de, en };
