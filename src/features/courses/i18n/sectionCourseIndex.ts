import { FeatureTranslation } from '#types/i18n';

export const de = {
    settings: {
        enabled: {
            name: 'Abschnitte auf der Kurs-Hauptseite öffnen',
            description:
                'Manipuliert die Links zu den Abschnitten in der linken Seitenleiste, sodass innerhalb der Kurs-Hauptseite gescrollt wird, statt die Abschnitts-Seite zu öffnen.',
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        enabled: {
            name: 'Open sections on main course page',
            description:
                'Manipulates the links to the sections in the left sidebar so that it scrolls within the main course page instead of opening the section page.',
        },
    },
} as typeof de;

export default { de, en };
