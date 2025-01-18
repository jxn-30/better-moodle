import { FeatureTranslation } from '#/i18n';

export const de = {
    settings: {
        enabled: {
            name: 'Uhr',
            description: 'Eine ganz normale Digitaluhr',
        },
        seconds: {
            name: 'Sekunden anzeigen',
            description:
                'Sollen die Sekunden in der Digitaluhr angezeigt werden?',
        },
        fuzzy: {
            name: 'Umgangssprachliche Uhr',
            description:
                'Eine umgangssprachliche Uhr, wie sie auch von KDE Plasma bekannt ist.',
            labels: {
                'off': 'Aus',
                '5min': '5 Minuten',
                '15min': '15 Minuten',
                'food': 'Essen',
                'day': 'Tageszeit',
                'week': 'Wochenabschnitt',
            },
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        enabled: {
            name: 'Clock',
            description: 'A completely normal digital clock',
        },
        seconds: {
            name: 'Show seconds',
            description:
                'Should the seconds be displayed in the digital clock?',
        },
        fuzzy: {
            name: 'Fuzzy Clock',
            description: 'A fuzzy clock, known from KDE Plasma.',
            labels: {
                'off': 'Off',
                '5min': '5 Minutes',
                '15min': '15 Minutes',
                'food': 'Food',
                'day': 'Daytime',
                'week': 'Weektime',
            },
        },
    },
} satisfies typeof de;

export default { de, en };
