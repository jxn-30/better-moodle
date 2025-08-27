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
        policeWarnings: {
            name: 'Benachrichtigungen für Polizeiwarnungen',
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
    modal: {
        activeWarnings: 'Aktive Warnungen',
        bbkLink: 'Meldung auf der Seite des BBK',
        categories: 'Kategorien',
        close: 'Schließen',
        description: 'Beschreibung',
        instruction: 'Handlungsempfehlung',
        noActiveWarnings: 'Keine aktiven Warnungen',
        notFound: {
            title: 'MELDUNG NICHT MEHR VORHANDEN',
            description:
                'Die von Ihnen abgerufene Warnmeldung ist nicht mehr vorhanden. Es liegt ggf. eine Entwarnung für diese Meldung vor.',
        },
        providedBy: 'Herausgegeben von',
        reload: 'Aktualisieren',
        showMore: 'Mehr anzeigen',
        via: 'via',
    },
    category: {
        geo: 'Geophysikalisch (einschl. Erdrutsch)',
        met: 'Meteorologisch (einschl. Hochwasser)',
        safety: 'Allgemeine Notfälle und öffentliche Sicherheit',
        security:
            'Strafverfolgung, Militär, Heimatschutz und lokale/private Sicherheit',
        rescue: 'Rettung und Bergung',
        fire: 'Brandbekämpfung und Rettung',
        health: 'Medizinische und öffentliche Gesundheit',
        env: 'Verschmutzung und andere Umweltprobleme',
        transport: 'Öffentlicher und privater Transport',
        infra: 'Versorgungs-, Telekommunikations- und andere Nicht-Verkehrsinfrastruktur',
        cbrne: 'Chemisch, biologisch, radiologisch, nuklear und explosiv',
        other: 'Andere Ereignisse',
    },
    msgType: {
        ack: 'Bestätigung',
        alert: 'Warnung',
        cancel: 'Entwarnung',
        error: 'Fehler',
        update: 'Aktualisierung',
    },
    severity: {
        civilProtection: {
            unknown: 'Unbekannt',
            minor: 'Keine Gefahr',
            moderate: 'Gefahreninformation',
            severe: 'Gefahr',
            extreme: 'Extreme Gefahr',
        },
        flood: {
            unknown: 'Unbekannt',
            minor: 'Keine Gefahr',
            moderate: 'Hochwasser',
            severe: 'Großes Hochwasser',
            extreme: 'Sehr großes Hochwasser',
        },
        police: {
            unknown: 'Unbekannt',
            minor: 'Keine Gefahr',
            moderate: 'Gefahreninformation',
            severe: 'Gefahr',
            extreme: 'Extreme Gefahr',
        },
        weather: {
            unknown: 'Unbekannt',
            minor: 'Keine Gefahr',
            moderate: 'Markantes Wetter',
            severe: 'Unwetter',
            extreme: 'Extremes Unwetter',
        },
    },
    status: {
        name: 'Status',
        actual: 'Echte Warnung',
        exercise: 'Übung',
        system: 'System',
        test: 'Testwarnung',
        draft: 'Entwurf',
    },
    provider: {
        mow: 'MoWaS',
        kat: 'KATWARN',
        biw: 'BIWAPP',
        pol: 'Polizei',
        dwd: 'Deutscher Wetterdienst',
        lhp: 'Länderübergreifendes Hochwasserportal',
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

        policeWarnings: {
            name: 'Police warnings',
            description:
                'Here you can set the warning level from which you want to receive a notification.',
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
    modal: {
        activeWarnings: 'Active warnings',
        bbkLink:
            'More information on the website of the Federal Office for Civil Protection and Disaster Assistance',
        categories: 'Categories',
        close: 'Close',
        description: 'Description',
        instruction: 'Instruction',
        noActiveWarnings: 'No active warnings',
        notFound: {
            title: 'MESSAGE NO LONGER AVAILABLE',
            description:
                'The warning message you have called up no longer exists. There may be an all-clear for this message.',
        },
        providedBy: 'Provided by',
        reload: 'Reload',
        showMore: 'Show more',
        via: 'via',
    },
    category: {
        geo: 'Geophysical (inc. landslide)',
        met: 'Meteorological (inc. flood)',
        safety: 'General emergency and public safety',
        security:
            'Law enforcement, military, homeland and local/private security',
        rescue: 'Rescue and recovery',
        fire: 'Fire suppression and rescue',
        health: 'Medical and public health',
        env: 'Pollution and other environmental threats',
        transport: 'Public and private transportation',
        infra: 'Utility, telecommunication, other non-transport infrastructure',
        cbrne: 'Chemical, Biological, Radiological, Nuclear or High-Yield Explosive threat or attack',
        other: 'Other events',
    },
    msgType: {
        ack: 'Acknowledgement',
        alert: 'Alert',
        cancel: 'Cancel',
        error: 'Error',
        update: 'Update',
    },
    severity: {
        civilProtection: {
            unknown: 'Unknown',
            minor: 'Minor',
            moderate: 'Moderate',
            severe: 'Severe',
            extreme: 'Extreme',
        },
        flood: {
            unknown: 'Unknown',
            minor: 'Minor flooding',
            moderate: 'Moderate flooding',
            severe: 'Severe flooding',
            extreme: 'Extreme flooding',
        },
        police: {
            unknown: 'Unknown',
            minor: 'Minor',
            moderate: 'Moderate',
            severe: 'Severe',
            extreme: 'Extreme',
        },
        weather: {
            unknown: 'Unknown',
            minor: 'Minor',
            moderate: 'Significant weather',
            severe: 'Storm',
            extreme: 'Extreme storm',
        },
    },
    status: {
        name: 'Status',
        actual: 'Actual',
        exercise: 'Exercise',
        system: 'System',
        test: 'Test',
        draft: 'Draft',
    },
    provider: {
        mow: 'MoWaS',
        kat: 'KATWARN',
        biw: 'BIWAPP',
        pol: 'Police',
        dwd: 'German Weather Service (DWD)',
        lhp: 'Cross-state flood portal (LHP)',
    },
} as typeof de;

export default { de, en };
