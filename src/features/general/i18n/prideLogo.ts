import { FeatureTranslation } from '#types/i18n';

export const de = {
    settings: {
        flag: {
            name: 'Pride-Logo 🏳️‍🌈',
            description:
                'Lässt das Logo im Moodle in einem neuen Farbglanz erscheinen.',
            options: {
                off: 'Aus',
                Rainbow: 'Regenbogen',
                Agender: 'Agender',
                Aro: 'Aromantisch',
                Ace: 'Asexuell',
                Aroace: 'Asexuell-Aromantisch',
                Bi: 'Bisexuell',
                Genderfluid: 'Genderfluid',
                Intersex: 'Intersex',
                Lesbian: 'Lesbisch',
                Enby: 'Nicht-binär',
                Pan: 'Pansexuell',
                Gay: 'Schwul',
                Trans: 'Transgender',
            },
        },
        rotation: {
            name: 'Rotation des Pride-Logos',
            description:
                'Wähle hier, in welche Richtung das Pride-Logo rotiert sein soll.',
            options: {
                '180Deg': '180°: Von Oben nach Unten',
                '135Deg': '135°: Von Nord-Nord-West nach Süd-Süd-Ost',
            },
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        flag: {
            name: 'Pride-Logo 🏳️‍🌈',
            description:
                'Makes the logo in Moodle appear in a new colour gloss.',
            options: {
                off: 'Off :(',
                Rainbow: 'Rainbow',
                Agender: 'Agender',
                Aro: 'Aromantic',
                Ace: 'Asexual',
                Aroace: 'Asexual-Aromantic',
                Bi: 'Bisexual',
                Genderfluid: 'Genderfluid',
                Intersex: 'Intersex',
                Lesbian: 'Lesbian (WLW/NBLW)',
                Enby: 'Non-binary',
                Pan: 'Pansexual',
                Gay: 'Gay (MLM/NBLM)',
                Trans: 'Transgender',
            },
        },
        rotation: {
            name: 'Rotation of the Pride-Logo',
            description:
                'Select here in which direction the Pride logo should be rotated',
            options: {
                '180Deg': '180°: From top to bottom',
                '135Deg': '135°: From North-North-West to South-South-East',
            },
        },
    },
} satisfies typeof de;

export default { de, en };
