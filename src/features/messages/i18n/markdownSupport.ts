import type { FeatureTranslation } from '#/i18n';

export const de = {
    settings: {
        markdownSupport: {
            name: 'Markdown in Mitteilungen',
            description: 'Erlaubt die Verwendung von Markdown in Mitteilungen.',
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        markdownSupport: {
            name: 'Markdown in messages',
            description: 'Allows the use of Markdown in messages.',
        },
    },
} as typeof de;

export default { de, en };
