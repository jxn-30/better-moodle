import type { FeatureGroupTranslation } from '#types/i18n';

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
    filters: {
        title: 'Filter',
        description:
            'Wähle hier aus, welche Speisearten du sehen möchtest. Es werden alle Speisen angezeigt, die mindestens einer der ausgewählten Speisearten entspricht. Hast du keine Arten ausgewählt, wirst du alle Speisen sehen.',
        placeholder: 'Speiseart hinzufügen',
    },
    source: 'Original Speiseplan',
    errorWhileFetching: `
Hoppala, leider hat da was beim Auslesen des Speiseplans nicht geklappt :(. Manchmal hilft es, ihn einfach nochmals neu zu öffnen.

<details>
<summary><em>Fehlermeldung für wens interessiert</em></summary>
<pre>{error}</pre>
</details>`.trim(),
    isEmpty:
        'Hmm, der Speiseplan ist leer. Ist diese Mensa vielleicht gerade geschlossen?',
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
    filters: {
        title: 'Filter',
        description:
            'Choose here, which types of dishes you want to see. Any dishes that match at least one selected filter will be shown. If no types are selected, all dishes will be shown.',
        placeholder: 'Add dish type',
    },
    source: 'Original menu',
    errorWhileFetching: `
Whoopsie, unfortunately something didn't work when reading out the menu :(. Sometimes it helps to simply open it again.

<details>
<summary><em>The error, for whoever might be interested</em></summary>
<pre>{error}</pre>
</details>`.trim(),
    isEmpty: 'Hmm, the menu is empty. Is this canteen currently closed?',
    settings: {
        enabled: {
            name: 'Menu in the navigation bar',
            description:
                'Allows you to open the menu of your favourite canteen directly from the moodle navigation bar.',
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
