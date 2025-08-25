import { FeatureTranslation } from '#/i18n';

export const de = {
    settings: {
        maxWidth: {
            name: 'Bildüberlauf verhindern',
            description:
                'Verhindert, dass Bilder in den Kursen mehr als die komplette Breite einnehmen und damit ein horizontales Scrollen der Seite verursachen.',
        },
        zoom: {
            name: 'Bilder zoomen',
            description:
                'Zoomt ein Bild heran, wenn es angeklickt wird. So lassen sich kleine Bilder einfach per Knopfdruck vergrößert anzeigen.',
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        maxWidth: {
            name: 'Prevent image overflow',
            description:
                'Prevents images in courses from taking up more than the full width, causing the page to scroll horizontally.',
        },
        zoom: {
            name: 'Zoom images',
            description:
                'Zooms in on an image when it is clicked. This allows small images to be enlarged at the touch of a button.',
        },
    },
} as typeof de;

export default { de, en };
