import { FeatureTranslation } from '#types/i18n';

export const de = {
    settings: {
        enabled: {
            name: 'Dropdown in der Navigationsleiste',
            description:
                'Funktioniert den "Meine Kurse"-Link in eine Dropdown um, um einen schnellen Direktzugriff auf alle eigenen Kurse zu ermöglichen.',
        },
        courseindex: {
            name: 'Schnellzugriff für Abschnitte',
            description:
                'Ermöglicht es, über die Kurs-Dropdown auch direkt auf die Abschnitte des Kurses zuzugreifen (funktioniert derzeit nicht in der mobilen Ansicht)',
        },
        courseindexActivities: {
            name: 'Schnellzugriff für Aktivitäten',
            description:
                'Ermöglicht es, über die Kurs-Dropdown auch direkt auf die Aktivitäten des Kurses zuzugreifen (funktioniert derzeit nicht in der mobilen Ansicht)',
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
    courseindex: {
        error: 'Der Kursindex konnte nicht geladen werden. Leider können wir es nicht nochmal versuchen, wenn du die Seite nicht neu lädst. :(',
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        enabled: {
            name: 'Dropdown in the navigation bar',
            description:
                'Converts the "My courses" link into a dropdown to allow quick direct access to all your courses.',
        },
        courseindex: {
            name: 'Fast-Access for sections',
            description:
                'Allows accessing the course sections from within the dropdown (does not work on mobile view yet)',
        },
        courseindexActivities: {
            name: 'Fast-Access for activities',
            description:
                'Allows accessing the course activities from within the dropdown (does not work on mobile view yet)',
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
    courseindex: {
        error: 'Courseindex could not be loaded. Unfortunately retrying without a page reload is not yet possible. :(',
    },
} satisfies typeof de;

export default { de, en };
