import { FeatureTranslation } from '../../../../types/i18n';

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
            options: {
                _sync: '[sync with filter on "my courses" page]',
            },
        },
    },
} satisfies typeof de;

export default { de, en };
