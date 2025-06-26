import { FeatureTranslation } from '#/i18n';

export const de = {
    settings: {
        enabled: {
            name: 'Dropdown in der Navigationsleiste',
            description:
                'Funktioniert den "Meine Kurse"-Link in eine Dropdown um, um einen schnellen Direktzugriff auf alle eigenen Kurse zu ermöglichen.',
        },
        filter: {
            name: 'Filter der Kurs-Dropdown',
            description:
                'Welche Kurse sollen in der Dropdown angezeigt werden? Es stehen die Filter der "Meine Kurse"-Seite zur Verfügung.',
            options: {
                _sync: '[Mit Auswahl auf "Meine Kurse"-Seite synchronisieren]',
            },
        },
        favouriteCoursesAtTop: {
            name: 'Favoriten oben in der Kurs-Dropdown',
            description:
                'Favorisierte Kurse werden immer oben in der Kurs-Dropdown angezeigt, anstelle an der normalen Stelle bei alphabetischer Sortierung.',
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        enabled: {
            name: 'Dropdown in the navigation bar',
            description:
                'Converts the "My courses" link into a dropdown to allow quick direct access to all your courses.',
        },
        filter: {
            name: 'Filter the course dropdown',
            description:
                'Which courses should be displayed in the dropdown? The filters on the "My courses" page are available.',
            options: { _sync: '[sync with filter on "my courses" page]' },
        },
        favouriteCoursesAtTop: {
            name: 'Show favourite courses at top',
            description:
                'Favourite courses are always displayed at the top of the course dropdown instead of in the normal position when sorted alphabetically.',
        },
    },
} as typeof de;

export default { de, en };
