import type { FeatureGroupTranslation } from '#types/i18n';

export const de = {
    name: 'Semesterzeiten',
    description:
        'Mal wieder den Überblick verloren, welchen Monat wir gerade haben? Mit diesen Features und Einstellungen bekommst du direkt im Moodle Informationen darüber, wo im Semester wir uns gerade befinden.',
    publicHoliday: 'Feiertag',
    table: {
        name: 'Zeitraum',
        start: 'Beginn',
        end: 'Ende',
        progress: 'Fortschritt',
        show: 'Im Balken anzeigen?',
    },
    settings: {
        block: {
            name: 'Block im Dashboard',
            description:
                'Fügt dem Dashboard einen Block hinzu, der die Semesterzeiten anzeigt.',
        },
    },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'Semester times',
    description:
        'Lost track of what month it is again? With these features and settings, you can find out where we are in the semester directly in Moodle.',
    publicHoliday: 'Public holiday',
    table: {
        name: 'Period',
        start: 'Start',
        end: 'End',
        progress: 'Progress',
        show: 'Show in Progress bar?',
    },
    settings: {
        block: {
            name: 'Block in the Dashboard',
            description:
                'Adds a block to the dashboard that shows the semester times.',
        },
    },
} as typeof de;

export default { de, en };
