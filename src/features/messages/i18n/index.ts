import type { FeatureGroupTranslation } from '#types/i18n';
import markdownSupport from './markdownSupport';
import sendHotkey from './sendHotkey';

export const de = {
    name: 'Mitteilungen',
    features: {
        markdownSupport: markdownSupport.de,
        sendHotkey: sendHotkey.de,
    },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'Messages',
    features: {
        markdownSupport: markdownSupport.en,
        sendHotkey: sendHotkey.en,
    },
} as typeof de;

export default { de, en };
