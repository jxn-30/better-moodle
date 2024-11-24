import { FeatureTranslation } from '#/i18n';

export const de = {
    settings: {
        coursesSidebar: {
            name: 'Linke Seitenleiste: Kursliste',
            description:
                'Aktiviert eine linke Seitenleiste im Dashboard, in der eine filterbare Liste der eigenen Kurse angezeigt wird.',
        },
        favouriteCoursesAtTop: {
            name: 'Favoriten oben in der Kursliste',
            description:
                'Favorisierte Kurse werden immer oben in der Kursliste angezeigt, anstelle an der normalen Stelle bei alphabetischer Sortierung.',
        },
        rightSidebar: {
            name: 'Rechte Seitenleiste',
            description:
                'Aktiviert eine rechte Seitenleiste im Dashboard, in die Blöcke verschoben werden können.',
        },
    },
    myCourses: {
        title: 'Meine Kurse',
        sync: 'Mit Auswahl auf "Meine Kurse"-Seite synchronisieren',
        empty: 'Keine Kurse im aktuellen Filter vorhanden.',
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        coursesSidebar: {
            name: 'Left sidebar',
            description:
                'Enables a left sidebar in dashboard, allowing to move blocks in there.',
        },
        favouriteCoursesAtTop: {
            name: 'Show favourite courses at top',
            description:
                'Favourite courses are always displayed at the top of the course list instead of in the normal position when sorted alphabetically.',
        },
        rightSidebar: {
            name: 'Right sidebar',
            description:
                'Enables a left sidebar in dashboard, allowing to move blocks in there.',
        },
    },
    myCourses: {
        title: 'My Courses',
        sync: 'Sync with current filter on "My courses"-Page',
        empty: 'There are no courses matching the currently selected filter.',
    },
} satisfies typeof de;

export default { de, en };
