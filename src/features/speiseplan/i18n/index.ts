import type { FeatureGroupTranslation } from '#/i18n';

export const de = {
    name: 'Speiseplan der Mensa',
    description: 'Der Speiseplan deiner Lieblingsmensa direkt in Moodle.',
    close: 'Schließen',
    table: {
        dish: 'Gericht',
        co2score: 'CO₂\xa0Score',
        types: 'Art(en)',
        price: 'Preis',
    },
    source: 'Original Speiseplan',
    settings: {
        enabled: {
            name: 'Speiseplan in der Navigationsleiste',
            description:
                'Erlaubt es dir, den Speiseplan deiner Lieblingsmensa direkt von der Moodle-Navigationsleiste aus zu öffnen.',
        },
        language: {
            name: 'Sprache des Speiseplans',
            description:
                'Hier kannst du bei Bedarf eine Sprache des Speiseplans erzwingen.',
            options: { auto: '🌐 Auto (Better-Moodle Sprache)' },
        },
        canteen: {
            name: 'Mensa / Cafeteria',
            description:
                'Von welcher Mensa / Cafeteria möchtest du den Speiseplan sehen?',
        },
    },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'Menu of the canteen',
    description: 'The menu of your favourite canteen within Moodle.',
    close: 'Close',
    table: {
        dish: 'Dish',
        co2score: 'CO₂\xa0Score',
        types: 'Type(s)',
        price: 'Price',
    },
    source: 'Original menu',
    settings: {
        enabled: {
            name: 'Menu in the navigation bar',
            description:
                'Allows you to open the menu of your favorite canteen directly from the moodle navigation bar.',
        },
        language: {
            name: 'Language of the menu',
            description: 'Here you can force a menu language if required',
            options: { auto: '🌐 Auto (Better-Moodle language)' },
        },
        canteen: {
            name: 'Mensa / Cafeteria',
            description:
                'Which canteen / cafeteria would you like to see the menu from?',
        },
    },
} as typeof de;

export default { de, en };
