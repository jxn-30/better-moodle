import { FeatureTranslation } from '#/i18n';

export const de = {
    settings: {
        enabled: {
            name: 'Tiles per row ("My Courses" page)',
            description:
                'Number of tiles per row on the "My Courses" page when the view is set to "Tiles". (Is active up to a window/screen width of 840px)',
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        enabled: {
            name: 'Fully collapse/expand sidebar',
            description:
                'Adds controls to collapse/expand all sections in the sidebar at once.',
        },
    },
} satisfies typeof de;

export default { de, en };
