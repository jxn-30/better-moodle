import { FeatureTranslation } from '../../../../types/i18n';

export const de = {
    settings: {
        enabled: {
            name: 'Dropdown in der Navigationsleiste',
            description:
                'Funktioniert den "Meine Kurse"-Link in eine Dropdown um, um einen schnellen Direktzugriff auf alle eigenen Kurse zu ermöglichen.',
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
    },
} satisfies typeof de;

export default { de, en };
