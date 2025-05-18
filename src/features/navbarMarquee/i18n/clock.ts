import type { FeatureTranslation } from '#/i18n';

export const de = {
    settings: {
        enabled: { name: 'Uhr', description: 'Eine ganz normale Digitaluhr' },
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
    fuzzy: {
        minutes: {
            0: '{hour:number|spell|capitalize|removeTrailingS} Uhr',
            5: 'Fünf nach {hour:number|spell|capitalize}',
            10: 'Zehn nach {hour:number|spell|capitalize}',
            15: 'Viertel nach {hour:number|spell|capitalize}',
            20: 'Zwanzig nach {hour:number|spell|capitalize}',
            25: 'Fünf vor halb {hour:number|plus1|mod12Or12|spell|capitalize}',
            30: 'Halb {hour:number|plus1|mod12Or12|spell|capitalize}',
            35: 'Fünf nach halb {hour:number|plus1|mod12Or12|spell|capitalize}',
            40: 'Zwanzig vor {hour:number|plus1|mod12Or12|spell|capitalize}',
            45: 'Dreiviertel {hour:number|plus1|mod12Or12|spell|capitalize}',
            50: 'Zehn vor {hour:number|plus1|mod12Or12|spell|capitalize}',
            55: 'Fünf vor {hour:number|plus1|mod12Or12|spell|capitalize}',
            60: '{hour:number|plus1|mod12Or12|spell|capitalize|removeTrailingS} Uhr',
        },
        food: {
            0: 'Schlafenszeit',
            1: 'Frühstück',
            2: 'Zweites Frühstück',
            3: 'Kaffeepause',
            4: 'Mittagspause',
            5: 'Nachmittagstee',
            6: 'Abendessen',
            7: 'Mitternachtssnack',
        },
        day: {
            0: 'Nacht',
            1: 'Früher Morgen',
            2: 'Morgen',
            3: 'Vormittag',
            4: 'Mittag',
            5: 'Nachmittag',
            6: 'Abend',
            7: 'Später Abend',
        },
        week: {
            0: 'Wochenanfang',
            1: 'Mitte der Woche',
            2: 'Ende der Woche',
            3: 'Wochenende!',
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
    fuzzy: {
        minutes: {
            0: '{hour:number|spell|capitalize|removeTrailingS} o’clock',
            5: 'Five past {hour:number|spell|capitalize}',
            10: 'Ten past {hour:number|spell|capitalize}',
            15: 'Quarter past {hour:number|spell|capitalize}',
            20: 'Twenty past {hour:number|spell|capitalize}',
            25: 'Twenty-five past {hour:number|spell|capitalize}',
            30: 'Half past {hour:number|spell|capitalize}',
            35: 'Twenty-five to {hour:number|plus1|mod12Or12|spell|capitalize}',
            40: 'Twenty to {hour:number|plus1|mod12Or12|spell|capitalize}',
            45: 'Quarter to {hour:number|plus1|mod12Or12|spell|capitalize}',
            50: 'Ten to {hour:number|plus1|mod12Or12|spell|capitalize}',
            55: 'Five to {hour:number|plus1|mod12Or12|spell|capitalize}',
            60: '{hour:number|plus1|mod12Or12|spell|capitalize|removeTrailingS} o’clock',
        },
        food: {
            0: 'Sleep',
            1: 'Breakfast',
            2: 'Second Breakfast',
            3: 'Elevenses',
            4: 'Lunch',
            5: 'Afternoon tea',
            6: 'Dinner',
            7: 'Supper',
        },
        day: {
            0: 'Night',
            1: 'Early morning',
            2: 'Morning',
            3: 'Almost noon',
            4: 'Noon',
            5: 'Afternoon',
            6: 'Evening',
            7: 'Late Evening',
        },
        week: {
            0: 'Start of week',
            1: 'Middle of week',
            2: 'End of week',
            3: 'Weekend!',
        },
    },
} as typeof de;

export default { de, en };
