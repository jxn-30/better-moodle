import { FeatureTranslation } from '#types/i18n';

export const de = {
    settings: {
        enabled: {
            name: 'Event-Ankündigungen',
            description:
                'Zeigt ab und zu (selten) Ankündigungen zu coolen Events deiner studentischen Gremien in der Navigationsleiste an.',
        },
        noticeTime: {
            name: 'Event-Ankündigungen anzeigen ab Tage vorher',
            description:
                'Stelle hier ein, wie viele Tage vor einer Veranstaltung diese in der Navigationsleiste zu sehen sein soll.',
        },
    },
    start: 'Beginn',
    end: 'Ende',
    location: 'Ort',
    rrule: 'Regelmäßigkeit',
} satisfies FeatureTranslation;

export const en = {
    settings: {
        enabled: {
            name: 'Event announcements',
            description:
                'Occasionally (rarely) displays announcements about cool events from your student committees ("Studentische Gremien") in the navigation bar.',
        },
        noticeTime: {
            name: 'Show event announcements from days before',
            description:
                'Set here how many days before an event it should be displayed in the navigation bar',
        },
    },
    start: 'Start',
    end: 'End',
    location: 'Location',
    rrule: 'Regularity',
} as typeof de;

export default { de, en };
