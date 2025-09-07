import { FeatureTranslation } from '#/i18n';

export const de = {
    settings: {
        enabled: {
            name: 'Countdown bis Heiligabend 🎄',
            description:
                'Zeigt einen Countdown bis Heiligabend in der Navigationsleiste an.\nHierbei handelt es sich um eine kleine Hommage an den Mathe-Vorkurs.',
        },
    },
    remaining: 'Noch **{days}** Tag{{e}} bis Heiligabend.',
    christmas: '🎄 Heute ist Heiligabend. Frohe Weihnachten! 🎄',
} satisfies FeatureTranslation;

export const en = {
    settings: {
        enabled: {
            name: 'Countdown to Christmas Eve 🎄',
            description:
                'Displays a countdown to Christmas Eve in the navigation bar.\nThis is a small homage to the math pre-course.',
        },
    },
    remaining: "It's **{days}** day{{s}} until Christmas Eve.",
    christmas: '🎄 Today is Christmas Eve. Merry Christmas! 🎄',
} as typeof de;

export default { de, en };
