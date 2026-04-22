import type { FeatureGroupTranslation } from '#types/i18n';

export const de = {
    name: 'Darkmode',
    description:
        'Der in Better-Moodle integrierte Darkmode wird durch [Dark Reader](https://darkreader.org/) generiert. 😊',
    settings: {
        mode: {
            name: 'Modus',
            description: 'Wähle den Modus des Darkmodes (an, aus, automatisch)',
            options: {
                on: 'An',
                off: 'Aus',
                auto: 'Automatisch (Systemeinstellung befolgen)',
            },
        },
        brightness: {
            name: 'Helligkeit',
            description: 'Stelle die Helligkeit des Darkmodes ein.',
        },
        contrast: {
            name: 'Kontrast',
            description: 'Stelle den Kontrast des Darkmodes ein.',
        },
        grayscale: {
            name: 'Graustufen',
            description:
                'Stelle ein, wie wenige Farben du im Moodle haben möchtest.',
        },
        sepia: {
            name: 'Sepia',
            description: 'Stelle einen Sepia-Wert für den Darkmodes ein.',
        },
    },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'Darkmode',
    description:
        'Darkmode in Better-Moodle is brought to you through [Dark Reader](https://darkreader.org/). 😊',
    settings: {
        mode: {
            name: 'Mode',
            description: 'Select a mode for Darkmode (on, off, auto)',
            options: {
                on: 'On',
                off: 'Off',
                auto: 'Auto (follow system setting)',
            },
        },
        brightness: {
            name: 'Brightness',
            description: 'Set the brightness of the dark mode.',
        },
        contrast: {
            name: 'Contrast',
            description: 'Set the contrast of the dark mode.',
        },
        grayscale: {
            name: 'Greyscale',
            description: 'Set how few colours you want to have in Moodle.',
        },
        sepia: {
            name: 'Sepia',
            description: 'Set the sepia value of the dark mode.',
        },
    },
} satisfies typeof de;

export default { de, en };
