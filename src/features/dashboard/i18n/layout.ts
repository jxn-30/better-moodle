import { FeatureTranslation } from '#/i18n';

export const de = {
    settings: {
        leftSidebar: {
            name: 'Linke Seitenleiste',
            description:
                'Aktiviert eine linke Seitenleiste im Dashboard, in die Blöcke verschoben werden können.',
        },
        rightSidebar: {
            name: 'Rechte Seitenleiste',
            description:
                'Aktiviert eine rechte Seitenleiste im Dashboard, in die Blöcke verschoben werden können.',
        },
    },
} satisfies FeatureTranslation;

export const en = {
    settings: {
        leftSidebar: {
            name: 'Left sidebar',
            description:
                'Enables a left sidebar in dashboard, allowing to move blocks in there.',
        },
        rightSidebar: {
            name: 'Right sidebar',
            description:
                'Enables a left sidebar in dashboard, allowing to move blocks in there.',
        },
    },
} satisfies typeof de;

export default { de, en };
