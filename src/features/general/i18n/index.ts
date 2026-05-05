import cauNavbar from './cauNavbar';
import externalLinks from './externalLinks';
import type { FeatureGroupTranslation } from '#types/i18n';
import fullWidth from './fullWidth';
import googlyEyes from './googlyEyes';
import leftSecondaryNav from './leftSecondaryNav';
import prideLogo from './prideLogo';
import truncatedTexts from './truncatedTexts';

export const de = {
    name: 'Allgemeine Einstellungen',
    description:
        'Diese allgemeinen Einstellungen steuern das Verhalten von Better-Moodle und einige grundlegende Features.',
    settings: {
        'updateNotification': {
            name: 'Benachrichtigung bei Better-Moodle Updates',
            description:
                'Zeigt einen kleinen roten Punkt bei den Zahnrädern in der Navigationsleiste an, wenn es ein Update für Better-Moodle gibt.',
        },
        'releaseChannel': {
            name: 'Release-Kanal',
            description:
                'Wähle hier, ob du die normalen, stabilen, Updates erhalten möchtest oder lieber Features und Bugfixes schneller, dafür potentiell instabiler, haben möchtest.',
            options: {
                stable: 'Stabile Updates',
                nightly: 'Nightly Updates (potentiell instabil)',
            },
        },
        'language': {
            name: 'Better-Moodle Sprache',
            description: 'Wähle die Sprache von Better-Moodle aus.',
            options: { auto: '🌐 Auto (Moodle Sprache)' },
        },
        'hideDisabledSettings': {
            name: 'Deaktivierte Einstellungen ausblenden',
            description:
                'Blendet Einstellungen aus, die gerade deaktiviert sind (z.\xa0B. weil sie von einer anderen Einstellung abhängig sind).',
        },
        'hideFunSettings': {
            name: 'Spaß-Einstellungen ausblenden',
            description:
                'Blendet Einstellungen aus, die nur für mehr Spaß im Moodle da sind.',
        },
        'newSettings.highlight': {
            name: 'Neue Einstellungen markieren',
            description:
                'Hebt neue Einstellungen mit einem kleinen Badge hervor, wenn sie noch nicht angeschaut wurden.',
        },
        'newSettings.tooltip': {
            name: 'Hinweis zu neuen Einstellungen in der Navigationsleiste',
            description:
                'Zeigt ein schickes Tooltip beim Einstellungen-Knopf in der Navigationsleiste an, wenn es ungesehene Einstellungen gibt.',
        },
    },
    features: {
        fullWidth: fullWidth.de,
        externalLinks: externalLinks.de,
        truncatedTexts: truncatedTexts.de,
        googlyEyes: googlyEyes.de,
        leftSecondaryNav: leftSecondaryNav.de,
        prideLogo: prideLogo.de,
        cauNavbar: cauNavbar.de,
    },
} satisfies FeatureGroupTranslation;

export const en = {
    name: 'General Settings',
    description:
        'These general settings control the behaviour of Better-Moodle and some more general Features.',
    settings: {
        'updateNotification': {
            name: 'Notification for Better-Moodle updates',
            description:
                'Displays a small red dot by the cogs in the navigation bar when there is an update for Better-Moodle.',
        },
        'releaseChannel': {
            name: 'Release-Channel',
            description:
                "Choose here whether you want to receive the standard, stable updates, or whether you'd prefer to get new features and bug fixes more quickly, even if this means they might be less stable.",
            options: {
                stable: 'Stable updates',
                nightly: 'Nightly updates (potentially unstable)',
            },
        },
        'language': {
            name: 'Better-Moodle Language',
            description: 'Choose the language of Better-Moodle.',
            options: { auto: '🌐 Auto (Moodle language)' },
        },
        'hideDisabledSettings': {
            name: 'Hide disabled settings',
            description:
                'Hides settings that are currently disabled (e.g. because they depend on another setting).',
        },
        'hideFunSettings': {
            name: 'Hide fun settings',
            description: 'Hides settings that are just for more fun in Moodle.',
        },
        'newSettings.highlight': {
            name: 'Highlight new settings',
            description:
                'Highlights new settings with a small badge if they have not yet been viewed.',
        },
        'newSettings.tooltip': {
            name: 'Note on new settings in the navigation bar',
            description:
                'Shows a fancy tooltip next to the settings button in the navigation bar if there are unseen settings.',
        },
    },
    features: {
        fullWidth: fullWidth.en,
        externalLinks: externalLinks.en,
        truncatedTexts: truncatedTexts.en,
        googlyEyes: googlyEyes.en,
        leftSecondaryNav: leftSecondaryNav.en,
        prideLogo: prideLogo.en,
        cauNavbar: cauNavbar.en,
    },
} satisfies typeof de;

export default { de, en };
