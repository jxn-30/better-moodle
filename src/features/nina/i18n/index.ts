import type { FeatureGroupTranslation } from '#/i18n';

export const de = {
    name: 'Amtliche Warnmeldungen (NINA)',
    description:
        'Erhalte deine amtlichen Warnmeldungen aus den Bereichen Bevölkerungsschutz, Wetter und Hochwasser nicht nur auf [warnungen.bund.de](https://warnung.bund.de/meldungen) sondern auch im Moodle.',
    settings: {
        civilWarnings: {
            name: 'Benachrichtigungen für Bevölerungsschutz-Warnungen',
            description:
                'Hier kann eingestellt werden, ab welcher Warnstufe eine Benachrichtigung angezeigt werden soll.',
            labels: {
                off: 'Nie',
                extreme: 'Extreme Gefahr',
                severe: 'Gefahr',
                moderate: 'Gefahreninformation',
            },
        },
        weatherWarnings: {
            name: 'Benachrichtigungen für Wetterwarnungen',
            description:
                'Hier kann eingestellt werden, ab welcher Warnstufe des Deutschen Wetterdienstes eine Benachrichtigung angezeigt werden soll.',
            labels: {
                off: 'Nie',
                extreme: 'Extremes Unwetter',
                severe: 'Unwetter',
                moderate: 'Markantes Wetter',
            },
        },
        floodWarnings: {
            name: 'Hochwasserwarnungen',
            description:
                'Benachrichtigungen zu Hochwasserereignissen an Binnengewässern (Flüsse, Kanäle, Binnenseen).',
            labels: { off: 'Nie', all: 'Immer' },
        },
        inAppNotifications: {
            name: 'Benachrichtigung im Moodle',
            description:
                'Erhalte eine kleines Popup im Moodle, über das du weitere Details zur Warnung aufrufen kannst.',
        },
        desktopNotifications: {
            name: 'Benachrichtigung auf dem Gerät',
            description:
                'Erhalte eine Benachrichtigung auf deinem Gerät, über die du weitere Details zur Warnung aufrufen kannst.',
        },
        notifyUpdates: {
            name: 'Über Aktualisierungen benachrichtigen',
            description:
                'Sendet eine Benachrichtigung, wenn die Behörde eine Aktualisierung der Warnung veröffentlicht. Das kann manchmal leider ganz schön häufig sein.',
        },
        notifyClearSignal: {
            name: 'Über Entwarnungen benachrichtigen',
            description:
                'Sendet eine Benachrichtigung, wenn die Behörde eine Entwarnung veröffentlicht.',
        },
    },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'Authoritative warning messages (NINA)',
    description:
        'Receive your authoritative warning messages from the areas of civil protection, weather and flooding not only on [warnungen.bund.de](https://warnung.bund.de/meldungen) but also in Moodle.',
    settings: {
        civilWarnings: {
            name: 'Civil protection warnings',
            description:
                'Here you can set the warning lebel from which you want to receive a notification.',
            labels: {
                off: 'Never',
                extreme: 'Extreme danger',
                severe: 'Danger',
                moderate: 'Hazard information',
            },
        },
        weatherWarnings: {
            name: 'Weather warnings',
            description:
                'Here you can set the Deutscher Wetterdienst warning level from which you want to receive a notification.',
            labels: {
                off: 'Never',
                extreme: 'Extreme storm',
                severe: 'Storm',
                moderate: 'Severe weather',
            },
        },
        floodWarnings: {
            name: 'Flood warnings',
            description:
                'Notifications about flooding events on inland waters (rivers, canals, inland lakes).',
            labels: { off: 'Never', all: 'Always' },
        },
        inAppNotifications: {
            name: 'Notification within Moodle',
            description:
                'Receive a small pop-up within Moodle, which you can use to call up further details about the warning.',
        },
        desktopNotifications: {
            name: 'Notification on the device',
            description:
                'Receive a notification on your device, which you can use to call up further details about the warning',
        },
        notifyUpdates: {
            name: 'Notify about updates',
            description:
                'Sends a notification whenever the authorities are updating the warning (which unfortunately sometimes may happen often).',
        },
        notifyClearSignal: {
            name: 'Notify about All-Clear signals',
            description:
                'Sends a notification whenever the authorities are giving an All-Clear signal about a warning.',
        },
    },
} as typeof de;

export default { de, en };
