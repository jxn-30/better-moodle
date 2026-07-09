import { FeatureTranslation } from '#types/i18n';

export const de = {
    settings: {
        enabled: {
            name: 'Countdown bis Heiligabend 🎄',
            description:
                'Zeigt einen Countdown bis Heiligabend in der Navigationsleiste an.\nHierbei handelt es sich um eine kleine Hommage an den Mathe-Vorkurs.',
        },
        short: {
            name: 'Verkürzte Anzeige 🎄',
            description:
                'Zeigt den Countdown mit weniger Text außenrum an. Das ist nützlich, um Platz in der Navigationsleiste zu sparen.',
        },
    },
    remaining: 'Noch **{days}** Tag{{e}} bis Heiligabend.',
    short: '🧑‍🎄‍: **{days}**',
    christmas: '🎄 Heute ist Heiligabend. Frohe Weihnachten! 🎄',
} satisfies FeatureTranslation;

export const en = {
    settings: {
        enabled: {
            name: 'Countdown to Christmas Eve 🎄',
            description:
                'Displays a countdown to Christmas Eve in the navigation bar.\nThis is a small homage to the math pre-course.',
        },
        short: {
            name: 'Shortened display 🎄',
            description:
                'Displays the countdown with less text around it. This is useful for saving space in the navigation bar.',
        },
    },
    remaining: "It's **{days}** day{{s}} until Christmas Eve.",
    short: '🧑‍🎄‍: **{days}**',
    christmas: '🎄 Today is Christmas Eve. Merry Christmas! 🎄',
} satisfies typeof de;

export default { de, en };
