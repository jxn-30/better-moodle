// ==UserScript==
// @name            🎓️ UzL: better-moodle
// @namespace       https://uni-luebeck.de
// @                x-release-please-start-version
// @version         1.32.0
// @                x-release-please-end
// @author          Jan (jxn_30)
// @description:de  Verbessert dieses seltsame Design, das Moodle 4 mit sich bringt
// @homepage        https://github.com/jxn-30/better-moodle
// @homepageURL     https://github.com/jxn-30/better-moodle
// @icon            https://www.uni-luebeck.de/favicon.ico
// @updateURL       https://github.com/jxn-30/better-moodle/releases/latest/download/better-moodle.meta.js
// @downloadURL     https://github.com/jxn-30/better-moodle/releases/latest/download/better-moodle.user.js
// @match           https://moodle.uni-luebeck.de/*
// @run-at          document-body
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_listValues
// @grant           GM_addValueChangeListener
// @grant           GM_info
// @grant           GM_xmlhttpRequest
// @connect         studentenwerk.sh
// @connect         api.open-meteo.com
// @connect         api.openweathermap.org
// @connect         api.pirateweather.net
// @connect         weather.visualcrossing.com
// @connect         wttr.in
// @require         https://unpkg.com/darkreader@4.9.85/darkreader.js#sha512=6792b51c55273b96edc7d87f1180832cc321561d7f885004da58e660f53a7684f69e63d0aef1e2c5cc3313949ef1e16963ad420cec8595de391152156dc75b69
// ==/UserScript==

/* global M, require, DarkReader */

// region translations
const TRANSLATIONS = {
    de: {
        sidebar: {
            open: 'Blockleiste öffnen',
            close: 'Blockleiste schließen',
        },
        courseGroupings: {
            sync: '[Mit Auswahl auf "Meine Kurse"-Seite synchronisieren]',
        },
        bookmarks: {
            title: 'Lesezeichen',
            add: 'Lesezeichen setzen',
            manage: 'Lesezeichen verwalten',
            name: 'Bezeichnung',
            url: 'URL',
            empty: 'Bislang sind keine Lesezeichen vorhanden!',
        },
        christmasCountdown: {
            countdown: [
                'Noch <b>{{days}}</b> Tag bis Heiligabend.',
                'Noch <b>{{days}}</b> Tage bis Heiligabend.',
            ],
            christmas: '🎄 Heute ist Heiligabend. Frohe Weihnachten! 🎄',
        },
        courses: {
            grades: 'Bewertungen',
        },
        myCourses: {
            lists: {
                empty: 'Keine Kurse im aktuellen Filter vorhanden.',
                myCoursesLink: 'Meine Kurse',
            },
        },
        speiseplan: {
            title: 'Speiseplan der Mensa',
            close: 'Schließen',
            toStudiwerkPage: 'Speiseplan auf der Seite des Studentenwerks',
            table: {
                speise: 'Gericht',
                type: 'Art(en)',
                price: 'Preis',
            },
        },
        semesterzeiten: {
            skip: 'Semesterzeiten überspringen',
            table: {
                name: 'Zeitraum',
                start: 'Beginn',
                end: 'Ende',
                finished: 'Fortschritt',
                show: 'Im Balken anzeigen?',
                holiday: 'Feiertag',
            },
        },
        weatherDisplay: {
            title: 'Wetter-Moodle',
            close: 'Schließen',
            updated: 'Zuletzt aktualisiert um',
            credits: {
                _long: 'Wetterdaten von',
                _short: 'Quelle',
                wttrIn: {
                    name: 'wttr.in',
                    url: 'https://wttr.in',
                },
                openMeteo: {
                    name: 'Open-Meteo',
                    url: 'https://open-meteo.com',
                },
                visualCrossing: {
                    name: 'Visual Crossing',
                    url: 'https://www.visualcrossing.com',
                },
                openWeatherMap: {
                    name: 'OpenWeatherMap',
                    url: 'https://openweathermap.org',
                },
                pirateWeather: {
                    name: 'Pirate Weather',
                    url: 'https://pirateweather.net',
                },
            },
            weatherCodes: {
                // Using the codes of openweathermap.org
                0: 'Wetter nicht verfügbar',
                200: 'Gewitter mit leichtem Regen',
                201: 'Gewitter mit Regen',
                202: 'Gewitter mit starkem Regen',
                210: 'Leichtes Gewitter',
                211: 'Gewitter',
                212: 'Starkes Gewitter',
                221: 'Gewitter',
                230: 'Gewitter mit leichtem Nieselregen',
                231: 'Gewitter mit Nieselregen',
                232: 'Gewitter mit starkem Nieselregen',
                300: 'Leichter Nieselregen',
                301: 'Nieselregen',
                302: 'Starker Nieselregen',
                310: 'Leichter Nieselregen',
                311: 'Nieselregen',
                312: 'Starker Nieselregen',
                313: 'Regenschauer und Nieselregen',
                314: 'Starker Regenschauer und Nieselregen',
                321: 'Nieselregen',
                500: 'Leichter Regen',
                501: 'Mäßiger Regen',
                502: 'Starker Regen',
                503: 'Sehr starker Regen',
                504: 'Extremer Regen',
                511: 'Gefrierender Regen',
                520: 'Leichte Regenschauer',
                521: 'Regenschauer',
                522: 'Starker Regenschauer',
                531: 'Regenschauer',
                600: 'Leichter Schneefall',
                601: 'Schneefall',
                602: 'Starker Schneefall',
                611: 'Schneeregen',
                612: 'Leichter Schneeregen',
                613: 'Schneeregen',
                615: 'Leichter Regen und Schnee',
                616: 'Regen und Schnee',
                620: 'Leichter Schneeschauer',
                621: 'Schneeschauer',
                622: 'Starker Schneeschauer',
                701: 'Nebel',
                711: 'Rauch',
                721: 'Dunst',
                731: 'Sand/Staubwirbel',
                741: 'Nebel',
                751: 'Sand',
                761: 'Staub',
                762: 'Vulkanasche',
                771: 'Sturmböen',
                781: 'Tornado',
                800: 'Klarer Himmel',
                801: 'Kaum Wolken',
                802: 'Wenige Wolken',
                803: 'Überwiegend bewölkt',
                804: 'Bedeckt',
            },
        },
        modals: {
            settings: {
                title: 'Einstellungen',
                moodleSettings: 'Zu den Moodle-Einstellungen',
                installedVersion: 'installierte Version',
                latestVersion: 'aktuellste Version',
                updateBtn: 'Update installieren',
                import: 'Einstellungen importieren',
                export: 'Einstellungen exportieren',
            },
            update: {
                title: 'Better-Moodle aktualisieren',
                content:
                    'Den Anweisungen zum Aktualisieren im Script-Manager (z.&nbsp;B. Tampermonkey) folgen und anschließend Moodle neu laden.',
            },
            changelog: 'Changelog',
            help: {
                title: 'Hilfe zu Better-Moodle',
                close: 'Danke für diese Hilfe! 😊',
                content: `
# Schön, dass du dieses Fensterchen gefunden hast! 🎉

---

## Wie funktioniert ...? Was wenn ...?

Lies dir gerne zunächst einmal die FAQ von Better-Moodle durch: [Better-Moodle FAQ]({{faqLink}}).

## Okay cool, aber da steht XY nicht mit dabei. Was nun?

Schreib doch gerne eine Mail an Jan: [{{mailAdress}}]({{mailLinkHelp}}).

Denke dabei bitte daran, über deine Uni-Mail-Adresse und nicht über deine Private Email zu schreiben.

## Ich habe einen Fehler gefunden!

Huch, in Better-Moodle gibt es doch keine Fehler? 😱

Spaß beiseite, auch in Better-Moodle kann es mal vorkommen, dass ein Fehler auftritt. Eröffne gerne ein neues Issue auf [GitHub]({{githubIssueBug}}) oder schreibe Jan eine Mail, wenn du kein GitHub nutzen möchtest: [{{mailAdress}}]({{mailLinkBug}}).

Bitte gebe dabei auch immer so viele Informationen wie möglich an, damit der Fehler optimal nachvollzogen und reproduziert werden kann.
Das hilft, ihn schneller und effizienter zu beheben.

## Ich habe eine tolle Idee für ein neues Feature!

Erstelle gerne ein Issue auf [GitHub]({{githubIssueFeature}}), reiche dort eine Contribution ein oder schreibe eine Mail an Jan: [{{mailAdress}}]({{mailLinkFeature}})`,
                mails: {
                    help: {
                        subject: 'Ich benötige bitte Hilfe',
                        content: `Hallo Jan,

ich habe eine Frage zu Better-Moodle, die ich aber leider nicht duch die FAQ beantwortet bekommen habe:

[...]

Vielen Dank und liebe Grüße
[Dein Name]`,
                    },
                    bug: {
                        subject: 'Bug-Report',
                        content: `Hallo Jan,
ich habe einen Bug in Better-Moodle gefunden!

Ich nutze diesen Browser:
Ich nutze diese Version von Better-Moodle: {{currentVersion}}
Diese Schritte habe ich durchgeführt, als das Problem aufgetreten ist:
Dieses Verhalten hätte ich stattdessen erwartet:

Viele Grüße
[Dein Name]`,
                    },
                    feature: {
                        subject: 'Feature-Idee',
                        content: `Hallo Jan,
ich habe einen tollen Vorschlag für Better-Moodle:

[hier eine ausführliche Beschreibung des Vorschlags]

Viele Grüße
[Dein Name]`,
                    },
                },
            },
        },
        clock: {
            fuzzyClock: {
                to: 'vor',
                past: 'nach',
                oClock: 'Uhr',
                half: 'halb',
                0: 'Zwölf',
                1: 'Eins',
                2: 'Zwei',
                3: 'Drei',
                4: 'Vier',
                5: 'Fünf',
                6: 'Sechs',
                7: 'Sieben',
                8: 'Acht',
                9: 'Neun',
                10: 'Zehn',
                11: 'Elf',
                12: 'Zwölf',
                15: 'Viertel',
                20: 'Zwanzig',
                25: 'Fünfundzwanzig',
                other: {
                    30: [
                        'Schlafenszeit',
                        'Frühstück',
                        'Zweites Frühstück',
                        'Kaffeepause',
                        'Mittagspause',
                        'Nachmittagstee',
                        'Abendessen',
                        'Mitternachtssnack',
                    ],
                    40: [
                        'Nacht',
                        'Früher Morgen',
                        'Morgen',
                        'Vormittag',
                        'Mittag',
                        'Nachmittag',
                        'Abend',
                        'Später Abend',
                    ],
                    50: [
                        'Wochenanfang',
                        'Mitte der Woche',
                        'Ende der Woche',
                        'Wochenende!',
                    ],
                },
            },
        },
        settings: {
            general: {
                _title: 'Allgemeine Einstellungen',
                updateNotification: {
                    name: 'Benachrichtigung bei Better-Moodle Updates',
                    description:
                        'Zeigt einen kleinen roten Punkt bei den Zahnrädern in der Navigationsleiste an, wenn es ein Update für Better-Moodle gibt.',
                },
                fullwidth: {
                    name: 'Volle Breite',
                    description:
                        'Entfernt den seltsamen weißen Rand und sorgt dafür, dass die Seiten die volle Breite nutzen.',
                },
                externalLinks: {
                    name: 'Externe Links',
                    description:
                        'Sorgt dafür, dass externe Links immer automatisch in einem neuen Tab geöffnet werden.',
                },
                truncatedTexts: {
                    name: 'Abgeschnittene Texte',
                    description:
                        'Fügt ein Title-Attribut bei potentiell abgeschnittenen Texten hinzu, damit man per Maus-Hover den vollen Text lesen kann.',
                },
                bookmarkManager: {
                    name: 'Lesezeichen-Manager',
                    description:
                        'Aktiviert einen kleinen internen Lesezeichen-Manager, um direkt im Moodle zu bestimmten Orten zu springen.',
                },
                noDownload: {
                    name: 'Download unterbinden',
                    description:
                        'Verhindert das automatische Herunterladen von Dateien (insbesondere PDFs) wo immer möglich.',
                },
                eventAdvertisements: {
                    name: 'Event-Ankündigungen',
                    description:
                        'Zeigt ab und zu (selten) Ankündigungen zu coolen Events deiner studentischen Gremien in der Navigationsleiste an.',
                },
                christmasCountdown: {
                    name: 'Countdown bis Heiligabend 🎄',
                    description:
                        'Zeigt einen Countdown bis Heiligabend in der Navigationsleiste an.\nHierbei handelt es sich um eine kleine Hommage an den Mathe-Vorkurs.',
                },
                speiseplan: {
                    name: 'Speiseplan direkt im Moodle öffnen',
                    description:
                        'Öffnet den Speiseplan der Mensa in einem Popup im Moodle.',
                },
                googlyEyes: {
                    name: 'xEyes für Better-Moodle',
                    description: '👀',
                },
                semesterzeiten: {
                    name: 'Semesterzeiten',
                    description:
                        'Zeigt im Dashboard ein neues Feld mit einem Fortschrittsbalken des aktuellen Semester an. Ebenfalls dabei: Informationen über wichtige Zeiträume im Semester.',
                },
                language: {
                    name: 'Better-Moodle Sprache',
                    description: 'Wähle die Sprache von Better-Moodle aus.',
                    options: {
                        auto: '🌐 Auto (Moodle Sprache)',
                        de: '🇩🇪 Deutsch',
                        en: '🇬🇧 Englisch',
                    },
                },
            },
            darkmode: {
                _title: 'Darkmode',
                _description:
                    'Der in Better-Moodle integrierte Darkmode wird durch [Dark Reader](https://darkreader.org/) generiert. 😊',
                mode: {
                    name: 'Modus',
                    description:
                        'Wähle den Modus des Darkmodes (an, aus, automatisch)',
                    options: {
                        on: 'An',
                        off: 'Aus',
                        auto: 'Automatisch (Systemeinstellung befolgen)',
                    },
                },
                brightness: {
                    name: 'Helligkeit',
                    description: 'Stelle die Helligkeit des Darkmodes ein.',
                },
                contrast: {
                    name: 'Kontrast',
                    description: 'Stelle den Kontrast des Darkmodes ein.',
                },
                grayscale: {
                    name: 'Graustufen',
                    description:
                        'Stelle ein, wie wenige Farben du im Moodle haben möchtest.',
                },
                sepia: {
                    name: 'Sepia',
                    description:
                        'Stelle einen Sepia-Wert für den Darkmodes ein.',
                },
            },
            dashboard: {
                '_title': 'Dashboard',
                '~layoutPlaceholder': {
                    name: 'Layout',
                    description:
                        'Hier sollst du mal das Layout anpassen können. Das ist aber leider noch nicht fertig. Bitte habe noch ein bisschen Geduld hiermit :)',
                },
                'courseListFilter': {
                    name: 'Filter der Kurse-Sidebar',
                    description:
                        'Welche Kurse sollen in der Sidebar angezeigt werden? Es stehen die Filter der "Meine Kurse"-Seite zur Verfügung.',
                },
                'courseListFavouritesAtTop': {
                    name: 'Favoriten oben in der Kursliste',
                    description:
                        'Favorisierte Kurse werden immer oben in der Kursliste angezeigt, anstelle an der normalen Stelle bei alphabetischer Sortierung.',
                },
            },
            myCourses: {
                _title: 'Meine Kurse',
                boxesPerRow: {
                    name: 'Kacheln pro Zeile',
                    description:
                        'Zahl der Kacheln pro Zeile auf der "Meine Kurse"-Seite, wenn die Ansicht auf "Kacheln" gestellt ist. (Ist bis zu einer Fenster-/Bildschirmbreite bis 840px aktiv)',
                },
                navbarDropdown: {
                    name: 'Dropdown in der Navigationsleiste',
                    description:
                        'Funktioniert den "Meine Kurse"-Link in eine Dropdown um, um einen schnellen Direktzugriff auf alle eigenen Kurse zu ermöglichen.',
                },
                navbarDropdownFilter: {
                    name: 'Filter der Kurs-Dropdown',
                    description:
                        'Welche Kurse sollen in der Dropdown angezeigt werden? Es stehen die Filter der "Meine Kurse"-Seite zur Verfügung.',
                },
                navbarDropdownFavouritesAtTop: {
                    name: 'Favoriten oben in der Kurs-Dropdown',
                    description:
                        'Favorisierte Kurse werden immer oben in der Kurs-Dropdown angezeigt, anstelle an der normalen Stelle bei alphabetischer Sortierung.',
                },
            },
            courses: {
                _title: 'Kurse',
                grades: {
                    name: 'Link zu Bewertungen in der Sidebar',
                    description:
                        'Zeigt einen Link zu den Bewertungen des Kurses in der linken Seitenleiste an.',
                },
                gradesNewTab: {
                    name: 'Bewertungen in neuem Tab öffnen',
                    description:
                        'Öffnet die Bewertungen standardmäßig einem neuen Tab.',
                },
                collapseAll: {
                    name: 'Seitenleiste vollständig ein-/ausklappen',
                    description:
                        'Klappt alle Abschnitte in der Seitenleiste ein oder aus, wenn doppelt auf einen der Pfeile in der Seitenleiste geklickt wird.',
                },
                imgMaxWidth: {
                    name: 'Bildüberlauf verhindern',
                    description:
                        'Verhindert, dass Bilder in den Kursen mehr als die komplette Breite einnehmen und damit ein horizontales Scrollen der Seite verursachen.',
                },
                imageZoom: {
                    name: 'Bilder zoomen',
                    description:
                        'Zoomt ein Bild heran, wenn es angeklickt wird. So lassen sich kleine Bilder einfach per Knopfdruck vergrößert anzeigen.',
                },
                hideSelfEnrolHint: {
                    name: 'Hinweis zur Selbsteinschreibung ohne Einschreibeschlüssel ausblenden',
                    description:
                        'Moodle zeigt einen Hinweis an, wenn bei einem Kurs die Selbsteinschreibung ohne Einschreibeschlüssel aktiviert ist. Manche empfinden diesen Hinweis als störend, deshalb kann er mit dieser Einstellung ausgeblendet werden.',
                },
            },
            clock: {
                _title: 'Uhr',
                fuzzyClock: {
                    name: 'Umgangssprachliche Uhr',
                    description:
                        'Eine umgangssprachliche Uhr, wie sie auch von KDE Plasma bekannt ist.',
                    fuzziness: {
                        name: 'Genauigkeit der Uhr',
                        description:
                            'Wie genau soll die umgangssprachliche Uhr die Uhrzeit anzeigen?',
                        labels: {
                            '5min': '5 Minuten',
                            '15min': '15 Minuten',
                            'food': 'Essen',
                            'day': 'Tageszeit',
                            'week': 'Wochenabschnitt',
                        },
                    },
                },
            },
            messages: {
                _title: 'Mitteilungen',
                sendHotkey: {
                    name: 'Mitteilungen per Tastenkombination absenden',
                    description:
                        'Ermöglicht das Absenden von Mitteilungen per Tastenkombination (z. B. Strg + Enter).',
                    options: {
                        '': '[Deaktiviert] Kein Absenden per Tastenkombination',
                        'shiftEnter': 'Umschalt + Enter',
                        'ctrlEnter': 'Strg + Enter',
                    },
                },
            },
            weatherDisplay: {
                _title: 'Wetter-Moodle',
                _description: `Um gute Wetterdaten zu erhalten, benötigst du bei einigen Anbietern einen API-Key. 
Better-Moodle funktioniert bei allen angebotenen Anbiertern mit den jeweiligen kostenlosen Optionen.`,
                show: {
                    name: 'Wetter anzeigen',
                    description: 'Zeige das Wetter in Moodle an.',
                },
                provider: {
                    name: 'Anbieter',
                    description: 'Wähle den Anbieter für die Wetterdaten aus.',
                    options: {
                        wttrIn: 'wttr.in',
                        openMeteo: 'Open-Meteo',
                        visualCrossing: 'Visual Crossing (API-Key benötigt)',
                        openWeatherMap: 'OpenWeatherMap (API-Key benötigt)',
                        pirateWeather: 'Pirate Weather (API-Key benötigt)',
                    },
                },
                openWeatherMapAPIKey: {
                    name: 'API-Key für OpenWeatherMap',
                    description:
                        'Trage hier deinen API-Key für OpenWeatherMap ein (der Free-Plan ist ausreichend).',
                },
                pirateWeatherAPIKey: {
                    name: 'API-Key für PirateWeather',
                    description:
                        'Trage hier deinen API-Key für PirateWeather ein (der Free-Plan ist ausreichend).',
                },
                visualCrossingAPIKey: {
                    name: 'API-Key für Visual Crossing',
                    description:
                        'Trage hier deinen API-Key für Visual Crossing ein (der Free-Plan ist ausreichend).',
                },
                units: {
                    name: 'Einheiten',
                    description: 'Wähle die Einheiten für die Wetterdaten aus.',
                    options: {
                        metric: 'Metrisch (°C, km/h, km, mm)',
                        scientific: 'SI Einheiten (K, m/s, m, m)',
                        imperial: 'Imperial (°F, mph, mi, in)', // for weird people
                    },
                },
                showTempInNavbar: {
                    name: 'Temperatur in der Navigationsleiste anzeigen',
                    description:
                        'Zeige die aktuelle Temperatur in der Navigationsleiste an.',
                },
                toggleFeelsLike: {
                    name: 'Gefühlte Temperatur anzeigen',
                    description:
                        'Ermöglicht das Umschalten zwischen der tatsächlichen Temperatur und der gefühlten Temperatur.',
                },
            },
        },
    },
    en: {
        sidebar: {
            open: 'Open sidebar',
            close: 'Close sidebar',
        },
        courseGroupings: {
            sync: '[sync with filter on "my courses" page]',
        },
        bookmarks: {
            title: 'Bookmarks',
            add: 'Add bookmark',
            manage: 'Manage bookmarks',
            name: 'Description',
            url: 'URL',
            empty: 'There are no bookmarks set yet!',
        },
        christmasCountdown: {
            countdown: [
                '<b>{{days}}</b> day until Christmas Eve.',
                '<b>{{days}}</b> days until Christmas Eve.',
            ],
            christmas: '🎄 Today is Christmas Eve. Merry Christmas! 🎄',
        },
        courses: {
            grades: 'Grades',
        },
        myCourses: {
            lists: {
                empty: 'No courses with currently selected filter available.',
                myCoursesLink: 'My courses',
            },
        },
        speiseplan: {
            title: 'Menu of the canteen',
            close: 'Close',
            toStudiwerkPage: 'Menu on the website of Studentenwerk',
            table: {
                speise: 'Dish',
                type: 'Type(s)',
                price: 'Price',
            },
        },
        semesterzeiten: {
            skip: 'Skip semester times',
            table: {
                name: 'Period',
                start: 'Start',
                end: 'End',
                finished: 'Progress',
                show: 'Show in Progress bar?',
                holiday: 'Public Holiday',
            },
        },
        weatherDisplay: {
            title: 'Weather-Moodle',
            close: 'Close',
            updated: 'Last updated at',
            credits: {
                _long: 'Weather data provided by',
                _short: 'Source',
                wttrIn: {
                    name: 'wttr.in',
                    url: 'https://wttr.in',
                },
                openMeteo: {
                    name: 'Open-Meteo',
                    url: 'https://open-meteo.com',
                },
                visualCrossing: {
                    name: 'Visual Crossing',
                    url: 'https://www.visualcrossing.com',
                },
                openWeatherMap: {
                    name: 'OpenWeatherMap',
                    url: 'https://openweathermap.org',
                },
                pirateWeather: {
                    name: 'Pirate Weather',
                    url: 'https://pirateweather.net',
                },
            },
            weatherCodes: {
                // Using the codes of openweathermap.org
                0: 'Weather not available',
                200: 'Thunderstorm with light rain',
                201: 'Thunderstorm with rain',
                202: 'Thunderstorm with heavy rain',
                210: 'Light thunderstorm',
                211: 'Thunderstorm',
                212: 'Heavy thunderstorm',
                221: 'Ragged thunderstorm',
                230: 'Thunderstorm with light drizzle',
                231: 'Thunderstorm with drizzle',
                232: 'Thunderstorm with heavy drizzle',
                300: 'Light intensity drizzle',
                301: 'Drizzle',
                302: 'Heavy intensity drizzle',
                310: 'Light intensity drizzle rain',
                311: 'Drizzle rain',
                312: 'Heavy intensity drizzle rain',
                313: 'Shower rain and drizzle',
                314: 'Heavy shower rain and drizzle',
                321: 'Shower drizzle',
                500: 'Light rain',
                501: 'Moderate rain',
                502: 'Heavy intensity rain',
                503: 'Very heavy rain',
                504: 'Extreme rain',
                511: 'Freezing rain',
                520: 'Light intensity shower rain',
                521: 'Shower rain',
                522: 'Heavy intensity shower rain',
                531: 'Ragged shower rain',
                600: 'Light snow',
                601: 'Snow',
                602: 'Heavy snow',
                611: 'Sleet',
                612: 'Light shower sleet',
                613: 'Shower sleet',
                615: 'Light rain and snow',
                616: 'Rain and snow',
                620: 'Light shower snow',
                621: 'Shower snow',
                622: 'Heavy shower snow',
                701: 'Mist',
                711: 'Smoke',
                721: 'Haze',
                731: 'Sand, dust whirls',
                741: 'Fog',
                751: 'Sand',
                761: 'Dust',
                762: 'Volcanic ash',
                771: 'Squalls',
                781: 'Tornado',
                800: 'Clear sky',
                801: 'Few clouds',
                802: 'Scattered clouds',
                803: 'Broken clouds',
                804: 'Overcast clouds',
            },
        },
        modals: {
            settings: {
                title: 'Preferences',
                moodleSettings: 'Go to Moodle-Preferences',
                installedVersion: 'installed version',
                latestVersion: 'latest Version',
                updateBtn: 'install update',
                import: 'import preferences',
                export: 'export preferences',
            },
            update: {
                title: 'Update Better-Moodle',
                content:
                    'Follow the instructions for updating in the script manager (e.g. Tampermonkey) and then reload Moodle.',
            },
            changelog: 'Changelog',
            help: {
                title: 'Support for Better-Moodle',
                close: 'Thanks for the great support! 😊',
                content: `
# Lovely that you found this little window! 🎉


---


## How does ... work? What if ...?

Please read the Better-Moodle FAQ first: [Better-Moodle FAQ]({{faqLink}}).


## Okay cool, but it doesn't say XY. What now?

Why don't you write an email to Jan: [{{mailAdress}}]({{mailLinkHelp}}).

Please remember to use your university e-mail address and not your private e-mail address.

## I have found an error!

Oops? there are no errors in Better-Moodle?! 😱

Joking aside, even in Better-Moodle it can happen that an error occurs. Feel free to open a new issue on [GitHub]({{githubIssueBug}}) or write Jan an email if you don't want to use GitHub: [{{mailAdress}}]({{mailLinkBug}}).

Please always provide as much information as possible so that the bug can be traced and reproduced in the best possible way.
This helps to fix it faster and more efficiently.

## I have a great idea for a new feature!

Feel free to create an issue on [GitHub]({{githubIssueFeature}}), submit a contribution there or write an email to Jan: [{{mailAdress}}]({{mailLinkFeature}})`,
                mails: {
                    help: {
                        subject: 'I need help please',
                        content: `Hello Jan,

I have a question about Better-Moodle, but unfortunately I didn't find an answer in the FAQ:

[...]

Many thanks and best regards
[Your name]`,
                    },
                    bug: {
                        subject: 'Bug-Report',
                        content: `Hello Jan,
I have found a bug in Better-Moodle!

I am using this browser:
I use this version of Better-Moodle: {{currentVersion}}
I was following these steps when the problem occurred:
This is the behavior I would have expected instead:

Best regards
[Your name]`,
                    },
                    feature: {
                        subject: 'Feature idea',
                        content: `Hello Jan,
I have a great suggestion for Better-Moodle:

[here is a detailed description of the suggestion]

Best regards
[your name]`,
                    },
                },
            },
        },
        clock: {
            fuzzyClock: {
                to: 'to',
                past: 'past',
                oClock: 'o’clock',
                half: 'half past',
                0: 'Twelve',
                1: 'One',
                2: 'Two',
                3: 'Three',
                4: 'Four',
                5: 'Five',
                6: 'Six',
                7: 'Seven',
                8: 'Eight',
                9: 'Nine',
                10: 'Ten',
                11: 'Eleven',
                12: 'Twelve',
                15: 'Quarter',
                20: 'Twenty',
                25: 'Twenty-five',
                other: {
                    30: [
                        'Sleep',
                        'Breakfast',
                        'Second Breakfast',
                        'Elevenses',
                        'Lunch',
                        'Afternoon tea',
                        'Dinner',
                        'Supper',
                    ],
                    40: [
                        'Night',
                        'Early morning',
                        'Morning',
                        'Almost noon',
                        'Noon',
                        'Afternoon',
                        'Evening',
                        'Late Evening',
                    ],
                    50: [
                        'Start of week',
                        'Middle of week',
                        'End of week',
                        'Weekend!',
                    ],
                },
            },
        },
        settings: {
            general: {
                _title: 'General settings',
                updateNotification: {
                    name: 'Notification for Better-Moodle updates',
                    description:
                        'Displays a small red dot by the cogs in the navigation bar when there is an update for Better-Moodle.',
                },
                fullwidth: {
                    name: 'Full width',
                    description:
                        'Removes the weird white border and makes pages use the full width.',
                },
                externalLinks: {
                    name: 'External links',
                    description:
                        'Ensures that external links are always automatically opened in a new tab.',
                },
                truncatedTexts: {
                    name: 'Truncated texts',
                    description:
                        'Adds a title attribute to potentially truncated texts so that you can read the full text via mouse hover.',
                },
                bookmarkManager: {
                    name: 'Bookmark Manager',
                    description:
                        'Enables a small internal bookmark manager to jump directly to specific locations in Moodle.',
                },
                noDownload: {
                    name: 'Prevent download',
                    description:
                        'Prevents automatic downloading of files (especially PDFs) wherever possible.',
                },
                eventAdvertisements: {
                    name: 'Event announcements',
                    description:
                        'Occasionally (rarely) displays announcements about cool events from your student committees ("Studentische Gremien") in the navigation bar.',
                },
                christmasCountdown: {
                    name: 'Countdown to Christmas Eve 🎄',
                    description:
                        'Displays a countdown to Christmas Eve in the navigation bar.\nThis is a small homage to the math pre-course.',
                },
                speiseplan: {
                    name: 'Open canteen menu in Moodle',
                    description:
                        'Opens menu of the canteen in a popup in Moodle.',
                },
                googlyEyes: {
                    name: 'xEyes for Better-Moodle',
                    description: '👀',
                },
                semesterzeiten: {
                    name: 'Semester times',
                    description:
                        'Displays a new field in the dashboard with a progress bar of the current semester. Also included: information about important periods in the semester.',
                },
                language: {
                    name: 'Better-Moodle Language',
                    description: 'Choose the language of Better-Moodle.',
                    options: {
                        auto: '🌐 Auto (Moodle language)',
                        de: '🇩🇪 German',
                        en: '🇬🇧 English',
                    },
                },
            },
            darkmode: {
                _title: 'Darkmode',
                _description:
                    'Darkmode in Better-Moodle is brought to you through [Dark Reader](https://darkreader.org/). 😊',
                mode: {
                    name: 'Mode',
                    description: 'Select a mode for Darkmode (on, off, auto)',
                    options: {
                        on: 'On',
                        off: 'Off',
                        auto: 'Auto (follow system setting)',
                    },
                },
                brightness: {
                    name: 'Brightness',
                    description: 'Set the brightness of the dark mode.',
                },
                contrast: {
                    name: 'Contrast',
                    description: 'Set the contrast of the dark mode.',
                },
                grayscale: {
                    name: 'Grayscale',
                    description:
                        'Set how few colours you want to have in Moodle.',
                },
                sepia: {
                    name: 'Sepia',
                    description: 'Set the sepia value of the dark mode.',
                },
            },
            dashboard: {
                '_title': 'Dashboard',
                '~layoutPlaceholder': {
                    name: 'Layout',
                    description:
                        'Here you should be able to customize the layout. Unfortunately, this is not ready yet. Please be patient with this :)',
                },
                'courseListFilter': {
                    name: 'Filter of the course sidebar',
                    description:
                        'Which courses should be displayed in the sidebar? The filters of the "My courses" page are available.',
                },
                'courseListFavouritesAtTop': {
                    name: 'Show favourite courses at top',
                    description:
                        'Favourite courses are always displayed at the top of the course list instead of in the normal position when sorted alphabetically.',
                },
            },
            myCourses: {
                _title: 'My courses',
                boxesPerRow: {
                    name: 'Tiles per row',
                    description:
                        'Number of tiles per row on the "My Courses" page when the view is set to "Tiles". (Is active up to a window/screen width of 840px)',
                },
                navbarDropdown: {
                    name: 'Dropdown in the navigation bar',
                    description:
                        'Converts the "My courses" link into a dropdown to allow quick direct access to all your courses.',
                },
                navbarDropdownFilter: {
                    name: 'Filter the course dropdown',
                    description:
                        'Which courses should be displayed in the dropdown? The filters on the "My courses" page are available.',
                },
                navbarDropdownFavouritesAtTop: {
                    name: 'Show favourite courses at top in dropdown',
                    description:
                        'Favourite courses are always displayed at the top of the course dropdown instead of in the normal position when sorted alphabetically.',
                },
            },
            courses: {
                _title: 'Courses',
                grades: {
                    name: 'Link to reviews in the sidebar',
                    description:
                        "Displays a link to the course's grades in the left sidebar.",
                },
                gradesNewTab: {
                    name: 'Open grades in new tab',
                    description: 'Opens the grades in a new tab by default.',
                },
                collapseAll: {
                    name: 'Fully collapse/expand sidebar',
                    description:
                        'Collapses or expands all sections in the sidebar when one of the arrows in the sidebar is double-clicked.',
                },
                imgMaxWidth: {
                    name: 'Prevent image overflow',
                    description:
                        'Prevents images in courses from taking up more than the full width, causing the page to scroll horizontally.',
                },
                imageZoom: {
                    name: 'Zoom images',
                    description:
                        'Zooms in on an image when it is clicked. This allows small images to be enlarged at the touch of a button.',
                },
                hideSelfEnrolHint: {
                    name: 'Hide hint for self-enrollment without enrollment key',
                    description:
                        'Moodle displays a hint when self-enrollment without an enrollment key is enabled for a course. Some people find this hint annoying, so it can be hidden with this setting.',
                },
            },
            clock: {
                _title: 'Clock',
                fuzzyClock: {
                    name: 'Fuzzy Clock',
                    description: 'A fuzzy clock, known from KDE Plasma.',
                    fuzziness: {
                        name: 'Fuzziness',
                        description: 'How fuzzy should the fuzzy clock be?',
                        labels: {
                            '5min': '5 Minutes',
                            '15min': '15 Minutes',
                            'food': 'Food',
                            'day': 'Daytime',
                            'week': 'Weektime',
                        },
                    },
                },
            },
            messages: {
                _title: 'Messages',
                sendHotkey: {
                    name: 'Send messages by hotkey',
                    description:
                        'Allows messages to be sent using a key combination (e.g. Ctrl + Enter).',
                    options: {
                        '': '[Disabled] Do not send by hotkey',
                        'shiftEnter': 'Shift + Enter',
                        'ctrlEnter': 'Ctrl + Enter',
                    },
                },
            },
            weatherDisplay: {
                _title: 'Weather-Moodle',
                _description: `To get good weather data, you need an API key for some providers.
Better-Moodle never requires more than the free plan of the respective provider to work.`,
                show: {
                    name: 'Show weather',
                    description: 'Show the weather in Moodle.',
                },
                provider: {
                    name: 'Provider',
                    description: 'Choose the provider for the weather data.',
                    options: {
                        wttrIn: 'wttr.in',
                        openMeteo: 'Open-Meteo',
                        visualCrossing: 'Visual Crossing (requires API-Key)',
                        openWeatherMap: 'OpenWeatherMap (requires API-Key)',
                        pirateWeather: 'Pirate Weather (requires API-Key)',
                    },
                },
                openWeatherMapAPIKey: {
                    name: 'API-Key for OpenWeatherMap',
                    description:
                        'Put your API key for OpenWeatherMap here (the free plan is sufficient).',
                },
                pirateWeatherAPIKey: {
                    name: 'API-Key for PirateWeather',
                    description:
                        'Put your API key for PirateWeather here (the free plan is sufficient).',
                },
                visualCrossingAPIKey: {
                    name: 'API-Key for Visual Crossing',
                    description:
                        'Put your API key for Visual Crossing here (the free plan is sufficient).',
                },
                units: {
                    name: 'Units',
                    description: 'Select the units for the weather data.',
                    options: {
                        metric: 'Metric (°C, km/h, km, mm)',
                        scientific: 'SI Units (K, m/s, m, m)',
                        imperial: 'Imperial (°F, mph, mi, in)', // for weird people
                    },
                },
                showTempInNavbar: {
                    name: 'Show temperature in the navigation bar',
                    description:
                        'Show the current temperature in the navigation bar.',
                },
                toggleFeelsLike: {
                    name: "Show 'feels like' temperature",
                    description:
                        "Allows you to switch between the actual temperature and the 'feels like' temperature.",
                },
            },
        },
    },
};
// endregion

// region Helper functions
const PREFIX = str => `better-moodle-${str}`;
const getSettingKey = id => PREFIX(`settings.${id}`);
/**
 * @param {string} id
 * @param {boolean} [inputValue]
 * @returns {ValueType}
 */
const getSetting = (id, inputValue = false) =>
    inputValue ? settingsById[id].inputValue : settingsById[id].value;

const MyCoursesFilterSyncChangeKey = PREFIX('myCourses.filterSyncChange');

/**
 * Awaits the DOM to be ready and then calls the callback.
 * @param {() => void} callback
 */
const ready = callback => {
    if (document.readyState !== 'loading') callback();
    else {
        document.addEventListener('DOMContentLoaded', callback, { once: true });
    }
};

/**
 * creates a sidebar in moodle style
 * @param {string} id
 * @param {'left' | 'right'} position
 * @param {string} icon
 * @param {(content: HTMLDivElement, header: HTMLDivElement) => void} callback
 */
const createSidebar = (id, position, icon, callback) => {
    const prefix = str => `${PREFIX(id)}-sidebar-${str}`;
    const storage = prefix('open');

    const sidebar = document.createElement('div');
    sidebar.id = PREFIX(id);
    sidebar.classList.add(
        'drawer',
        `drawer-${position}`,
        'd-print-none',
        'not-initialized'
    );
    sidebar.dataset.region = 'fixed-drawer';
    sidebar.dataset.preference = crypto.randomUUID();
    sidebar.dataset.state = `show-drawer-${position}`;
    sidebar.dataset.forceopen = '';
    sidebar.dataset.closeOnResize = '1';
    if (GM_getValue(storage, true)) sidebar.classList.add('show');

    const header = document.createElement('div');
    header.classList.add('drawerheader');
    const closeBtn = document.createElement('button');
    closeBtn.classList.add('btn', 'drawertoggle', 'icon-no-margin');
    closeBtn.dataset.toggler = 'drawers';
    closeBtn.dataset.action = 'closedrawer';
    closeBtn.dataset.target = sidebar.id;
    closeBtn.dataset.toggle = 'tooltip';
    closeBtn.dataset.placement = position === 'left' ? 'right' : 'left'; // Yeah, moodle. IDK what that means and why
    closeBtn.title = $t('sidebar.close');
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('icon', 'fa', 'fa-times', 'fa-fw');
    closeIcon.setAttribute('aria-hidden', 'true');
    closeBtn.appendChild(closeIcon);
    header.appendChild(closeBtn);

    const content = document.createElement('div');
    content.classList.add('drawercontent', 'drag-container');
    content.dataset.usertour = 'scroller';

    sidebar.append(header, content);

    const toggleBtnWrapper = document.createElement('div');
    toggleBtnWrapper.classList.add(
        'drawer-toggler',
        `drawer-${position}-toggle`,
        'ml-auto',
        'd-print-none'
    );
    const toggleBtn = document.createElement('button');
    toggleBtn.classList.add('btn', 'icon-no-margin');
    toggleBtn.dataset.toggler = 'drawers';
    toggleBtn.dataset.action = 'toggle';
    toggleBtn.dataset.target = sidebar.id;
    toggleBtn.dataset.toggle = 'tooltip';
    toggleBtn.dataset.placement = position === 'left' ? 'right' : 'left'; // See above
    toggleBtn.title = $t('sidebar.open');
    toggleBtn.dataset.originalTitle = toggleBtn.title;
    const toggleBtnSRSpan = document.createElement('span');
    toggleBtnSRSpan.classList.add('sr-only');
    toggleBtnSRSpan.textContent = toggleBtn.title;
    const toggleBtnIconSpan = document.createElement('span');
    const toggleBtnIcon = document.createElement('i');
    toggleBtnIcon.classList.add('icon', 'fa', `fa-${icon}`, 'fa-fw');
    toggleBtnIcon.setAttribute('aria-hidden', 'true');
    toggleBtnIconSpan.appendChild(toggleBtnIcon);
    toggleBtn.append(toggleBtnSRSpan, toggleBtnIcon);
    toggleBtnWrapper.appendChild(toggleBtn);

    ready(() => {
        // override setting the preference
        const sup = M.util.set_user_preference;
        M.util.set_user_preference = (name, value) => {
            if (name === sidebar.dataset.preference) {
                GM_setValue(storage, value);
            } else {
                return sup(name, value);
            }
        };

        // append sidebar
        document.getElementById('page')?.before(sidebar);

        // append the toggle button
        const togglesDiv =
            document.getElementById(PREFIX(`drawer-toggles-${position}`)) ||
            (() => {
                const togglesDiv = document.createElement('div');
                togglesDiv.id = PREFIX(`drawer-toggles-${position}`);
                document
                    .querySelectorAll(`.drawer-${position}-toggle`)
                    .forEach(toggler => {
                        togglesDiv.append(toggler);
                    });
                document
                    .querySelector('#page .drawer-toggles')
                    .append(togglesDiv);
                return togglesDiv;
            })();
        togglesDiv.append(toggleBtnWrapper);

        callback(content, header);
    });
};

GM_addStyle(`
    /* Sidebars */
    .drawer-toggles:has(#${PREFIX('drawer-toggles-right')}),
    .drawer-toggles:has(#${PREFIX('drawer-toggles-left')}) {
        position: fixed;
        top: var(--navbar-height);
        left: 0;
        width: 100vw;
        margin-top: 0.7rem;
        margin-bottom: 0.7rem;
        z-index: 100;
    }
    #${PREFIX('drawer-toggles-right')},
    #${PREFIX('drawer-toggles-left')} {
        display: flex;
        flex-direction: column;
        position: fixed;
        gap: 0.7rem;
    }
    #${PREFIX('drawer-toggles-right')} {
        right: 0;
    }
    #${PREFIX('drawer-toggles-left')} {
        left: 0;
    }
    #${PREFIX('drawer-toggles-right')} .drawer-toggler,
    #${PREFIX('drawer-toggles-left')} .drawer-toggler {
        position: initial !important;
    }
    #${PREFIX('drawer-toggles-right')} .drawer-toggler .btn .icon.fa-fw,
    #${PREFIX('drawer-toggles-left')} .drawer-toggler .btn .icon.fa-fw {
        width: 16px; /* Reset to .icon default */
    }
    @media (max-width: 767.98px) {
        #${PREFIX('drawer-toggles-right')},
        #${PREFIX('drawer-toggles-left')} {
            top: auto;
            bottom: calc(2.7rem + 36px);
            flex-direction: column-reverse;
        }
    }
`);

/** @type {[number, number, number]} */
const currentScriptVersion = [];
/** @type {[number, number, number]} */
const latestScriptVersion = [];
/** @type {() => Promise<boolean>} */
const updateAvailable = () =>
    fetch('https://api.github.com/repos/jxn-30/better-moodle/releases/latest')
        .then(res => res.json())
        .then(({ tag_name }) =>
            tag_name
                .replace(/^v/, '')
                .split('.')
                .map(e => Number(e))
        )
        .then(([latestMajor, latestMinor, latestPatch]) => {
            const [currentMajor, currentMinor, currentPatch] =
                GM_info.script.version.split('.').map(e => Number(e));

            latestScriptVersion.splice(
                0,
                3,
                latestMajor,
                latestMinor,
                latestPatch
            );

            if (!Object.isFrozen(currentScriptVersion)) {
                currentScriptVersion.splice(
                    0,
                    3,
                    currentMajor,
                    currentMinor,
                    currentPatch
                );
                Object.freeze(currentScriptVersion);
            }

            return (
                latestMajor > currentMajor || // major update
                (latestMajor === currentMajor && latestMinor > currentMinor) || // minor update
                (latestMajor === currentMajor && // patch update
                    latestMinor === currentMinor &&
                    latestPatch > currentPatch)
            );
        });

// this is adopted from https://github.com/p01/mmd.js
/**
 * converts a Markdown text into HTML
 * @param {string} md
 * @param {number} [headingStart]
 */
const mdToHtml = (md, headingStart = 1) => {
    let html = '';

    const escape = string => new Option(string).innerHTML;
    const inlineEscape = string =>
        escape(string)
            .replace(/!\[([^\]]*)]\(([^(]+)\)/g, '<img alt="$1" src="$2">') // image
            .replace(/\[([^\]]+)]\(([^(]+?)\)/g, '<a href="$2">$1</a>') // link
            .replace(/`([^`]+)`/g, '<code>$1</code>') // code
            .replace(
                /(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g,
                '<strong>$2</strong>'
            ) // bold
            .replace(/([*_])(?=\S)([^\r]*?\S)\1/g, '<em>$2</em>'); // italic

    const replacements = {
        '*': [/\n\* /, '<ul><li>', '</li></ul>'],
        '1': [/\n[1-9]\d*\.? /, '<ol><li>', '</li></ol>'],
        ' ': [/\n {4}/, '<pre><code>', '</code></pre>', '\n'],
        '>': [/\n> /, '<blockquote>', '</blockquote>', '\n'],
    };

    md.replace(/^\s+|\r|\s+$/g, '')
        .replace(/\t/g, '    ')
        .split(/\n\n+/)
        .forEach(b => {
            const firstChar = b[0];
            const replacement = replacements[firstChar];
            let i;
            html +=
                replacement ?
                    replacement[1] +
                    `\n${b}`
                        .split(replacement[0])
                        .slice(1)
                        .map(replacement[3] ? escape : inlineEscape)
                        .join(replacement[3] || '</li>\n<li>') +
                    replacement[2]
                : firstChar === '#' ?
                    `<h${(i =
                        b.indexOf(' ') + (headingStart - 1))}>${inlineEscape(
                        b.slice(i + 1 - (headingStart - 1))
                    )}</h${i}>`
                : firstChar === '<' ? b
                : b.startsWith('---') ? '<hr />'
                : `<p>${inlineEscape(b)}</p>`;
        });

    return html;
};

const noExternalLinkIconClass = PREFIX('no-external-icon');

const githubPath = path => `https://github.com/jxn-30/better-moodle${path}`;
const rawGithubPath = path =>
    `https://raw.githubusercontent.com/jxn-30/better-moodle/main/${path}`;
const githubLink = (path, icon = true, externalIcon = false) => {
    const link = document.createElement('a');
    link.href = githubPath(path);
    link.target = '_blank';

    if (icon) {
        const icon = document.createElement('i');
        icon.classList.add('fa', 'fa-github', 'fa-fw');
        link.appendChild(icon);
    }

    if (!externalIcon) {
        link.classList.add(noExternalLinkIconClass);
    }

    return link;
};

/**
 * @typedef {Object} CourseGrouping
 * @property {string} classification
 * @property {string} customfieldname
 * @property {string} customfieldvalue
 * @property {boolean} active
 * @property {string} name
 */

/**
 * gets all course groupings as available in my courses view
 * @return {Promise<CourseGrouping[]>}
 */
const getCourseGroupings = () =>
    window.location.pathname.startsWith('/login') ?
        Promise.resolve([])
    :   fetch('/my/courses.php')
            .then(res => res.text())
            .then(html => new DOMParser().parseFromString(html, 'text/html'))
            .then(doc => {
                const customfieldname =
                    doc.querySelector('[data-region="courses-view"]')?.dataset
                        .customfieldname ?? '';
                return Array.from(
                    doc.querySelectorAll(
                        '#groupingdropdown + .dropdown-menu [data-filter="grouping"]'
                    )
                ).map(group => ({
                    classification: group.dataset.pref,
                    customfieldname,
                    customfieldvalue: group.dataset.customfieldvalue,
                    active: group.ariaCurrent === 'true',
                    name: group.textContent.trim(),
                }));
            });
/** gets all course groupings as options for a select */
const getCourseGroupingOptions = () =>
    getCourseGroupings().then(groupings => [
        {
            key: '_sync',
            title: $t('courseGroupings.sync'),
        },
        ...groupings.map(group => {
            delete group.active;
            return {
                key: JSON.stringify(group),
                title: group.name,
            };
        }),
    ]);

/** @type {(...elements: Node[]) => [Node, Node][]} */
const addMarqueeItems = (() => {
    const navItem = document.createElement('div');
    navItem.classList.add('flex-shrink-1');
    navItem.style.setProperty('overflow', 'hidden');

    const navLink = document.createElement('a');
    navLink.classList.add('nav-link', 'position-relative');
    navLink.id = PREFIX('nav-marquee-wrapper');

    const content = document.createElement('span');
    const textSpanClass = PREFIX('nav-marquee');
    content.classList.add(textSpanClass);

    const keyFrames = `${textSpanClass}-keyframes`;
    const scrollStartVar = '--nav-marquee-scroll-start';
    const scrollEndVar = '--nav-marquee-scroll-end';
    const scrollDurationVar = '--nav-marquee-scroll-duration';

    const SCROLL_SPEED_MS_PER_PX = 100;
    const durationForPx = px => px * SCROLL_SPEED_MS_PER_PX;

    GM_addStyle(`
#${navLink.id} {
    ${scrollStartVar}: 100%;
    ${scrollEndVar}: 100%;
    ${scrollDurationVar}: 10s;
}
#${navLink.id}.animated {
    animation: ${keyFrames} var(${scrollDurationVar}) linear infinite;
}
#${navLink.id}:not(.animated) > .${textSpanClass}:nth-child(2) {
    display: none;
}

#${navLink.id} > .${textSpanClass} > *::after {
    content: "${'\xa0'.repeat(11)}";
    background-image: url("https://www.fsmain.uni-luebeck.de/fileadmin/gremientemplate/fsmain/ico/favicon.ico");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
}
#${navLink.id}:not(.animated) > .${textSpanClass} > *:last-child::after {
    display: none;
}

@keyframes ${keyFrames} {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(var(${scrollEndVar}));
    }
}
`);

    const updateScrollWidth = () => {
        const navLinkWidth = Math.floor(navLink.getBoundingClientRect().width);
        let textSpanWidth = Math.floor(content.getBoundingClientRect().width);
        if (textSpanWidth <= navLinkWidth) {
            navLink.classList.remove('animated');
        } else {
            navLink.classList.add('animated');

            textSpanWidth = Math.floor(content.getBoundingClientRect().width);

            navLink.style.setProperty(scrollEndVar, `-${textSpanWidth}px`);
            navLink.style.setProperty(
                scrollDurationVar,
                `${durationForPx(textSpanWidth)}ms`
            );
        }
    };

    new ResizeObserver(updateScrollWidth).observe(navLink);

    const cloneEl = content.cloneNode(true);

    navLink.append(content, cloneEl);
    navItem.append(navLink);
    ready(() => {
        document.getElementById('usernavigation')?.prepend(navItem);
        updateScrollWidth();
    });

    /** @type {Node[]} */
    const marqueeElements = [];
    /** @type {Node[]} */
    const clonedMarqueeElements = [];

    /** @type {(...elements: Node[]) => [Node, Node][]} */
    const addItems = (...elements) => {
        marqueeElements.push(...elements);
        clonedMarqueeElements.push(...elements.map(e => e.cloneNode(true)));

        const newElements = marqueeElements.slice(-elements.length);
        const newClonedElements = clonedMarqueeElements.slice(-elements.length);

        content.append(...newElements);
        cloneEl.append(...newClonedElements);

        updateScrollWidth();

        return newElements.map((e, i) => [e, newClonedElements[i]]);
    };

    // we can add information about oncoming events like FZB and Nikolausumtrunk here.
    // the getSetting method cannot be used as SETTINGS is not defined there yet
    if (GM_getValue(getSettingKey('general.eventAdvertisements'), true)) {
        // await fetch('http://localhost:3000/data/events.json') // this is for testing locally (npx serve --cors)
        fetch(rawGithubPath('data/events.json'))
            .then(res => res.json())
            .then(events =>
                events.filter(event => new Date(event.end) > Date.now())
            )
            .then(events =>
                events.map(event => {
                    const mainAdElement = document.createElement('span');
                    mainAdElement.textContent = event.text;

                    const startDate = new Date(event.start);
                    const endDate = new Date(event.end);
                    const now = new Date();
                    if (startDate > now || endDate < now) {
                        mainAdElement.classList.add('hidden');
                    }
                    if (startDate > now) {
                        setTimeout(
                            () => mainAdElement.classList.remove('hidden'),
                            startDate - now
                        );
                    }
                    if (now < endDate) {
                        setTimeout(
                            () => mainAdElement.classList.add('hidden'),
                            endDate - now
                        );
                    }

                    return mainAdElement;
                })
            )
            .then(eventItems => {
                marqueeElements.unshift(...eventItems);
                clonedMarqueeElements.unshift(
                    ...eventItems.map(e => e.cloneNode(true))
                );

                const newElements = marqueeElements.slice(0, eventItems.length);
                const newClonedElements = clonedMarqueeElements.slice(
                    0,
                    eventItems.length
                );

                content.prepend(...newElements);
                cloneEl.prepend(...newClonedElements);

                updateScrollWidth();
            });
    }

    return addItems;
})();

// that is the contact mail of Jan but encoded a little so that it is not easily readable by bots
const cntctAdr = `${atob(
    'LTE5MjUsLTE5MTIsLTE5MjIsLTE5MTksLTE5MTQsLTE5MjIsLTE5MDksLTE5MTUsLTE5MjI='
)
    .split(',')
    .map(c => String.fromCharCode(Number(c) + 2023))
    .join('')}@${['fsmain', ...location.hostname.split('.').slice(-2)].join(
    '.'
)}`;

const getEmail = (subject = '', body = '') => {
    const url = new URL(`mailto:${cntctAdr}`);
    url.searchParams.set('subject', subject);
    url.searchParams.set('body', body);
    // e.g. Thunderbird does take the + literally instead of decoding it to a space
    return url.href.replace(/\+/g, '%20');
};

const isDashboard =
    window.location.pathname === '/my/' ||
    window.location.pathname === '/my/index.php';

const MOODLE_LANG = document.documentElement.lang.toLowerCase();
const BETTER_MOODLE_LANG = (() => {
    const savedLanguage = GM_getValue(
        getSettingKey('general.language'),
        'auto'
    );
    if (savedLanguage === 'auto') return MOODLE_LANG;
    return savedLanguage;
})();
const DARK_MODE_SELECTOR = 'html[data-darkreader-scheme="dark"]';

const $t = (key, args = {}) => {
    const t =
        key
            .split('.')
            .reduce(
                (prev, current) =>
                    (prev || TRANSLATIONS[BETTER_MOODLE_LANG])[current],
                TRANSLATIONS[BETTER_MOODLE_LANG]
            ) ?? key;
    if (t === key) {
        console.warn(
            `Better-Moodle: Translation for key "${key}" on locale ${BETTER_MOODLE_LANG} not found!`
        );
    }
    return Object.entries(args).reduce(
        (t, [key, value]) => t.replaceAll(`{{${key}}}`, value),
        t
    );
};

/**
 * @param {string} name
 * @param {string} [collapseBtnId]
 * @param {string} [containerId]
 */
const createFieldset = (
    name,
    collapseBtnId = crypto.randomUUID(),
    containerId = crypto.randomUUID()
) => {
    const fieldset = document.createElement('fieldset');

    const legend = document.createElement('legend');
    legend.classList.add('sr-only');
    legend.textContent = name;

    const headerRow = document.createElement('div');
    headerRow.classList.add('d-flex', 'align-items-center', 'mb-2');
    const headerWrapper = document.createElement('div');
    headerWrapper.classList.add(
        'position-relative',
        'd-flex',
        'ftoggler',
        'align-items-center',
        'position-relative',
        'w-100'
    );
    const collapseBtn = document.createElement('a');
    collapseBtn.classList.add(
        'btn',
        'btn-icon',
        'mr-1',
        'icons-collapse-expand',
        'stretched-link',
        'fheader',
        'collapsed'
    );
    collapseBtn.dataset.toggle = 'collapse';
    collapseBtn.id = PREFIX(collapseBtnId);
    const expandedSpan = document.createElement('span');
    expandedSpan.classList.add('expanded-icon', 'icon-no-margin', 'p-2');
    expandedSpan.title = 'Einklappen';
    const expandedIcon = document.createElement('i');
    expandedIcon.classList.add('icon', 'fa', 'fa-chevron-down', 'fa-fw');
    expandedSpan.append(expandedIcon);
    const collapsedSpan = document.createElement('span');
    collapsedSpan.classList.add('collapsed-icon', 'icon-no-margin', 'p-2');
    collapsedSpan.title = 'Ausklappen';
    const collapsedLTRIcon = document.createElement('i');
    collapsedLTRIcon.classList.add(
        'icon',
        'fa',
        'fa-chevron-right',
        'fa-fw',
        'dir-ltr-hide'
    );
    const collapsedRTLIcon = document.createElement('i');
    collapsedRTLIcon.classList.add(
        'icon',
        'fa',
        'fa-chevron-right',
        'fa-fw',
        'dir-rtl-hide'
    );
    collapsedSpan.append(collapsedLTRIcon, collapsedRTLIcon);
    collapseBtn.append(expandedSpan, collapsedSpan);

    const heading = document.createElement('h3');
    heading.classList.add(
        'd-flex',
        'align-self-stretch',
        'align-items-center',
        'mb-0',
        'w-100'
    );
    heading.textContent = name;

    headerWrapper.append(collapseBtn, heading);
    headerRow.append(headerWrapper);

    const container = document.createElement('div');
    container.classList.add('fcontainer', 'collapseable', 'collapse');
    container.id = PREFIX(containerId);
    collapseBtn.href = `#${container.id}`;

    fieldset.append(legend, headerRow, container);

    return { fieldset, legend, headerRow, container, heading, collapseBtn };
};

const appendableListFormClass = PREFIX('appendable-list-form');
GM_addStyle(`
.${appendableListFormClass} {
    color: inherit;
}

.${appendableListFormClass} .fitem {
    column-gap: 1em;
}

.${appendableListFormClass} > .fcontainer :is(.fitem:first-child [data-button="up"], .fitem:last-child [data-button="down"]) {
    opacity: 0.65;
    pointer-events: none;
    cursor: not-allowed;
}`);

/**
 * @param {string} id
 * @template ALFData
 * @param {(data: ALFData) => HTMLDivElement[]} createFormItem
 * @param {ALFData} emptyData
 * @returns {{form: HTMLFormElement, addFormItems: (data: ALFData[]) => void}}
 */
const createAppendableListForm = (id, createFormItem, emptyData) => {
    const form = document.createElement('form');
    form.classList.add('mform', appendableListFormClass);
    form.id = PREFIX(id);
    const container = document.createElement('div');
    container.classList.add('fcontainer');

    /**
     * @template ALFData
     * @param {ALFData} data
     */
    const addFormItem = data => {
        const group = document.createElement('div');
        group.classList.add(
            'form-group',
            'd-flex',
            'flex-wrap',
            'flex-lg-nowrap',
            'fitem'
        );

        const btns = document.createElement('div');
        btns.classList.add('btn-group', 'ml-auto');
        const moveUpBtn = document.createElement('button');
        moveUpBtn.classList.add('btn', 'btn-outline-secondary');
        moveUpBtn.dataset.button = 'up';
        const upIcon = document.createElement('i');
        upIcon.classList.add('fa', 'fa-arrow-up', 'fa-fw');
        moveUpBtn.append(upIcon);
        const moveDownBtn = document.createElement('button');
        moveDownBtn.classList.add('btn', 'btn-outline-secondary');
        moveDownBtn.dataset.button = 'down';
        const downIcon = document.createElement('i');
        downIcon.classList.add('fa', 'fa-arrow-down', 'fa-fw');
        moveDownBtn.append(downIcon);
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('btn', 'btn-outline-danger');
        deleteBtn.dataset.button = 'delete';
        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa', 'fa-trash', 'fa-fw');
        deleteBtn.append(deleteIcon);

        btns.append(moveUpBtn, moveDownBtn, deleteBtn);

        const mobileLinebreak = document.createElement('div');
        mobileLinebreak.classList.add('w-100', 'd-lg-none');

        group.append(...createFormItem(data), mobileLinebreak, btns);
        container.append(group);
    };

    const addFormItems = data => data.forEach(d => addFormItem(d));

    const addBtn = document.createElement('button');
    addBtn.classList.add('btn', 'btn-outline-success', 'd-block', 'ml-auto');
    const addIcon = document.createElement('i');
    addIcon.classList.add('fa', 'fa-plus', 'fa-fw');
    addBtn.append(addIcon);

    form.addEventListener('click', e => {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        const button = target.closest('[data-button]');
        const row = target.closest('.fitem');
        if (!button || !row) return;

        const action = button.dataset.button;
        switch (action) {
            case 'up':
                row.previousSibling.before(row);
                break;
            case 'down':
                row.nextSibling.after(row);
                break;
            case 'delete':
                row.remove();
                break;
        }
    });

    addBtn.addEventListener('click', e => {
        e.preventDefault();
        addFormItem(emptyData);
    });

    form.append(container, addBtn);

    return { form, addFormItems };
};

/**
 * @typedef {Object} SpeiseplanFilter
 * @property {string} title
 * @property {string} abk
 * @property {string} [img]
 */

/**
 * @typedef {Object} Speise
 * @property {boolean} mensa
 * @property {{name: string, zusatz?: string}[]} items
 * @property {string[]} allergene
 * @property {string[]} zusatzstoffe
 * @property {string[]} arten
 * @property {number[]} preise
 */

/**
 * @typedef {Object} Speiseplan
 * @property {Record<string, Speise[]>} speisen
 * @property {SpeiseplanFilter} filters
 */

/**
 * get the speiseplan of this and next week
 * @returns {Promise<Speiseplan>}
 */
const getSpeiseplan = async () => {
    const filterTypes = {
        1: 'allergene',
        2: 'zusatzstoffe',
        3: 'arten',
    };
    Object.seal(filterTypes);
    Object.freeze(filterTypes);

    /**
     * @param {Document} doc
     * @returns {Speiseplan['speisen']}
     */
    const getSpeisen = doc => {
        const speisen = {};
        doc.querySelectorAll('.mensa_menu_detail').forEach(speise => {
            const day = speise.closest('[data-day]').dataset.day;
            speisen[day] ??= [];
            const items = [{ name: '' }];
            speise.querySelector('.menu_name').childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    items.at(-1).name += node.textContent.trim();
                }
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.tagName === 'BR') {
                        items.push({ name: '' });
                    } else if (node.classList.contains('mensa_zusatz')) {
                        items.at(-1).zusatz = node.textContent.trim();
                    }
                }
            });
            speisen[day].push({
                mensa: !!speise.querySelector('.mensatyp_mensa'),
                items,
                allergene: speise.dataset.allergene.split('|').filter(Boolean),
                zusatzstoffe: speise.dataset.zusatzstoffe
                    .split('|')
                    .filter(Boolean),
                arten: speise.dataset.arten.split('|').filter(Boolean),
                preise: speise
                    .querySelector('.menu_preis')
                    ?.textContent?.trim()
                    .split('/')
                    .map(p => p.trim().replace(',', '.'))
                    .map(p => parseFloat(p))
                    .filter(Boolean),
            });
        });
        return speisen;
    };

    const localizedPath = {
        de: 'mensen-in-luebeck',
        en: 'food-overview',
    };
    Object.seal(localizedPath);
    Object.freeze(localizedPath);

    /**
     * Fetches the speiseplan from the studentenwerk website and returns it as a document
     * @param {boolean} [nextWeek]
     * @returns {Promise<Document>}
     */
    const getDoc = (nextWeek = false) =>
        new Promise(resolve =>
            GM_xmlhttpRequest({
                url: `https://studentenwerk.sh/${BETTER_MOODLE_LANG}/${
                    localizedPath[BETTER_MOODLE_LANG]
                }?ort=3&mensa=8${nextWeek ? '&nw=1' : ''}`,
                onload: ({ responseText }) =>
                    resolve(
                        new DOMParser().parseFromString(
                            responseText,
                            'text/html'
                        )
                    ),
            })
        );

    const mensaplanDoc = await getDoc();

    /** @type {Record<string, Record<string, SpeiseplanFilter>>} */
    const filters = {
        arten: {
            SHT: {
                // we need to define SH-Teller as it is not defined on english website
                title: 'Schleswig-Holstein Teller',
                abk: '',
                img: 'https://studentenwerk.sh/upload/img/sh_teller1.png?h=80&t=2',
            },
        },
    };
    mensaplanDoc.querySelectorAll('.filterbutton').forEach(filter => {
        const type = filterTypes[filter.dataset.typ];
        filters[type] ??= {};
        const img = filter.querySelector('img')?.src ?? undefined;
        let imgUrl;
        if (img) {
            imgUrl = new URL(new URL(img).pathname, 'https://studentenwerk.sh');
        }
        filters[type][filter.dataset.wert] = {
            title:
                filter.querySelector('span:not(.abk)')?.textContent?.trim() ??
                '',
            abk: filter.querySelector('span.abk')?.textContent?.trim() ?? '',
            ...(imgUrl ? { img: imgUrl.href } : {}),
        };
    });
    Object.freeze(filters);

    return {
        filters,
        speisen: {
            ...getSpeisen(mensaplanDoc),
            ...getSpeisen(await getDoc(true)),
        },
    };
};

const debounce = (fn, delay = 100) => {
    let timeout;
    return () => {
        const context = this;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(context, arguments), delay);
    };
};

/**
 * @param {Date} date
 * @param {boolean} [year=true]
 * @param {boolean} [weekday=false]
 */
const dateToString = (date, year = true, weekday = false) =>
    date.toLocaleDateString(BETTER_MOODLE_LANG, {
        weekday: weekday ? 'long' : undefined,
        year: year ? 'numeric' : undefined,
        month: '2-digit',
        day: '2-digit',
    });
/**
 * @param {Date} date
 * @param {boolean} [seconds=true]
 */
const timeToString = (date, seconds = true) =>
    date.toLocaleTimeString(BETTER_MOODLE_LANG, {
        hour: '2-digit',
        minute: '2-digit',
        second: seconds ? '2-digit' : undefined,
    });

/**
 * @param {number} delay
 * @param {CallableFunction} callback
 */
const animationInterval = (delay, callback, runImmediate = false) => {
    if (runImmediate) {
        callback();
    }

    let last = Date.now();
    let currentId;
    const intervalCallback = () => {
        currentId = requestAnimationFrame(intervalCallback);

        const now = Date.now();
        const elapsed = now - last;

        if (elapsed >= delay) {
            last = now - (elapsed % delay);
            callback();
        }
    };
    currentId = requestAnimationFrame(intervalCallback);
    return () => cancelAnimationFrame(currentId);
};
// endregion

// region Global styles
// some general style
GM_addStyle(`
/* disable the weird scroll behaviour on login page (background image shall not be moved) */
#page-login-index {
    overflow: hidden;
}

#page-login-index #page-wrapper {
    overflow: auto;
}

/* Use a pointer cursor on toggle buttons */
.custom-control.custom-switch .custom-control-label {
    cursor: pointer;
}

/* avoid overflow of #usernavigation navigation bar */
#usernavigation {
    max-width: calc(100% - 1rem); /* 1rem is the padding of the navbar */
}

/* remove "external link" icon for specific classes (discouraged but sometimes it doesn't look good) */
body.dir-ltr a.${noExternalLinkIconClass}::after,
body.dir-rtl a.${noExternalLinkIconClass}::before {
    display: none !important;
}

/* fix info-buttons next to form labels to be aligned left instead of centered */
.form-label-addon [data-toggle="popover"] i.icon.fa {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
}
    `);
// endregion

// region Settings
/** @template ValueType */
class Setting {
    /** @type {string} */
    #id;
    /** @type {ValueType} */
    #default;
    /** @type {HTMLInputElement} */
    #input = document.createElement('input');
    /** @type {(settings: Record<string, Setting>) => boolean} */
    #disabledFn = () => false;
    /** @type {HTMLLabelElement} */
    #label;

    /**
     * @param {string} id
     * @param {ValueType} defaultValue
     */
    constructor(id, defaultValue) {
        if (this.constructor === Setting) {
            throw new TypeError(
                'Cannot create instance of abstract class Setting'
            );
        }
        this.#id = id;
        this.#default = defaultValue;

        // removing invalid characters from HTML id
        this.#input.id = PREFIX(`settings-input-${this.id}`)
            .replace(/ /gu, '_')
            .replace(/["']/gu, '')
            .replace(/[^\w-]/gu, '-');
        this.#input.value = this.value;
    }

    /**
     * @returns {string}
     */
    get id() {
        return this.#id;
    }

    /**
     * @returns {string}
     */
    get settingKey() {
        return getSettingKey(this.id);
    }

    /**
     * @returns {ValueType}
     */
    get inputValue() {
        return this.#input.value;
    }

    /**
     * @returns {ValueType}
     */
    get value() {
        return GM_getValue(this.settingKey, this.#default);
    }

    /**
     * @param {ValueType} newValue
     */
    set value(newValue) {
        this.#input.value = newValue;
        GM_setValue(this.settingKey, newValue);
    }

    /**
     * @returns {string}
     */
    get title() {
        return $t(`settings.${this.id}.name`).toString();
    }

    /**
     * @returns {string}
     */
    get description() {
        return $t(`settings.${this.id}.description`).toString();
    }

    /**
     * @returns {HTMLInputElement}
     */
    get formControl() {
        return this.#input;
    }

    /**
     * @returns {string}
     */
    get inputId() {
        return this.#input.id;
    }

    /**
     * @param {function(Record<string, Setting>): boolean} disabledFn
     * @returns {this}
     */
    setDisabledFn(disabledFn) {
        this.#disabledFn = disabledFn;
        return this;
    }

    /**
     * @param {Record<string, Setting>} settings
     * @returns {boolean}
     */
    toggleDisabled(settings) {
        const disabled = this.#disabledFn(settings);
        this.#input.disabled = disabled;
        if (disabled) {
            this.#input.classList.add('disabled');
            this.#label?.classList.add('text-muted');
        } else {
            this.#input.classList.remove('disabled');
            this.#label?.classList.remove('text-muted');
        }
        return disabled;
    }

    /**
     * @param {HTMLLabelElement} label
     */
    setLabel(label) {
        this.#label = label;
    }

    saveInput() {
        this.value = this.#input.value;
    }

    resetInput() {
        this.#input.value = this.value;
    }

    /**
     * @param {function(InputEvent): void} listener
     * @returns {this}
     */
    onInput(listener) {
        this.#input.addEventListener('input', listener);
        return this;
    }
}

/** @extends {Setting<boolean>} */
class BooleanSetting extends Setting {
    /** @type {HTMLDivElement} */
    #_formControl = document.createElement('div');

    /**
     * @param {string} id
     * @param {boolean} defaultValue
     */
    constructor(id, defaultValue) {
        super(id, defaultValue);

        // set up the real formControl to be used in settings modal
        this.#_formControl.classList.add('custom-control', 'custom-switch');
        super.formControl.classList.add('custom-control-input');
        super.formControl.type = 'checkbox';
        super.formControl.checked = this.value;

        const switchLabel = document.createElement('label');
        switchLabel.classList.add('custom-control-label');
        switchLabel.htmlFor = super.formControl.id;
        switchLabel.textContent = '';

        this.#_formControl.append(super.formControl, switchLabel);
    }

    /**
     * @returns {boolean}
     */
    get inputValue() {
        return super.formControl.checked;
    }

    /**
     * @returns {HTMLDivElement}
     */
    get formControl() {
        return this.#_formControl;
    }

    saveInput() {
        this.value = super.formControl.checked;
    }

    resetInput() {
        super.formControl.checked = this.value;
    }
}

/** @extends {Setting<string>} */
class StringSetting extends Setting {
    /**
     * @param {string} id
     * @param {string} defaultValue
     */
    constructor(id, defaultValue) {
        super(id, defaultValue);

        super.formControl.type = 'text';
        super.formControl.classList.add('form-control');
    }
}

/** @extends {Setting<number>} */
class NumberSetting extends Setting {
    /**
     * @param {string} id
     * @param {number} defaultValue
     * @param {number} [min]
     * @param {number} [max]
     * @param {number} [step]
     */
    constructor(id, defaultValue, min, max, step = 1) {
        super(id, defaultValue);

        super.formControl.type = 'number';
        super.formControl.classList.add('form-control');
        if (typeof min === 'number') {
            super.formControl.min = min.toString();
        }
        if (typeof max === 'number') {
            super.formControl.max = max.toString();
        }
        if (typeof step === 'number') {
            super.formControl.step = step.toString();
        }
    }

    /** @returns {number} */
    get inputValue() {
        return Number(super.formControl.value);
    }
}

GM_addStyle(`
/* Some style to show tick-mark labels on range inputs */
datalist[style*="--label-count"] {
    display: grid;
    grid-template-columns: repeat(var(--label-count), minmax(0, 1fr));
    text-align: center;
    /* WTF? idk how and why but it seems to work. It positions the labels almost correctly */
    margin: 0 calc(50% - 0.5 * calc((1 + 1 / (var(--label-count) - 1)) * (100% - 1em)));
}
/* overlapping text is bad => hide with ellipsis */
datalist[style*="--label-count"] > option {
    overflow: hidden;
    text-overflow: ellipsis;
}
/* make first and last label have custom alignments for better visibility */
datalist[style*="--label-count"] > option:first-child {
    text-align: left;
    padding-left: calc(50% - 4px);
}
datalist[style*="--label-count"] > option:last-child {
    text-align: right;
    padding-right: calc(50% - 4px);
}
/* add ticks to labels */
datalist[style*="--label-count"] > option::after {
    content: "";
    position: absolute;
    border: 1px solid grey;
    height: 10px;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    top: 0;
}

/* style to show a bubble with current range input value */
input[type="range"] + output {
    position: absolute;
    text-align: center;
    padding: 2px;
    background-color: var(--primary);
    color: white;
    border-radius: 4px;
    font-weight: bold;
    z-index: 1;
    
    /* position the label correctly */
    left: calc(1% * var(--percentage));
    transform: translateX(calc(-1% * var(--percentage)));
}

/* adds transparency to tick-mark labels of disabled range inputs  */
input:disabled[type="range"] + output {
    background-color: color-mix(in srgb, var(--primary) 50%, transparent);
}
`);

/** @extends {NumberSetting} */
class SliderSetting extends NumberSetting {
    #wrapper = document.createElement('div');

    /**
     * @param {string} id
     * @param {number} defaultValue
     * @param {number} [min]
     * @param {number} [max]
     * @param {number} [step]
     * @param {number | string[]} [labels]
     */
    constructor(
        id,
        defaultValue,
        min,
        max,
        step = 1,
        labels = (max - min + 1) / step
    ) {
        super(id, defaultValue, min, max, step);

        super.formControl.type = 'range';
        super.formControl.classList.add('custom-range');
        super.formControl.classList.replace(
            'form-control',
            'form-control-range'
        );

        const datalist = document.createElement('datalist');
        if (step) {
            const steps = (max - min + 1) / step;
            datalist.id = `${super.formControl.id}-datalist`;
            super.formControl.setAttribute('list', datalist.id);
            for (
                let currentStep = min;
                currentStep <= max;
                currentStep += (max - min + 1) / steps
            ) {
                const option = document.createElement('option');
                option.value = currentStep.toString();
                datalist.append(option);
            }
        }

        const labelDatalist = document.createElement('datalist');
        const fixLabels = Array.isArray(labels);
        const labelCount =
            fixLabels ? labels.length : Math.max(2, Math.min(10, labels)); // minimum 2, maximum 10 labels
        /** @type {Map<number, string>} */
        const valueToLabel = new Map();

        for (
            let currentStep = min;
            currentStep <= max;
            currentStep += (max - min) / (labelCount - 1)
        ) {
            const option = document.createElement('option');
            option.value = currentStep.toString();
            if (fixLabels) {
                valueToLabel.set(
                    currentStep,
                    $t(
                        `settings.${this.id}.labels.${labels.shift()}`
                    ).toString()
                );
            }
            option.title = option.label =
                valueToLabel.get(currentStep) ??
                currentStep.toLocaleString(BETTER_MOODLE_LANG);
            labelDatalist.append(option);
        }
        labelDatalist.style.setProperty('--label-count', labelCount.toString());

        const outputEl = document.createElement('output');
        outputEl.htmlFor = super.formControl.id;
        const setOutput = () => {
            const val = super.inputValue;
            const percentageValue = ((val - min) / (max - min)) * 100;
            outputEl.textContent =
                valueToLabel.get(val) ?? val.toLocaleString(BETTER_MOODLE_LANG);
            // see https://css-tricks.com/value-bubbles-for-range-inputs/
            outputEl.style.setProperty(
                '--percentage',
                percentageValue.toString()
            );
        };
        super.formControl.addEventListener('input', setOutput);
        setOutput();

        this.#wrapper.classList.add('w-100', 'position-relative');
        this.#wrapper.append(
            super.formControl,
            outputEl,
            datalist,
            labelDatalist
        );
    }

    get formControl() {
        return this.#wrapper;
    }

    resetInput() {
        super.resetInput();
        super.formControl.dispatchEvent(new Event('input'));
    }
}

/**
 * @template {string} Values
 * @extends {Setting<Values>}
 */
class SelectSetting extends Setting {
    /** @type {HTMLSelectElement} */
    #input = document.createElement('select');

    /**
     * @param {string} id
     * @param {Values} defaultValue
     * @param {(Values | {key: Values, title: string})[] || Promise<(Values | {key: Values, title: string})[]>} options
     */
    constructor(id, defaultValue, options) {
        super(id, defaultValue);

        this.#input.id = this.inputId;
        this.#input.classList.add('custom-select', 'col-12', 'col-md-auto');
        this.#input.dataset.initialValue = this.value;

        const optionsPromise =
            options instanceof Promise ? options : Promise.resolve(options);
        optionsPromise.then(options =>
            options.forEach(option => {
                const opt = document.createElement('option');
                const value = typeof option === 'string' ? option : option.key;
                if (typeof option === 'string') {
                    opt.value = value;
                    opt.textContent = $t(
                        `settings.${this.id}.options.${option}`
                    ).toString();
                } else {
                    opt.value = value;
                    opt.textContent = option.title;
                }
                if (value === this.value) {
                    opt.selected = true;
                }
                this.#input.append(opt);
            })
        );
    }

    /**
     * @returns {Values}
     */
    get inputValue() {
        return this.#input.value;
    }

    /**
     * @returns {ValueType}
     */
    get value() {
        return super.value;
    }

    /**
     * @param {Values} newValue
     */
    set value(newValue) {
        this.#input.value = newValue;
        GM_setValue(this.settingKey, newValue);
    }

    /**
     * @returns {HTMLSelectElement}
     */
    get formControl() {
        return this.#input;
    }

    /**
     * @param {Record<string, Setting>} settings
     * @returns {boolean}
     */
    toggleDisabled(settings) {
        const disabled = super.toggleDisabled(settings);
        this.#input.disabled = disabled;
        if (disabled) {
            this.#input.classList.add('disabled');
        } else {
            this.#input.classList.remove('disabled');
        }
        return disabled;
    }

    saveInput() {
        this.value = this.#input.value;
    }

    resetInput() {
        this.#input.value = this.value;
    }

    /**
     * @param {function(InputEvent): void} listener
     * @returns {this}
     */
    onInput(listener) {
        this.#input.addEventListener('change', listener);
        return this;
    }
}

/** @type {Array<Setting | string>} */
const SETTINGS = [
    $t('settings.general._title'),
    new BooleanSetting('general.updateNotification', true),
    new SelectSetting('general.language', 'auto', [
        'auto',
        ...Object.keys(TRANSLATIONS),
    ]),
    new BooleanSetting('general.fullwidth', true),
    new BooleanSetting('general.externalLinks', true),
    new BooleanSetting('general.truncatedTexts', true),
    new BooleanSetting('general.bookmarkManager', false),
    new BooleanSetting('general.noDownload', false),
    new BooleanSetting('general.eventAdvertisements', true),
    new BooleanSetting('general.christmasCountdown', false),
    new BooleanSetting('general.speiseplan', false),
    new BooleanSetting('general.googlyEyes', true),
    new BooleanSetting('general.semesterzeiten', false),
    $t('settings.darkmode._title'),
    $t('settings.darkmode._description'),
    new SelectSetting('darkmode.mode', 'off', ['off', 'on', 'auto']).onInput(
        () => updateDarkReaderMode(true)
    ),
    new SliderSetting('darkmode.brightness', 100, 0, 150, 1, 7)
        .setDisabledFn(
            settings => settings['darkmode.mode'].inputValue === 'off'
        )
        .onInput(debounce(() => updateDarkReaderMode(true))),
    new SliderSetting('darkmode.contrast', 100, 0, 150, 1, 7)
        .setDisabledFn(
            settings => settings['darkmode.mode'].inputValue === 'off'
        )
        .onInput(debounce(() => updateDarkReaderMode(true))),
    new SliderSetting('darkmode.grayscale', 0, 0, 100, 1, 6)
        .setDisabledFn(
            settings => settings['darkmode.mode'].inputValue === 'off'
        )
        .onInput(debounce(() => updateDarkReaderMode(true))),
    new SliderSetting('darkmode.sepia', 0, 0, 100, 1, 6)
        .setDisabledFn(
            settings => settings['darkmode.mode'].inputValue === 'off'
        )
        .onInput(debounce(() => updateDarkReaderMode(true))),
    $t('settings.dashboard._title'),
    // {Layout anpassen}
    new StringSetting(
        'dashboard.~layoutPlaceholder',
        'Coming soon...'
    ).setDisabledFn(() => true),
    /** @type {SelectSetting<'_sync'>} */
    new SelectSetting(
        'dashboard.courseListFilter',
        '_sync',
        getCourseGroupingOptions()
    ),
    new BooleanSetting('dashboard.courseListFavouritesAtTop', true),
    $t('settings.myCourses._title'),
    new SliderSetting('myCourses.boxesPerRow', 4, 1, 10),
    new BooleanSetting('myCourses.navbarDropdown', true),
    new SelectSetting(
        'myCourses.navbarDropdownFilter',
        '_sync',
        getCourseGroupingOptions()
    ).setDisabledFn(
        settings => !settings['myCourses.navbarDropdown'].inputValue
    ),
    new BooleanSetting(
        'myCourses.navbarDropdownFavouritesAtTop',
        true
    ).setDisabledFn(
        settings => !settings['myCourses.navbarDropdown'].inputValue
    ),
    $t('settings.courses._title'),
    new BooleanSetting('courses.grades', true),
    new BooleanSetting('courses.gradesNewTab', false).setDisabledFn(
        settings => !settings['courses.grades'].inputValue
    ),
    new BooleanSetting('courses.collapseAll', true),
    new BooleanSetting('courses.imgMaxWidth', true),
    new BooleanSetting('courses.imageZoom', true),
    new BooleanSetting('courses.hideSelfEnrolHint', false),
    $t('settings.clock._title'),
    new BooleanSetting('clock.fuzzyClock', false),
    new SliderSetting('clock.fuzzyClock.fuzziness', 10, 10, 50, 10, [
        '5min',
        '15min',
        'food',
        'day',
        'week',
    ]).setDisabledFn(settings => !settings['clock.fuzzyClock'].inputValue),
    $t('settings.weatherDisplay._title'),
    $t('settings.weatherDisplay._description'),
    new BooleanSetting('weatherDisplay.show', false),
    new SelectSetting('weatherDisplay.units', 'metric', [
        'metric',
        'scientific',
        'imperial',
    ]),
    new SelectSetting('weatherDisplay.provider', 'openMeteo', [
        'openMeteo',
        'wttrIn',
        'visualCrossing',
        'openWeatherMap',
        'pirateWeather',
    ]),
    new StringSetting('weatherDisplay.visualCrossingAPIKey', '').setDisabledFn(
        settings =>
            settings['weatherDisplay.provider'].inputValue !== 'visualCrossing'
    ),
    new StringSetting('weatherDisplay.openWeatherMapAPIKey', '').setDisabledFn(
        settings =>
            settings['weatherDisplay.provider'].inputValue !== 'openWeatherMap'
    ),
    new StringSetting('weatherDisplay.pirateWeatherAPIKey', '').setDisabledFn(
        settings =>
            settings['weatherDisplay.provider'].inputValue !== 'pirateWeather'
    ),
    new BooleanSetting('weatherDisplay.showTempInNavbar', false),
    new BooleanSetting('weatherDisplay.toggleFeelsLike', false),
    $t('settings.messages._title'),
    new SelectSetting('messages.sendHotkey', '', [
        '',
        'shiftEnter',
        'ctrlEnter',
    ]),
];
const settingsById = Object.fromEntries(
    SETTINGS.filter(s => typeof s !== 'string').map(s => [s.id, s])
);
// endregion

// region Feature: general.fullwidth
// use full width if enabled
if (getSetting('general.fullwidth')) {
    GM_addStyle(`
/* Use full width */
#topofscroll, .header-maxwidth {
    max-width: unset !important;
}
    `);
}
// endregion

// region Feature: general.externalLinks
// add target="_blank" to all external links
if (getSetting('general.externalLinks')) {
    document.addEventListener('click', e => {
        const target = e.target;
        if (!(target instanceof HTMLAnchorElement) || target.target) return;
        const { origin, protocol } = new URL(target.href, window.location);
        if (protocol === 'javascript:') return;
        if (origin && origin !== window.location.origin) {
            target.target = '_blank';
        }
    });
}
// endregion

// region Feature: general.truncatedTexts
// add a title attribute to texts that are too long
// that is especially useful for the course content sidebar
if (getSetting('general.truncatedTexts')) {
    document.addEventListener('mouseover', e => {
        const target = e.target;
        if (
            !(target instanceof HTMLElement) &&
            !(target instanceof SVGElement)
        ) {
            return;
        }
        if (target.title || !target.classList.contains('text-truncate')) return;
        target.title = target.textContent.trim();
    });
}
// endregion

// region Feature: general.bookmarkManager
if (getSetting('general.bookmarkManager')) {
    ready(() => {
        const BOOKMARKS_STORAGE = PREFIX('bookmarks');

        const bookmarkBtnWrapper = document.createElement('div');
        bookmarkBtnWrapper.id = PREFIX('bookmarks-dropdown');
        bookmarkBtnWrapper.classList.add('dropdown');
        const bookmarksBtn = document.createElement('a');
        bookmarksBtn.classList.add(
            'nav-link',
            'position-relative',
            'icon-no-margin'
        );
        bookmarksBtn.href = '#';
        bookmarksBtn.role = 'button';
        bookmarksBtn.dataset.toggle = 'dropdown';
        const bookmarksIcon = document.createElement('i');
        bookmarksIcon.classList.add('icon', 'fa', 'fa-bookmark-o', 'fa-fw');
        bookmarksIcon.title = bookmarksBtn.ariaLabel =
            $t('bookmarks.title').toString();
        bookmarksIcon.role = 'img';
        bookmarksBtn.append(bookmarksIcon);

        const dropdown = document.createElement('div');
        dropdown.classList.add('dropdown-menu', 'dropdown-menu-right');

        const bookmarksWrapper = document.createElement('div');
        bookmarksWrapper.id = PREFIX('bookmarks-dropdown-bookmarks');

        const setBookmarksList = bookmarks => {
            bookmarksWrapper.innerHTML = '';
            bookmarksIcon.classList.remove('fa-bookmark', 'fa-bookmark-o');
            bookmarks.forEach(({ title, url }) => {
                const httpsUrl =
                    url.startsWith('https://') ? url : `https://${url}`;
                const bookmark = document.createElement('a');
                bookmark.classList.add('dropdown-item', 'text-truncate');
                bookmark.href = httpsUrl;
                bookmark.textContent = bookmark.title = title;
                bookmarksWrapper.append(bookmark);

                try {
                    const bookmarkWithoutHash = new URL(httpsUrl);
                    bookmarkWithoutHash.hash = '';
                    const currentPage = new URL(window.location.href);
                    currentPage.hash = '';

                    if (currentPage.href.includes(bookmarkWithoutHash.href)) {
                        bookmarksIcon.classList.add('fa-bookmark');
                    }
                } catch {
                    // ignore invalid URLs
                }
            });
            if (!bookmarksIcon.classList.contains('fa-bookmark')) {
                bookmarksIcon.classList.add('fa-bookmark-o');
            }
        };

        setBookmarksList(GM_getValue(BOOKMARKS_STORAGE, []));

        GM_addValueChangeListener(BOOKMARKS_STORAGE, (_, __, bookmarks) =>
            setBookmarksList(bookmarks)
        );

        const divider = document.createElement('div');
        divider.classList.add('dropdown-divider');

        const addBookmarkBtn = document.createElement('a');
        addBookmarkBtn.classList.add('dropdown-item');
        addBookmarkBtn.href = '#';
        addBookmarkBtn.textContent = $t('bookmarks.add').toString();
        addBookmarkBtn.addEventListener('click', e => {
            e.preventDefault();

            const form = document.createElement('form');
            form.classList.add('mform');
            const container = document.createElement('div');
            container.classList.add('fcontainer');

            const addFormItem = (title, addon = '') => {
                const group = document.createElement('div');
                group.classList.add('form-group', 'row', 'fitem');
                const labelWrapper = document.createElement('div');
                labelWrapper.classList.add(
                    'col-md-3',
                    'col-form-label',
                    'd-flex',
                    'pb-0',
                    'pt-0'
                );
                const label = document.createElement('label');
                label.classList.add('d-inline', 'word-break');
                label.textContent = title;
                labelWrapper.append(label);

                const inputWrapper = document.createElement('div');
                inputWrapper.classList.add(
                    'col-md-9',
                    'form-inline',
                    'align-items-start',
                    'felement'
                );
                const input = document.createElement('input');
                input.classList.add('form-control', 'flex-grow-1');
                input.type = 'text';
                input.required = true;
                input.placeholder = title;
                input.id = PREFIX(`bookmark-new-${crypto.randomUUID()}`);
                label.setAttribute('for', input.id);

                if (addon) {
                    inputWrapper.classList.add('input-group');

                    const addonDiv = document.createElement('div');
                    addonDiv.classList.add('input-group-prepend');
                    const addonText = document.createElement('span');
                    addonText.classList.add('input-group-text');
                    addonText.textContent = addon;
                    addonDiv.append(addonText);
                    inputWrapper.append(addonDiv, input);
                } else {
                    inputWrapper.append(input);
                }

                group.append(labelWrapper, inputWrapper);

                container.append(group);
                form.append(container);

                return input;
            };

            const titleInput = addFormItem($t('bookmarks.name'));
            titleInput.value = document.title.replace(/\|.*?$/, '').trim();
            const urlInput = addFormItem($t('bookmarks.url'), 'https://');
            urlInput.type = 'url';
            urlInput.value = window.location.href.replace(/^https:\/\//, '');

            require(['core/modal_factory', 'core/modal_events'], (
                { create, types },
                ModalEvents
            ) =>
                create({
                    type: types.SAVE_CANCEL,
                    large: true,
                    scrollable: true,
                    title: $t('bookmarks.add').toString(),
                    body: form,
                    removeOnClose: true,
                }).then(modal => {
                    modal.show();

                    modal.getRoot().on(ModalEvents.save, () => {
                        const bookmarks = GM_getValue(BOOKMARKS_STORAGE, []);
                        bookmarks.push({
                            title: titleInput.value,
                            url: urlInput.value,
                        });
                        GM_setValue(BOOKMARKS_STORAGE, bookmarks);
                    });
                }));
        });

        let manageFormStyleAdded = false;

        const manageBookmarksBtn = document.createElement('a');
        manageBookmarksBtn.classList.add('dropdown-item');
        manageBookmarksBtn.href = '#';
        manageBookmarksBtn.textContent = $t('bookmarks.manage').toString();
        manageBookmarksBtn.addEventListener('click', e => {
            e.preventDefault();

            const createFormItem = ({ title, url }) => {
                const titleWrapper = document.createElement('div');
                titleWrapper.classList.add(
                    'form-inline',
                    'align-items-start',
                    'felement'
                );
                const titleInput = document.createElement('input');
                titleInput.classList.add('form-control', 'w-100');
                titleInput.type = 'text';
                titleInput.required = true;
                titleInput.value = title;
                titleInput.dataset.attribute = 'title';
                titleInput.placeholder = $t('bookmarks.name').toString();
                titleWrapper.append(titleInput);

                const urlWrapper = document.createElement('div');
                urlWrapper.classList.add(
                    'form-inline',
                    'align-items-start',
                    'felement',
                    'input-group'
                );
                urlWrapper.style.setProperty(
                    'flex-basis',
                    'calc(8 * (100% / 12) - 1em)'
                );
                const httpsAddon = document.createElement('div');
                httpsAddon.classList.add('input-group-prepend');
                const httpsAddonText = document.createElement('span');
                httpsAddonText.classList.add('input-group-text');
                httpsAddonText.textContent = 'https://';
                httpsAddon.append(httpsAddonText);

                const urlInput = document.createElement('input');
                urlInput.classList.add('form-control', 'flex-grow-1');
                urlInput.type = 'url';
                urlInput.required = true;
                urlInput.value = url;
                urlInput.dataset.attribute = 'url';
                urlInput.placeholder = $t('bookmarks.url').toString();

                urlWrapper.append(httpsAddon, urlInput);

                return [titleWrapper, urlWrapper];
            };

            const { form, addFormItems } = createAppendableListForm(
                'bookmark-manager-form',
                createFormItem,
                { title: '', url: '' }
            );

            if (!manageFormStyleAdded) {
                GM_addStyle(`
#${form.id} .felement:first-child {
    flex-basis: calc(4 * (100% / 12) - 1em);
    flex-grow: 1;
}
#${form.id} .felement:nth-child(2) {
    flex-basis: calc(8 * (100% / 12) - 1em);
    flex-grow: 1;
}
`);
                manageFormStyleAdded = true;
            }

            addFormItems(GM_getValue(BOOKMARKS_STORAGE, []));

            require(['core/modal_factory', 'core/modal_events'], (
                { create, types },
                ModalEvents
            ) =>
                create({
                    type: types.SAVE_CANCEL,
                    large: true,
                    scrollable: true,
                    title: $t('bookmarks.manage').toString(),
                    body: form,
                    removeOnClose: true,
                }).then(modal => {
                    modal.show();

                    modal.getRoot().on(ModalEvents.save, () => {
                        const bookmarks = [];
                        form.querySelectorAll('.fitem').forEach(row => {
                            const title = row
                                .querySelector('input[data-attribute="title"]')
                                ?.value.trim();
                            const url = row
                                .querySelector('input[data-attribute="url"]')
                                ?.value.trim()
                                .replace(/^https:\/\//, '');

                            if (!title || !url) return;

                            bookmarks.push({
                                title,
                                url,
                            });
                        });
                        GM_setValue(BOOKMARKS_STORAGE, bookmarks);
                    });
                }));
        });

        dropdown.append(
            bookmarksWrapper,
            divider,
            addBookmarkBtn,
            manageBookmarksBtn
        );
        bookmarkBtnWrapper.append(bookmarksBtn, dropdown);
        document
            .querySelector('#usernavigation .usermenu-container')
            ?.before(bookmarkBtnWrapper);

        GM_addStyle(`
/* bookmarks dropdown should not be greater than 400px */
#${bookmarkBtnWrapper.id} .dropdown-menu {
    max-width: 400px;
}

/* this will allow the bookmarks dropdown menu to be aligned to right viewport side and fullwidth on mobile devices */
@media (max-width: 576px) {
    #${bookmarkBtnWrapper.id} {
        position: inherit;   
    }
    #${bookmarkBtnWrapper.id} .dropdown-menu {
        max-width: 100%;
    }
    #${bookmarkBtnWrapper.id} .dropdown-menu .dropdown-item {
        overflow: auto;
    }
}

/* show a placeholder text when there are no bookmarks */
#${bookmarksWrapper.id}:empty::before {
    display: block;
    text-align: center;
    content: ${JSON.stringify($t('bookmarks.empty'))};
    padding: .25rem 1.5rem; /* this is the padding of .dropdown-item set by moodle */
}
`);
    });
}
// endregion

// region Feature: general.noDownload
if (getSetting('general.noDownload')) {
    document.addEventListener('mousedown', e => {
        const target = e.target;
        if (!(target instanceof HTMLAnchorElement)) return;
        try {
            const url = new URL(target.href, window.location);
            if (url.searchParams.has('forcedownload')) {
                url.searchParams.delete('forcedownload');
                target.href = url.href;
            }
        } catch {
            // if href is not a valid URL just ignore it
        }
    });
}
// endregion

// region Feature: general.christmasCountdown
// add the Christmas countdown
if (getSetting('general.christmasCountdown')) {
    const getDayOfYear = date => {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff =
            date -
            start +
            (start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    };

    const now = new Date();
    const thisYearChristmas = new Date(now.getFullYear(), 11, 24); // 24.12. of this year
    const firstChristmasDay = new Date(thisYearChristmas);
    firstChristmasDay.setDate(thisYearChristmas.getDate() + 1);
    const thisYearLastDay = new Date(now.getFullYear(), 11, 31); // 31.12. of this year
    const nextYearChristmas = new Date(thisYearChristmas);
    nextYearChristmas.setFullYear(now.getFullYear() + 1);

    const textSpan = document.createElement('span');

    const [[, textSpanClone]] = addMarqueeItems(textSpan);

    const updateCountdown = () => {
        const todayDayOfYear = getDayOfYear(now);
        const daysToChristmas =
            now < firstChristmasDay ?
                getDayOfYear(thisYearChristmas) - todayDayOfYear
            :   getDayOfYear(thisYearLastDay) -
                todayDayOfYear +
                getDayOfYear(nextYearChristmas);

        textSpan.innerHTML = textSpanClone.innerHTML =
            daysToChristmas ?
                $t(
                    `christmasCountdown.countdown.${Number(
                        !!(daysToChristmas - 1)
                    )}`,
                    {
                        days: daysToChristmas,
                    }
                ).toString()
            :   $t('christmasCountdown.christmas').toString();

        const nextUpdate = new Date();
        nextUpdate.setDate(now.getDate() + 1);
        nextUpdate.setHours(0, 0, 0, 0);
        setTimeout(updateCountdown, nextUpdate - now);
    };

    updateCountdown();
}
// endregion

// region Feature: general.speiseplan
if (getSetting('general.speiseplan')) {
    const foodEmojis = [
        '🍔',
        '🍟',
        '🍕',
        '🌭',
        '🥪',
        '🌮',
        '🌯',
        '🫔',
        '🥙',
        '🧆',
        '🥚',
        '🍳',
        '🥘',
        '🍲',
        '🥣',
        '🥗',
        '🍝',
        '🍱',
        '🍘',
        '🍙',
        '🍚',
        '🍛',
        '🍜',
        '🍢',
        '🍣',
        '🍤',
        '🍥',
        '🥮',
        '🥟',
        '🥠',
        '🥡',
    ];

    const desktopBtn = document.createElement('li');
    desktopBtn.classList.add('nav-item');
    const desktopLink = document.createElement('a');
    desktopLink.classList.add('nav-link');
    desktopLink.href = '#';
    desktopLink.textContent =
        foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
    desktopBtn.title = $t('speiseplan.title').toString();
    desktopBtn.append(desktopLink);

    const mobileBtn = document.createElement('a');
    mobileBtn.classList.add('list-group-item', 'list-group-item-action');
    mobileBtn.href = '#';
    mobileBtn.textContent = `${
        foodEmojis[Math.floor(Math.random() * foodEmojis.length)]
    }\xa0${$t('speiseplan.title').toString()}`;

    const tableClass = PREFIX('speiseplan-table');
    const speiseClass = PREFIX('speiseplan-speise');
    const artenClass = PREFIX('speiseplan-arten');
    const preiseClass = PREFIX('speiseplan-preise');
    const abkClass = PREFIX('speiseplan-abk');

    GM_addStyle(`
.${tableClass} .${speiseClass}[data-location]::before {
    content: attr(data-location);
    color: #e8e6e3;
    background-color: #586e3b;
    font-weight: bold;
    font-size: smaller;
    padding: 4px;
    border-radius: 6px;
    margin-right: .5em;
}

.${tableClass} .${speiseClass}[data-location="Cafeteria"]::before {
    background-color: #4b6669;
}

.${tableClass} .${speiseClass} .${abkClass} {
    font-size: smaller;
}

.${tableClass} .${speiseClass} .${abkClass}::before {
    margin-left: 1em;
    content: "(";
}

.${tableClass} .${speiseClass} .${abkClass} > span:not(:last-child)::after {
    content: "; ";
}

.${tableClass} .${speiseClass} .${abkClass}::after {
    content: ")";
}

.${tableClass} .${artenClass} {
    text-align: center;
}

.${tableClass} .${artenClass} img {
    max-width: 40px;
    max-height: 40px;
}

.${tableClass} .${preiseClass} > span:not(:last-child)::after {
    content: "\xa0/\xa0";
}

/* improve arten images in dark mode */
${DARK_MODE_SELECTOR} .${artenClass} img {
  --stroke-pos: 0.5px;
  --stroke-neg: -0.5px;
  --stroke-color: color-mix(in srgb, currentColor 20%, transparent);
  filter: drop-shadow(var(--stroke-pos) 0 0 var(--stroke-color)) drop-shadow(var(--stroke-neg) 0 var(--stroke-color)) drop-shadow(0 var(--stroke-neg) 0 var(--stroke-color)) drop-shadow(var(--stroke-pos) var(--stroke-pos) 0 var(--stroke-color)) drop-shadow(var(--stroke-pos) var(--stroke-neg) 0 var(--stroke-color)) drop-shadow(var(--stroke-neg) var(--stroke-pos) 0 var(--stroke-color)) drop-shadow(var(--stroke-neg) var(--stroke-neg) 0 var(--stroke-color));
}
${DARK_MODE_SELECTOR} .${artenClass} img[src*="sh_teller"] {
  filter: brightness(1.5);
}
${DARK_MODE_SELECTOR} .${artenClass} img[src*="iconprop_bio"] {
  filter: brightness(0.9);
}
`);

    const createDayFieldset = (day, speisen, filter, firstFieldset) => {
        const date = new Date(day);
        const { fieldset, container, collapseBtn } = createFieldset(
            dateToString(date, false, true),
            `speiseplan-collapseElement-${day}`,
            `speiseplan-containerElement-${day}`
        );

        // do not collapse today
        if (firstFieldset) {
            collapseBtn.classList.remove('collapsed');
            container.classList.add('show');
        }

        // add the speiseplan information for the day in there
        const table = document.createElement('table');
        table.classList.add('table', 'generaltable', tableClass);
        const tableHead = table.createTHead();
        const tableHeadRow = tableHead.insertRow();
        ['speise', 'type', 'price'].forEach(head => {
            const headCell = document.createElement('th');
            headCell.textContent = $t(`speiseplan.table.${head}`).toString();
            tableHeadRow.append(headCell);
        });
        const tbody = table.createTBody();
        speisen.forEach(speise => {
            const row = tbody.insertRow();

            const speiseCell = row.insertCell();
            speiseCell.classList.add(speiseClass);
            speiseCell.dataset.location = speise.mensa ? 'Mensa' : 'Cafeteria';
            speise.items.forEach(({ name, zusatz }) => {
                const speiseEl = document.createElement('span');
                speiseEl.textContent = name;
                if (zusatz) {
                    const zusatzEl = document.createElement('span');
                    zusatzEl.textContent = zusatz;
                    zusatzEl.classList.add('text-muted');
                    speiseEl.append('\xa0', zusatzEl);
                }
                speiseCell.append(speiseEl, document.createElement('br'));
            });

            const allergene = document.createElement('div');
            allergene.classList.add(abkClass, 'text-muted');
            speise.allergene.forEach(allergen => {
                const allergenFilter = filter.allergene[allergen];
                const allergenSpan = document.createElement('span');
                allergenSpan.textContent +=
                    allergenFilter ?
                        `${allergenFilter.abk}:\xa0${allergenFilter.title}`
                    :   allergen;
                allergene.append(allergenSpan);
            });
            if (speise.allergene.length) speiseCell.append(allergene);
            const zusatzstoffe = document.createElement('div');
            zusatzstoffe.classList.add(abkClass, 'text-muted');
            speise.zusatzstoffe.forEach(zusatzstoff => {
                const zusatzstoffFilter = filter.zusatzstoffe[zusatzstoff];
                const zusatzstoffSpan = document.createElement('span');
                zusatzstoffSpan.textContent +=
                    zusatzstoffFilter ?
                        `${zusatzstoffFilter.abk}:\xa0${zusatzstoffFilter.title}`
                    :   zusatzstoff;
                zusatzstoffe.append(zusatzstoffSpan);
            });
            if (speise.zusatzstoffe.length) speiseCell.append(zusatzstoffe);

            const artenCell = row.insertCell();
            artenCell.classList.add(artenClass);
            speise.arten.forEach(art => {
                const artFilter = filter.arten[art];
                if (!artFilter) {
                    return artenCell.append(art, document.createElement('br'));
                }
                const img = document.createElement('img');
                img.src = artFilter.img;
                img.alt = img.title = artFilter.title;
                artenCell.append(img);
            });

            const preiseCell = row.insertCell();
            preiseCell.classList.add(preiseClass);
            speise.preise.forEach(preis => {
                const preisEl = document.createElement('span');
                preisEl.textContent = preis.toLocaleString(BETTER_MOODLE_LANG, {
                    style: 'currency',
                    currency: 'EUR',
                });
                preiseCell.append(preisEl);
            });
        });
        container.append(table);

        return fieldset;
    };

    const openSpeiseplan = e => {
        e.preventDefault();

        require(['core/modal_factory'], ({ create, types }) =>
            create({
                type: types.ALERT,
                large: true,
                scrollable: true,
                title: `${
                    foodEmojis[Math.floor(Math.random() * foodEmojis.length)]
                }\xa0${$t('speiseplan.title').toString()}`,
                body: getSpeiseplan().then(({ speisen, filters }) =>
                    Object.entries(speisen)
                        .filter(
                            ([day]) =>
                                new Date(day) > Date.now() - 24 * 60 * 60 * 1000
                        )
                        .map(([day, speisen], index) =>
                            createDayFieldset(day, speisen, filters, !index)
                        )
                ),
            }).then(modal => {
                modal.setButtonText(
                    'cancel',
                    `🍴\xa0${$t('speiseplan.close')}`
                );
                modal.getBody()[0].classList.add('mform');

                const studiwerkLink = document.createElement('a');
                studiwerkLink.href = `https://studentenwerk.sh/${BETTER_MOODLE_LANG}/${
                    { de: 'mensen-in-luebeck', en: 'food-overview' }[
                        BETTER_MOODLE_LANG
                    ]
                }?ort=3&mensa=8`;
                studiwerkLink.textContent = $t('speiseplan.toStudiwerkPage');
                studiwerkLink.target = '_blank';
                studiwerkLink.classList.add('mr-auto');
                modal.getFooter().prepend(studiwerkLink);

                modal.show();
            }));
    };

    desktopLink.addEventListener('click', openSpeiseplan);
    mobileBtn.addEventListener('click', openSpeiseplan);

    ready(() => {
        document.querySelector('.dropdownmoremenu')?.before(desktopBtn);
        document
            .querySelector('#theme_boost-drawers-primary .list-group')
            ?.append(mobileBtn);
    });
}
// endregion

// region Feature: general.googlyEyes
if (
    getSetting('general.googlyEyes') &&
    window.matchMedia('(hover: hover)').matches
) {
    GM_addStyle(`
/* This is the fancy style for googly Eyes 👀 */
.eyes {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  --eye-width: 40%;
  --eye-border-width: 2px;
  --eye-height: 65%;
  --pupil-width: max(1%, 4px);
  --pupil-height: var(--pupil-width);
}

.eye {
  position: relative;
  background-color: white;
  border: var(--eye-border-width) solid black;
  border-radius: 43%;
  display: flex;
  width: var(--eye-width);
  height: var(--eye-height);
  min-width: var(--eye-width);
  min-height: var(--eye-height);
  max-width: var(--eye-width);
  max-height: var(--eye-height);
  align-items: center;
  justify-content: center;
}
.eye:not(:last-child) {
  margin-right: calc(10% / 2);
}

.pupil {
  background-color: black;
  border: calc(var(--pupil-width) / 2) solid black;
  border-radius: 50%;
  display: block;
  width: var(--pupil-width);
  height: var(--pupil-height);
  min-width: var(--pupil-width);
  min-height: var(--pupil-height);
  max-width: var(--pupil-width);
  max-height: var(--pupil-height);
}

/* Hey, don't look while I enter a password! Wait, are you peeking? 😨 */
.eye::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0;
  transition: opacity 0.5s linear;
  background: linear-gradient(0deg, rgb(0, 0, 0) 0%, rgb(0, 0, 0) 35%, rgb(255, 255, 255) 49%, rgb(255, 255, 255) 51%, rgb(0, 0, 0) 65%, rgb(0, 0, 0) 100%);
}
body:has(input[type="password"]:focus) .eye::before {
  opacity: 1;
}
`);

    const eyes = document.createElement('div');
    eyes.classList.add('eyes');
    for (let i = 0; i < 2; i++) {
        const eye = document.createElement('span');
        eye.classList.add('eye');
        const pupil = document.createElement('span');
        pupil.classList.add('pupil');
        eye.append(pupil);
        eyes.append(eye);
    }

    const pupils = Array.from(eyes.querySelectorAll('.pupil'));
    const pupilPositions = pupils.map(pupil => pupil.getBoundingClientRect());

    let positionTimeout;

    document.addEventListener('mousemove', e => {
        const { clientX: mouseLeft, clientY: mouseTop } = e;
        pupils.forEach((pupil, index) => {
            const { top, left } = pupilPositions[index];
            const translateX =
                mouseLeft < left ?
                    mouseLeft / left - 1
                :   (mouseLeft - left) / (innerWidth - left);
            const translateY =
                mouseTop < top ?
                    mouseTop / top - 1
                :   (mouseTop - top) / (innerHeight - top);
            const ease = x =>
                x < 0 ? -1 * ease(-1 * x) : 100 - Math.pow(1 - x, 2) * 100;
            pupil.style.setProperty(
                'transform',
                `translateX(${ease(translateX)}%) translateY(${ease(translateY)}%)`
            );
        });

        if (positionTimeout) clearTimeout(positionTimeout);
        positionTimeout = setTimeout(
            () =>
                pupilPositions.splice(
                    0,
                    pupils.length,
                    ...pupils.map(pupil => pupil.getBoundingClientRect())
                ),
            100
        );
    });

    ready(() =>
        document
            .querySelector('.btn-footer-popover .fa-question')
            ?.replaceWith(eyes)
    );
}
// endregion

// region Feature: general.semesterzeiten
if (isDashboard && getSetting('general.semesterzeiten')) {
    const now = new Date();

    const skipProgress = document.createElement('a');
    skipProgress.classList.add('sr-only', 'sr-only-focusable');
    skipProgress.textContent = $t('semesterzeiten.skip').toString();
    const afterSpan = document.createElement('span');
    afterSpan.id = PREFIX('general-semesterzeiten-after');
    skipProgress.href = `#${afterSpan.id}`;

    const progressSection = document.createElement('section');
    progressSection.classList.add('block', 'card', 'mb-3');
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body', 'p-3');
    const cardContent = document.createElement('div');
    cardContent.classList.add('card-text', 'content');

    cardBody.append(cardContent);
    progressSection.append(cardBody);

    const shownBars = new Set(['semester']);
    const barTypeStyle = document.createElement('style');
    const updateBarTypeStyle = () =>
        (barTypeStyle.textContent =
            shownBars.size === 0 ?
                ''
            :   `
[data-storage] {
    display: none;
}

${Array.from(shownBars)
    .map(bar => `[data-storage="${bar}"]`)
    .join(',')} {
    display: flex;
}
`);

    const nowAdditionsClass = PREFIX('semesterzeiten-now-additions');
    GM_addStyle(`
.${nowAdditionsClass}.progress-bar {
    position: absolute;
    height: 1rem;
    pointer-events: none;
    background-image: linear-gradient(45deg,rgba(255,255,255,.3) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.3) 50%,rgba(255,255,255,.3) 75%,transparent 75%,transparent);
    border-right: 1px solid black;
}
${DARK_MODE_SELECTOR} .${nowAdditionsClass}.progress-bar {
    border-color: white;
}

span.${nowAdditionsClass} {
    position: absolute;
    transform: translateX(-50%) translateY(-100%);
    font-size: .703125rem;
}
`);

    ready(() =>
        document
            .querySelector('#block-region-content')
            ?.prepend(skipProgress, progressSection, afterSpan, barTypeStyle)
    );

    /**
     * @typedef {Object} Semester
     * @property {string} name
     * @property {string} start
     * @property {string} end
     * @property {AdditionalSemesterzeit[]} additional
     */

    /**
     * @typedef {Object} AdditionalSemesterzeit
     * @property {string} name:de
     * @property {string} name:en
     * @property {string} storage
     * @property {'success'|'info'|'warning'|'danger'} color
     * @property {string} start
     * @property {string} end
     */

    // helping function to get typing
    /**
     * @return {Promise<{ recurringHolidays: string[], semesters: Semester[] }>}
     */
    const getSemesterzeiten = () =>
        // fetch('http://localhost:3000/data/semesterzeiten.json') // this is for testing locally (npx serve --cors)
        fetch(rawGithubPath('data/semesterzeiten.json')).then(res =>
            res.json()
        );

    /** @type {Map<string, Set<HTMLInputElement>>} */
    const toggles = new Map();

    /**
     * @param storage
     * @return {HTMLDivElement}
     */
    const getToggle = storage => {
        const key = `semesterzeiten.show.${storage}`;
        const storageKey = PREFIX(key);
        const storedState = GM_getValue(storageKey, false);
        const storageToggle = new BooleanSetting(
            `${storageKey}-${crypto.randomUUID()}`,
            storedState
        );

        if (!toggles.has(storage)) toggles.set(storage, new Set());
        toggles
            .get(storage)
            .add(storageToggle.formControl.querySelector('input'));

        storageToggle.onInput(() => {
            GM_setValue(storageKey, storageToggle.inputValue);
            if (storageToggle.inputValue) {
                shownBars.add(storage);
            } else {
                shownBars.delete(storage);
            }
            toggles
                .get(storage)
                .forEach(toggle => (toggle.checked = storageToggle.inputValue));
            updateBarTypeStyle();
        });
        if (storedState) shownBars.add(storage);

        return storageToggle.formControl;
    };

    /**
     * @param {HTMLTableSectionElement} tbody
     * @param {string} name
     * @param {Date} start
     * @param {Date} end
     * @param {string} color
     * @param {string} [storage='']
     */
    const addRow = (tbody, name, start, end, color, storage = '') => {
        const row = tbody.insertRow();
        row.classList.add(`table-${color}`);

        const finishedBy =
            now < start ? 0
            : now > end ? 1
            : (now - start) / (end - start);

        [
            name,
            dateToString(start),
            dateToString(end),
            finishedBy.toLocaleString(BETTER_MOODLE_LANG, {
                style: 'percent',
                maximumFractionDigits: 2,
            }),
        ].forEach(content => (row.insertCell().textContent = content));

        const lastCell = row.insertCell();
        if (storage) lastCell.append(getToggle(storage));
        else {
            row.classList.add('font-weight-bold');
            lastCell.classList.add('p-0', 'px-md-3', 'align-middle');

            const paging = document.createElement('nav');
            const pagingUl = document.createElement('ul');
            pagingUl.classList.add(
                'pagination',
                'mb-0',
                'flex-nowrap',
                'justify-content-center',
                'justify-content-md-end'
            );

            const prevBtn = document.createElement('li');
            prevBtn.classList.add('page-item');
            const prevLink = document.createElement('a');
            prevLink.classList.add('page-link');
            prevLink.href = '#';
            const prevSpan = document.createElement('span');
            prevSpan.classList.add('icon-no-margin');
            const prevIcon = document.createElement('i');
            prevIcon.classList.add('icon', 'fa', 'fa-chevron-left', 'fa-fw');
            prevSpan.append(prevIcon);
            prevLink.append(prevSpan);
            prevBtn.append(prevLink);
            prevLink.addEventListener('click', e => {
                e.preventDefault();

                const semesterDiv = tbody.closest('.card-text.content > div');
                semesterDiv?.classList.add('hidden');
                semesterDiv?.previousElementSibling?.classList.remove('hidden');
            });

            const nextBtn = document.createElement('li');
            nextBtn.classList.add('page-item');
            const nextLink = document.createElement('a');
            nextLink.classList.add('page-link');
            nextLink.href = '#';
            const nextSpan = document.createElement('span');
            nextSpan.classList.add('icon-no-margin');
            const nextIcon = document.createElement('i');
            nextIcon.classList.add('icon', 'fa', 'fa-chevron-right', 'fa-fw');
            nextSpan.append(nextIcon);
            nextLink.append(nextSpan);
            nextBtn.append(nextLink);
            nextLink.addEventListener('click', e => {
                e.preventDefault();

                const semesterDiv = tbody.closest('.card-text.content > div');
                semesterDiv?.classList.add('hidden');
                semesterDiv?.nextElementSibling?.classList.remove('hidden');
            });

            pagingUl.append(prevBtn, nextBtn);
            paging.append(pagingUl);
            lastCell.append(paging);
        }
    };

    /**
     * @param {Semester} semester
     * @param {string[]} holidays
     */
    const createSemester = (semester, holidays) => {
        const semesterStart = new Date(semester.start);
        const semesterEnd = new Date(
            new Date(semester.end).getTime() + 1000 * 60 * 60 * 24 - 1
        );
        const semesterDuration =
            semesterEnd.getTime() - semesterStart.getTime();
        const isCurrentSemester = now > semesterStart && now < semesterEnd;

        const semesterDiv = document.createElement('div');
        semesterDiv.classList.add('hidden');

        const topBar = document.createElement('div');
        topBar.classList.add('d-flex', 'align-items-center');

        const progressWrapper = document.createElement('div');
        progressWrapper.classList.add('progress', 'w-100', 'position-relative');
        progressWrapper.id = PREFIX('general-semesterzeiten-progress');

        const infoLink = document.createElement('a');
        infoLink.classList.add('mr-2');
        infoLink.href = '#';
        const infoIcon = document.createElement('i');
        infoIcon.classList.add('icon', 'fa', 'fa-info-circle', 'fa-fw', 'mr-0');
        infoLink.append(infoIcon);
        infoLink.addEventListener('click', e => {
            e.preventDefault();
            cardContent
                .querySelectorAll('table')
                .forEach(table => table.classList.toggle('hidden'));
        });

        const additionalTable = document.createElement('table');
        additionalTable.classList.add(
            'table',
            'table-striped',
            'table-hover',
            'hidden'
        );
        const tableHead = additionalTable.createTHead();
        const tableHeadRow = tableHead.insertRow();
        ['name', 'start', 'end', 'finished', 'show'].forEach(head => {
            const headCell = document.createElement('th');
            headCell.textContent = $t(
                `semesterzeiten.table.${head}`
            ).toString();
            tableHeadRow.append(headCell);
        });
        const tbody = additionalTable.createTBody();

        /** @type {Map<Date, {start: number[], end: number[]}>} */
        const progressStops = new Map();

        if (isCurrentSemester) {
            progressStops.set(now, { start: [], end: [] });
        }

        const bars = [];
        /**
         * @param {Date} start
         * @param {Date} end
         * @param {string} color
         * @param {string} name
         * @param {string} storage
         */
        const addBar = (start, end, color, name, storage) => {
            addStart(start, bars.length);
            // add almost one day here to mark the end of the day
            addEnd(
                new Date(end.getTime() + 1000 * 60 * 60 * 24 - 1),
                bars.length
            );
            bars.push({
                color,
                name,
                dateString:
                    start === end ?
                        dateToString(start, true, true)
                    :   `${dateToString(start)} - ${dateToString(end)}`,
                storage,
            });
        };
        /**
         * @param {Date} date
         * @param {number} barId
         */
        const addStart = (date, barId) => {
            const normalizedDate = date < semesterStart ? semesterStart : date;
            if (progressStops.has(normalizedDate)) {
                progressStops.get(normalizedDate).start.push(barId);
            } else {
                progressStops.set(normalizedDate, { start: [barId], end: [] });
            }
        };
        /**
         * @param {Date} date
         * @param {number} barId
         */
        const addEnd = (date, barId) => {
            const normalizedDate = date > semesterEnd ? semesterEnd : date;
            if (progressStops.has(normalizedDate)) {
                progressStops.get(normalizedDate).end.push(barId);
            } else {
                progressStops.set(normalizedDate, { start: [], end: [barId] });
            }
        };

        const semesterName =
            semester[`name:${BETTER_MOODLE_LANG}`] ?? semester.name;

        // add bar and row for semester Zeit
        addBar(semesterStart, semesterEnd, 'primary', semesterName, 'semester');
        addRow(tbody, semesterName, semesterStart, semesterEnd, 'primary');

        semester.additional.forEach(additional => {
            const start = new Date(additional.start);
            const end = new Date(additional.end);
            const name =
                additional[`name:${BETTER_MOODLE_LANG}`] ?? additional.name;

            addBar(start, end, additional.color, name, additional.storage);
            addRow(
                tbody,
                name,
                start,
                end,
                additional.color,
                additional.storage
            );
        });

        holidays.forEach(holiday => {
            for (
                let year = semesterStart.getFullYear();
                year <= semesterEnd.getFullYear();
                year++
            ) {
                const holidayDay = new Date(`${year}-${holiday}`);
                if (holidayDay <= semesterStart || holidayDay >= semesterEnd) {
                    return;
                }

                addBar(
                    holidayDay,
                    holidayDay,
                    'secondary',
                    $t('semesterzeiten.table.holiday').toString(),
                    `holiday.${holiday}`
                );

                const row = tbody.insertRow();
                row.classList.add('table-secondary');
                const cell = row.insertCell();
                cell.textContent = `${$t('semesterzeiten.table.holiday')}: ${dateToString(holidayDay, true, true)}`;
                cell.colSpan = 4;

                row.insertCell().append(getToggle(`holiday.${holiday}`));
            }
        });

        const currentIndexes = new Set();
        const stopDates = Array.from(progressStops.keys()).toSorted(
            (a, b) => a - b
        );
        stopDates.slice(0, -1).forEach((date, index) => {
            // if (date >= now) return;
            const nextDate = stopDates[index + 1];
            const { start, end } = progressStops.get(date);
            start.forEach(barId => currentIndexes.add(barId));
            end.forEach(barId => currentIndexes.delete(barId));

            const startPercentage = (date - semesterStart) / semesterDuration;
            const endPercentage = (nextDate - semesterStart) / semesterDuration;
            const width = (endPercentage - startPercentage) * 100;

            const bar = document.createElement('div');
            bar.classList.add('progress-bar');
            bar.style.setProperty('width', `${width}%`);

            let title = '';

            progressWrapper.append(bar);

            // no bar => full height with transparency
            if (currentIndexes.size === 0) {
                bar.classList.add('bg-transparent');
            }
            // one bar => full height with color
            else if (currentIndexes.size === 1) {
                const currentBar = bars[Array.from(currentIndexes)[0]];
                title += `<p><b>${currentBar.name}</b><br>${currentBar.dateString}</p>`;
                bar.classList.add(`bg-${currentBar.color}`);
                bar.dataset.storage = currentBar.storage;
            }
            // multiple bars => we need a wrapper
            else {
                currentIndexes.forEach(barId => {
                    const subBar = document.createElement('div');
                    subBar.classList.add('progress-bar', 'w-100', 'h-100');
                    const currentBar = bars[barId];
                    subBar.classList.add(`bg-${currentBar.color}`);
                    subBar.dataset.storage = currentBar.storage;
                    title += `<p><b>${currentBar.name}</b><br>${currentBar.dateString}</p>`;
                    bar.append(subBar);
                });
            }
            bar.dataset.originalTitle = title;
            bar.dataset.toggle = 'tooltip';
            bar.dataset.placement = 'bottom';
            bar.dataset.html = 'true';
        });

        const tableWrapper = document.createElement('div');
        tableWrapper.classList.add('table-responsive');

        topBar.append(infoLink, progressWrapper);
        tableWrapper.append(additionalTable);
        semesterDiv.append(topBar, tableWrapper);
        cardContent.append(semesterDiv);

        if (isCurrentSemester) {
            const nowPercentage =
                ((now - semesterStart) / semesterDuration) * 100;
            const nowBar = document.createElement('div');
            nowBar.classList.add(
                'progress-bar',
                'bg-transparent',
                'progress-bar-striped',
                nowAdditionsClass
            );
            nowBar.style.setProperty('width', `${nowPercentage}%`);

            const todaySpan = document.createElement('span');
            todaySpan.classList.add(nowAdditionsClass);
            todaySpan.textContent = dateToString(now);
            todaySpan.style.setProperty(
                'margin-left',
                `calc(${nowPercentage}% + 16px + .5rem)`
            );

            progressWrapper.prepend(nowBar);
            progressWrapper.before(todaySpan);
        }
    };

    getSemesterzeiten().then(({ recurringHolidays, semesters }) => {
        const currentSemesterIndex = semesters.findIndex(
            semester =>
                now > new Date(semester.start) && now < new Date(semester.end)
        );
        if (currentSemesterIndex === -1) return;

        semesters.forEach(semester =>
            createSemester(semester, recurringHolidays)
        );
        cardContent
            .querySelector(':scope > div:first-child')
            ?.classList.remove('hidden');
        cardContent
            .querySelector(':scope > div:first-child nav li:first-child')
            ?.classList.add('disabled');
        cardContent
            .querySelector(':scope > div:last-child nav li:last-child')
            ?.classList.add('disabled');

        updateBarTypeStyle();
    });
}
// endregion

// region Feature: Darkmode
GM_addStyle(`
/* make the UzL-Logo glow beautifully when using dark mode of darkreader */
${DARK_MODE_SELECTOR} .navbar.fixed-top .navbar-brand .logo,
${DARK_MODE_SELECTOR} #logoimage {
    filter: brightness(500%);
}
`);
const updateDarkReaderMode = (live = false) => {
    const darkModeSetting = getSetting('darkmode.mode', live);
    if (darkModeSetting !== 'off') {
        const settings = {
            brightness: getSetting('darkmode.brightness', live),
            contrast: getSetting('darkmode.contrast', live),
            grayscale: getSetting('darkmode.grayscale', live),
            sepia: getSetting('darkmode.sepia', live),
        };
        const fixes = {
            css: `
.eye {
    background-color: white;
}`,
        };
        if (darkModeSetting === 'auto') DarkReader.auto(settings, fixes);
        else {
            DarkReader.auto(false);
            DarkReader.enable(settings, fixes);
        }
    } else if (DarkReader.isEnabled()) {
        DarkReader.auto(false);
        DarkReader.disable();
    }
};
updateDarkReaderMode();
// endregion

// region Feature: Dashboard right sidebar
// add a right sidebar with timeline and upcoming events on Dashboard
if (isDashboard) {
    createSidebar('dashboard-right', 'right', 'calendar', content => {
        // move blocks into sidebar
        content.append(document.querySelector('.block_timeline'));
        content.append(document.querySelector('.block_calendar_upcoming'));
    });
}
// endregion

// region Feature: myCourses.boxesPerRow
const myCoursesBoxesPerRow = getSetting('myCourses.boxesPerRow');
GM_addStyle(`
/* ${myCoursesBoxesPerRow} boxes per row in the "my courses" view, instead of 3 plus increase margin a little */
@media (min-width: 840px) {
  .dashboard-card-deck:not(.fixed-width-cards) .dashboard-card {
    --margin: max(4px, min(10px, calc(100vw / 192)));
    width: calc((100% / ${myCoursesBoxesPerRow}) - var(--margin) * 2);
    margin-left: var(--margin);
    margin-right: var(--margin);
  }
}`);
// endregion

// region Features: courses.grades, courses.gradesNewTab, courses.collapseAll
ready(() => {
    if (!M.cfg.courseId || M.cfg.courseId === 1) return;

    const drawer = document.getElementById('theme_boost-drawers-courseindex');
    if (!drawer) return;

    // region Features: courses.grades, courses.gradesNewTab
    // add a link to Bewertungen on each course-sidebar
    const header = drawer?.querySelector('.drawerheader');
    if (header && getSetting('courses.grades')) {
        const link = document.createElement('a');
        const calcItem = document.createElement('i');
        calcItem.classList.add('icon', 'fa', 'fa-calculator', 'fa-fw');
        link.href = `/grade/report/user/index.php?id=${M.cfg.courseId}`;
        link.classList.add('w-100', 'text-center');
        link.append(calcItem, $t('courses.grades').toString());

        if (getSetting('courses.gradesNewTab')) link.target = '_blank';

        header.append(link);
    }
    // endregion

    // region Feature: courses.collapseAll
    // collapse / un-collapse all sections on double-click on a section header
    if (getSetting('courses.collapseAll')) {
        drawer?.addEventListener('dblclick', e => {
            const target = e.target;
            if (
                !(target instanceof HTMLElement) &&
                !(target instanceof SVGElement)
            ) {
                return;
            }
            const collapseIcon = target.closest(
                '.courseindex-section-title .icons-collapse-expand'
            );
            if (!collapseIcon) return;

            e.preventDefault();

            drawer
                .querySelectorAll(
                    `.courseindex-section-title .icons-collapse-expand${
                        collapseIcon.classList.contains('collapsed') ?
                            ':not(.collapsed)'
                        :   '.collapsed'
                    }`
                )
                .forEach(collapseIcon => collapseIcon.click());
            collapseIcon.focus();
        });
    }
    // endregion
});
// endregion

// region Features: myCourses.navbarDropdown, Dashboard left sidebar
// add a left sidebar with the users courses. Also manipulate my courses link to be a dropdown
ready(async () => {
    if (window.location.pathname.startsWith('/login/')) return;

    if (window.location.pathname === '/my/courses.php') {
        require([
            'jquery',
            'block_myoverview/selectors',
            'core/custom_interaction_events',
        ], (jquery, selectors, { events }) => {
            const block = jquery(document.querySelector('.block-myoverview'));
            if (!block) return;
            const filters = block.find(selectors.FILTERS);
            if (!filters) return;

            filters.on(events.activate, selectors.FILTER_OPTION, () =>
                GM_setValue(MyCoursesFilterSyncChangeKey, Math.random())
            );
        });
    }

    /** @type {HTMLDivElement} */
    let dropdownMenu;
    /** @type {HTMLDivElement} */
    let mobileDropdownMenu;

    /** @type {HTMLDivElement} */
    let sidebarContent;

    /**
     * @typedef {Object} Course
     * @property {string} shortname
     * @property {string} fullname
     * @property {string} viewurl
     * @property {boolean} isfavourite
     */

    /**
     * @param {Course} course
     */
    const addDropdownItem = course => {
        const createAnchor = () => {
            const anchor = document.createElement('a');
            anchor.classList.add('dropdown-item');
            anchor.href = course.viewurl;
            const shortName = document.createElement('strong');
            shortName.textContent = course.shortname;
            const fullName = document.createElement('small');
            fullName.textContent = course.fullname;
            anchor.append(
                ...(course.shortname ? [shortName, '\u00a0'] : []),
                fullName
            );
            anchor.title = anchor.textContent;

            if (course.isfavourite) {
                const favouriteIcon = document.createElement('i');
                favouriteIcon.classList.add('icon', 'fa', 'fa-star', 'fa-fw');
                anchor.prepend(favouriteIcon);
            }

            return anchor;
        };

        if (dropdownMenu) {
            const anchor = createAnchor();
            anchor.classList.add('dropdown-item');
            anchor.style.setProperty('overflow', 'hidden');
            anchor.style.setProperty('text-overflow', 'ellipsis');
            dropdownMenu.append(anchor);
        }
        if (mobileDropdownMenu) {
            const anchor = createAnchor();
            anchor.classList.add(
                'pl-5',
                'bg-light',
                'list-group-item',
                'list-group-item-action'
            );
            mobileDropdownMenu.append(anchor);
        }
    };

    /**
     * @param {Course} course
     */
    const addSidebarItem = course => {
        if (!sidebarContent) return;
        const card = document.createElement('div');
        card.classList.add('card', 'block', 'mb-3');
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body', 'p-3');

        const anchor = document.createElement('a');
        anchor.href = course.viewurl;
        const shortName = document.createElement('strong');
        shortName.textContent = course.shortname;
        const fullName = document.createElement('small');
        fullName.textContent = course.fullname;
        anchor.append(
            ...(course.shortname ?
                [shortName, document.createElement('br')]
            :   []),
            fullName
        );
        anchor.title = anchor.textContent;

        if (course.isfavourite) {
            const favouriteIcon = document.createElement('i');
            favouriteIcon.classList.add('icon', 'fa', 'fa-star', 'fa-fw');
            anchor.prepend(favouriteIcon);
        }

        cardBody.append(anchor);
        card.append(cardBody);
        sidebarContent.append(card);
    };

    // convert the "my courses" link into a dropdown
    /** @type {HTMLLIElement | null} */
    const myCoursesLi = document.querySelector(
        '.primary-navigation .nav-item[data-key="mycourses"]'
    );
    /** @type {HTMLAnchorElement | null} */
    const myCoursesA = myCoursesLi?.querySelector('a');
    if (myCoursesLi && myCoursesA) {
        myCoursesLi.classList.add('dropdown');

        const myCoursesLink = myCoursesA.href;

        if (getSetting('myCourses.navbarDropdown')) {
            myCoursesA.classList.add('dropdown-toggle');
            myCoursesA.dataset.toggle = 'dropdown';
            myCoursesA.href = '#';
            myCoursesA.id = PREFIX('my-courses-dropdown-toggle');

            dropdownMenu = document.createElement('div');
            dropdownMenu.classList.add('dropdown-menu');
            dropdownMenu.style.setProperty('max-width', '500px');
            dropdownMenu.role = 'menu';
            dropdownMenu.id = PREFIX('my-courses-dropdown-menu');

            myCoursesA.setAttribute('aria-controls', dropdownMenu.id);
            dropdownMenu.setAttribute('aria-labelledby', myCoursesA.id);

            myCoursesA.after(dropdownMenu);

            // open my courses if clicked when dropdown is open and not already on my courses page
            myCoursesA.addEventListener('click', e => {
                if (
                    myCoursesLi.classList.contains('show') &&
                    !window.location.toString().includes(myCoursesLink)
                ) {
                    e.preventDefault();
                    window.location.replace(myCoursesLink);
                }
            });
        }

        // mobile menu
        const mobileA = document.querySelector(
            `#theme_boost-drawers-primary .list-group-item[href="${myCoursesLink}"]`
        );
        if (mobileA) {
            mobileA.classList.add(
                'icons-collapse-expand',
                'collapsed',
                'd-flex'
            );
            mobileA.dataset.toggle = 'collapse';
            mobileA.href = '#';

            mobileDropdownMenu = document.createElement('div');
            mobileDropdownMenu.classList.add(
                'collapse',
                'list-group-item',
                'p-0',
                'border-0'
            );
            mobileDropdownMenu.id = `dropdown-${crypto.randomUUID()}`;
            mobileA.dataset.target = `#${mobileDropdownMenu.id}`;

            const caretDown = document.createElement('span');
            caretDown.classList.add(
                'ml-auto',
                'expanded-icon',
                'icon-no-margin',
                'mx-2'
            );
            const caretDownIcon = document.createElement('i');
            caretDownIcon.classList.add('icon', 'fa', 'fa-caret-down', 'fa-fw');
            caretDown.append(caretDownIcon);
            const caretRight = document.createElement('span');
            caretRight.classList.add(
                'ml-auto',
                'collapsed-icon',
                'icon-no-margin',
                'mx-2'
            );
            const caretRightIcon = document.createElement('i');
            caretRightIcon.classList.add(
                'icon',
                'fa',
                'fa-caret-right',
                'fa-fw'
            );
            caretRight.append(caretRightIcon);

            mobileA.append(caretDown, caretRight);
            mobileA.after(mobileDropdownMenu);
        }
    }

    // add a left sidebar
    if (isDashboard) {
        createSidebar(
            'dashboard-left',
            'left',
            'graduation-cap',
            (content, header) => {
                sidebarContent = content;

                // add the my-courses link as a sidebar header
                const myCoursesLink = document.createElement('a');
                myCoursesLink.textContent = $t(
                    'myCourses.lists.myCoursesLink'
                ).toString();
                myCoursesLink.href = '/my/courses.php';
                myCoursesLink.classList.add('w-100', 'text-center');

                // add the filter dropdown
                const dropdownToggle = document.createElement('button');
                dropdownToggle.classList.add(
                    'btn',
                    'icon-no-margin',
                    'dropdown-toggle'
                );
                dropdownToggle.dataset.toggle = 'dropdown';
                dropdownToggle.id = PREFIX(
                    'dashboard-my-courses-filter-toggle'
                );
                const filterIcon = document.createElement('i');
                filterIcon.classList.add('icon', 'fa', 'fa-filter', 'fa-fw');
                dropdownToggle.append(filterIcon);
                const dropdown = document.createElement('ul');
                dropdown.classList.add('dropdown-menu', 'w-100');
                dropdown.id = PREFIX('dashboard-my-courses-filter-menu');

                dropdownToggle.setAttribute('aria-controls', dropdown.id);
                dropdown.setAttribute('aria-labelledby', dropdownToggle.id);

                // move the dropdown after it has been initially opened
                require(['jquery'], $ => {
                    $(header).on('shown.bs.dropdown', () =>
                        sidebarContent.prepend(dropdown)
                    );
                });

                const settingId = 'dashboard.courseListFilter';

                const value = getSetting(settingId);

                getCourseGroupingOptions().then(options =>
                    options.forEach(({ key, title }) => {
                        const item = document.createElement('li');
                        item.dataset.value = key;
                        const link = document.createElement('a');
                        link.classList.add('dropdown-item');
                        link.href = '#';
                        link.textContent = title;
                        if (value === key) link.ariaCurrent = 'true';
                        item.append(link);
                        dropdown.append(item);
                    })
                );

                const updateSidebar = newValue => {
                    dropdown
                        .querySelector('[aria-current="true"]')
                        ?.removeAttribute('aria-current');
                    dropdown
                        .querySelector(
                            `[data-value=${JSON.stringify(newValue)}] a`
                        )
                        ?.setAttribute('aria-current', 'true');

                    fillSidebar();
                };

                dropdown.addEventListener('click', e => {
                    e.preventDefault();
                    const target = e.target;
                    if (!(target instanceof HTMLElement)) return;
                    const item = target.closest('[data-value]');
                    if (!item) return;
                    GM_setValue(getSettingKey(settingId), item.dataset.value);
                });

                GM_addValueChangeListener(
                    getSettingKey(settingId),
                    (_, __, newValue) => updateSidebar(newValue)
                );
                GM_addValueChangeListener(MyCoursesFilterSyncChangeKey, () =>
                    updateSidebar(getSetting(settingId))
                );

                GM_addStyle(`
#${dropdown.id} {
    transform: unset !important;
    position: sticky !important;
}

#${dropdown.id} a {
    width: 100%;
}

`);

                header.append(myCoursesLink, dropdownToggle, dropdown);
            }
        );
    }

    const loadingSpan = document.createElement('span');
    loadingSpan.classList.add(
        'loading-icon',
        'icon-no-margin',
        'text-center',
        'd-block'
    );
    const loadingIcon = document.createElement('i');
    loadingIcon.classList.add(
        'icon',
        'fa',
        'fa-circle-o-notch',
        'fa-spin',
        'fa-fw'
    );
    loadingSpan.append(loadingIcon);

    const fillSidebar = async () => {
        if (!sidebarContent) return;

        const loadingSpanEl = loadingSpan.cloneNode(true);

        sidebarContent.innerHTML = '';
        sidebarContent.append(loadingSpanEl);

        const sidebarGroupingSetting = getSetting('dashboard.courseListFilter');
        const sidebarGrouping =
            sidebarGroupingSetting === '_sync' ?
                await getCourseGroupings().then(
                    courseGroupings =>
                        courseGroupings.find(grouping => grouping.active) ??
                        courseGroupings[0]
                )
            :   JSON.parse(sidebarGroupingSetting);

        // fetch the courses
        require(['block_myoverview/repository'], ({
            getEnrolledCoursesByTimeline,
        }) =>
            getEnrolledCoursesByTimeline({
                classification: sidebarGrouping.classification,
                customfieldname: sidebarGrouping.customfieldname,
                customfieldvalue: sidebarGrouping.customfieldvalue,
                limit: 0,
                offset: 0,
                sort: 'shortname',
            }).then(({ courses }) => {
                loadingSpanEl.remove();
                if (getSetting('dashboard.courseListFavouritesAtTop')) {
                    courses.sort((a, b) => b.isfavourite - a.isfavourite);
                }
                courses.forEach(addSidebarItem);
                if (!courses.length) {
                    const noCoursesSpan = document.createElement('span');
                    noCoursesSpan.classList.add('text-muted', 'text-center');
                    noCoursesSpan.textContent = $t(
                        'myCourses.lists.empty'
                    ).toString();
                    sidebarContent.append(noCoursesSpan);
                }
            }));
    };

    fillSidebar().then();

    const fillDropdown = async () => {
        if (dropdownMenu) dropdownMenu.innerHTML = '';
        if (mobileDropdownMenu) mobileDropdownMenu.innerHTML = '';

        const dropdownLoadingSpan = loadingSpan.cloneNode(true);
        const mobileLoadingSpan = loadingSpan.cloneNode(true);

        dropdownMenu?.append(dropdownLoadingSpan);
        mobileDropdownMenu?.append(mobileLoadingSpan);

        const dropdownGroupingSetting = getSetting(
            'myCourses.navbarDropdownFilter'
        );
        const dropdownGrouping =
            dropdownGroupingSetting === '_sync' ?
                await getCourseGroupings().then(
                    courseGroupings =>
                        courseGroupings.find(grouping => grouping.active) ??
                        courseGroupings[0]
                )
            :   JSON.parse(dropdownGroupingSetting);

        // fetch the courses
        require(['block_myoverview/repository'], ({
            getEnrolledCoursesByTimeline,
        }) =>
            getEnrolledCoursesByTimeline({
                classification: dropdownGrouping.classification,
                customfieldname: dropdownGrouping.customfieldname,
                customfieldvalue: dropdownGrouping.customfieldvalue,
                limit: 0,
                offset: 0,
                sort: 'shortname',
            }).then(({ courses }) => {
                dropdownLoadingSpan.remove();
                mobileLoadingSpan.remove();

                if (myCoursesA) {
                    addDropdownItem({
                        fullname: `[${$t('myCourses.lists.myCoursesLink')}]`,
                        shortname: '',
                        viewurl: '/my/courses.php',
                    });
                }

                if (getSetting('myCourses.navbarDropdownFavouritesAtTop')) {
                    courses.sort((a, b) => b.isfavourite - a.isfavourite);
                }
                courses.forEach(addDropdownItem);

                if (!courses.length) {
                    const noCoursesSpan = document.createElement('span');
                    noCoursesSpan.classList.add('text-muted', 'text-center');
                    noCoursesSpan.textContent = $t(
                        'myCourses.lists.empty'
                    ).toString();
                    dropdownMenu?.append(noCoursesSpan);
                    mobileDropdownMenu?.append(noCoursesSpan.cloneNode(true));
                }
            }));
    };

    GM_addValueChangeListener(MyCoursesFilterSyncChangeKey, () =>
        fillDropdown()
    );

    fillDropdown().then();
});
// endregion

// region Feature: courses.imgMaxWidth
if (getSetting('courses.imgMaxWidth')) {
    GM_addStyle(`
/* prevent images from overflowing */
#page-content .course-content img {
    max-width: 100%;
}
    `);
}
// endregion

// region Feature: courses.imageZoom
if (getSetting('courses.imageZoom')) {
    const overlay = document.createElement('div');
    overlay.id = PREFIX('image-zoom-overlay');

    let copyImage;

    GM_addStyle(`
#page-content .course-content img {
    cursor: zoom-in;
}

/* background for image zooming */
#${overlay.id} {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2000;
    opacity: 0;

    background: rgba(0, 0, 0, 0.75);

    cursor: zoom-out;

    transition: opacity 0.2s ease-in-out;
    will-change: opacity;

    display: flex;
    align-items: center;
    justify-content: center;
}

/* image zooming */
#${overlay.id} > img {
    cursor: zoom-out;
    transform: scale(0);
    transition: transform 0.2s ease-in-out;
    will-change: transform;
}`);

    overlay.addEventListener('click', () => {
        overlay.remove();
        copyImage.remove();

        overlay.style.removeProperty('opacity');
    });

    const zoomImage = e => {
        const target = e.target;
        if (!(target instanceof HTMLImageElement)) return;

        e.preventDefault();

        copyImage = target.cloneNode(true);

        // remove additional styles that could produce weird results
        copyImage.style.removeProperty('margin');
        copyImage.style.removeProperty('width');
        copyImage.style.removeProperty('height');
        copyImage.style.setProperty('display', 'block');
        copyImage.removeAttribute('width');
        copyImage.removeAttribute('height');

        copyImage.addEventListener('load', () => {
            const { naturalWidth: width, naturalHeight: height } = copyImage;

            // a size could not be determined
            if (!width || !height) {
                copyImage.style.setProperty('max-width', `90%`);
                copyImage.style.setProperty('max-height', `90%`);
                copyImage.style.setProperty('transform', `scale(1)`);
            }

            const maxWidth = window.innerWidth * 0.9;
            const maxHeight = window.innerHeight * 0.9;

            const scale = Math.min(maxWidth / width, maxHeight / height);

            copyImage.style.setProperty('transform', `scale(${scale})`);
        });

        overlay.append(copyImage);
        document.body.append(overlay);

        overlay.style.setProperty('opacity', '1');
    };

    ready(() =>
        document
            .querySelector('#page-content .course-content')
            ?.addEventListener('click', zoomImage)
    );
}
// endregion

// region Feature: courses.hideSelfEnrolHint
if (getSetting('courses.hideSelfEnrolHint')) {
    GM_addStyle(`
.course-hint-selfenrol.alert.alert-info {
    display: none !important;
}
`);
}
// endregion

// region Feature: clock.fuzzyClock
if (getSetting('clock.fuzzyClock')) {
    /** @type {number} */
    const fuzziness = getSetting('clock.fuzzyClock.fuzziness');

    const clockSpan = document.createElement('span');
    clockSpan.dataset.clockFuzziness = fuzziness.toString();

    addMarqueeItems(clockSpan);

    /** @type {Map<number, string>} */
    const timeStrings = new Map();

    animationInterval(1000, () => {
        timeStrings.clear();

        const now = new Date();
        const hour = now.getHours();
        const twelveHour = hour % 12 || 12;
        const minutes = now.getMinutes();
        const exactMinutes = minutes + now.getSeconds() / 60;

        timeStrings.set(0, timeToString(now, true));

        document
            .querySelectorAll('[data-clock-fuzziness]')
            .forEach(clockSpan => {
                const fuzziness = parseInt(clockSpan.dataset.clockFuzziness);
                if (timeStrings.has(fuzziness)) {
                    clockSpan.textContent = timeStrings.get(fuzziness);
                }

                /** @type {(string|number)[]} */
                const timeString = [];

                switch (fuzziness) {
                    case 0: // 1 second, "normal" clock
                        clockSpan.textContent = timeStrings.get(fuzziness);
                        break;
                    case 10: // 5 minutes
                    case 20: {
                        // 15 minutes
                        const sectorSize = fuzziness === 10 ? 5 : 15;
                        const sectors = 60 / sectorSize;
                        const middleSector = sectors / 2;
                        const nextHour = (twelveHour + 1) % 12;
                        const minuteSector =
                            Math.floor(
                                (exactMinutes + sectorSize / 2) / sectorSize
                            ) % 12;
                        if (minuteSector === 0) {
                            const shownHour =
                                minutes < 30 ? twelveHour : nextHour;
                            timeString.push(shownHour, 'oClock');
                        } else if (minuteSector < middleSector) {
                            timeString.push(
                                minuteSector * sectorSize,
                                'past',
                                twelveHour
                            );
                        } else if (minuteSector === middleSector) {
                            timeString.push('half', nextHour);
                        } else if (minuteSector > middleSector) {
                            timeString.push(
                                60 - minuteSector * sectorSize,
                                'to',
                                nextHour
                            );
                        }
                        break;
                    }
                    case 30:
                    case 40: {
                        /** @type {string[]} */
                        const strings = $t(
                            `clock.fuzzyClock.other.${fuzziness}`
                        );
                        const section = Math.floor(
                            hour / (24 / strings.length)
                        );
                        timeString.push(`other.${fuzziness}.${section}`);
                        break;
                    }
                    case 50: {
                        const dayOfWeek = now.getDay();
                        const weekString =
                            dayOfWeek === 1 ?
                                0 // Monday
                            : dayOfWeek <= 3 ?
                                1 // Tuesday, Wednesday
                            : dayOfWeek <= 5 ?
                                2 // Thursday, Friday
                            :   3; // Saturday, Sunday
                        timeString.push(`other.50.${weekString}`);
                    }
                }

                if (timeString.length) {
                    timeStrings.set(
                        fuzziness,
                        timeString
                            .map(s => $t(`clock.fuzzyClock.${s}`))
                            .join('\xa0')
                    );
                    clockSpan.textContent = timeStrings.get(fuzziness);
                    clockSpan.title = timeStrings.get(0);
                }
            });
    });
}
// endregion

// region Feature: weatherDisplay
if (getSetting('weatherDisplay.show')) {
    const city = {
        // TODO: Use coordinates more often
        name: 'luebeck',
        lat: 53.8655, // TODO: Are these values correct?
        lon: 10.6866,
    }; // TODO: Should this be configurable?
    const provider = getSetting('weatherDisplay.provider');
    const units = getSetting('weatherDisplay.units');
    const showTempInNavbar = getSetting('weatherDisplay.showTempInNavbar');
    const toggleFeelsLike = getSetting('weatherDisplay.toggleFeelsLike');
    const ONE_MINUTE = 1000 * 60;
    const FIVE_MINUTES = ONE_MINUTE * 5;

    const VISUALCROSSING_API_KEY = getSetting(
        'weatherDisplay.visualCrossingAPIKey'
    );
    const OPENWEATHERMAP_API_KEY = getSetting(
        'weatherDisplay.openWeatherMapAPIKey'
    );
    const PIRATEWEATHER_API_KEY = getSetting(
        'weatherDisplay.pirateWeatherAPIKey'
    );

    const prefix = str => PREFIX(`weather-display-${str}`);

    const fetchJSON = url =>
        new Promise((resolve, reject) => {
            console.log('fetching', url); // TODO: Remove this
            GM_xmlhttpRequest({
                method: 'GET',
                url,
                onload: ({ responseText }) => resolve(JSON.parse(responseText)),
                onerror: reject, // TODO: reject if not 200 OK
            });
        });

    const manageRateLimit = (rateLimit, url) => {
        const now = Date.now();
        const host = new URL(url).host;
        const [lastRequest, cached] = JSON.parse(
            atob(GM_getValue(prefix(host), btoa('[0, null]')))
        );

        if (lastRequest + rateLimit > now) {
            return new Promise(resolve => resolve(cached));
        }
        return fetchJSON(url).then(data => {
            GM_setValue(prefix(host), btoa(JSON.stringify([now, data])));
            return data;
        });
    };

    const wttrIn = () => {
        return manageRateLimit(
            ONE_MINUTE,
            `https://wttr.in/${city.name}?format=j1&lang`
        ) // The `&lang` removes the faulty german translation
            .then(data => {
                const weatherType = (() => {
                    switch (
                        new Number(
                            data.current_condition[0].weatherCode
                        ).valueOf()
                    ) {
                        case 113:
                            return 800;
                        case 116:
                            return 802;
                        case 119:
                            return 803;
                        case 122:
                            return 804;
                        case 143:
                            return 701;
                        case 176:
                            return 500;
                        case 179:
                            return 600;
                        case 182:
                        case 185:
                            return 612;
                        case 200:
                            return 210;
                        case 227:
                            return 601;
                        case 230:
                            return 602;
                        case 248:
                        case 260:
                            return 741;
                        case 263:
                        case 266:
                            return 300;
                        case 281:
                            return 611;
                        case 284:
                            return 511;
                        case 293:
                            return 301;
                        case 296:
                            return 500;
                        case 299:
                            return 521;
                        case 302:
                            return 501;
                        case 305:
                            return 522;
                        case 308:
                            return 502;
                        case 311:
                            return 611;
                        case 314:
                            return 511;
                        case 317:
                            return 612;
                        case 320:
                            return 613;
                        case 323:
                        case 326:
                            return 600;
                        case 329:
                        case 332:
                            return 601;
                        case 335:
                        case 338:
                            return 602;
                        case 350:
                            return 511;
                        case 353:
                            return 520;
                        case 356:
                            return 521;
                        case 359:
                            return 504;
                        case 362:
                            return 612;
                        case 365:
                            return 613;
                        case 368:
                            return 620;
                        case 371:
                            return 621;
                        case 374:
                            return 511;
                        case 377:
                            return 511;
                        case 386:
                            return 200;
                        case 389:
                            return 201;
                        case 392:
                            return 200;
                        case 395:
                            return 202;
                        default:
                            console.warn(
                                'Unknown weather:',
                                data.current_condition[0].weatherCode
                            );
                            return 0;
                    }
                })();
                return {
                    temperature: data.current_condition[0].temp_C,
                    temperatureFeelsLike: data.current_condition[0].FeelsLikeC,
                    windDirection: data.current_condition[0].winddirDegree,
                    windSpeed: data.current_condition[0].windspeedKmph,
                    visibilityDistance: data.current_condition[0].visibility,
                    humidity: data.current_condition[0].humidity,
                    pressure: data.current_condition[0].pressure,
                    cloudCover: data.current_condition[0].cloudcover,
                    rainGauge: data.current_condition[0].precipMM,
                    weatherType,
                    time: new Date(data.current_condition[0].localObsDateTime), // TODO: check different time zones
                };
            });
    };

    const openMeteo = () => {
        return manageRateLimit(
            FIVE_MINUTES,
            `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m&minutely_15=visibility&timeformat=unixtime&timezone=Europe%2FBerlin&forecast_days=1`
        ).then(data => {
            const now = Math.floor(Date.now() / 1000);
            let visibilityIndex = 0;
            for (let i = 0; i < data.minutely_15.length; i++) {
                if (data.minutely_15.time[i] > now) {
                    visibilityIndex = i;
                    break;
                }
            }
            const weatherType = (() => {
                switch (data.current.weather_code) {
                    case 0:
                        return 800;
                    case 1:
                        return 801;
                    case 2:
                        return 802;
                    case 3:
                        return 804;
                    case 45:
                    case 48:
                        return 741;
                    case 51:
                        return 300;
                    case 53:
                        return 301;
                    case 55:
                        return 302;
                    case 56:
                        return 612;
                    case 57:
                        return 613;
                    case 61:
                        return 500;
                    case 63:
                        return 501;
                    case 65:
                        return 502;
                    case 66:
                    case 67:
                        return 511;
                    case 71:
                        return 600;
                    case 73:
                        return 601;
                    case 75:
                        return 602;
                    case 77:
                        return 611;
                    case 80:
                        return 520;
                    case 81:
                        return 521;
                    case 82:
                        return 522;
                    case 85:
                        return 620;
                    case 86:
                        return 621;
                    case 95:
                        return 211;
                    case 96:
                    case 99:
                        return 511;
                    default:
                        console.warn(
                            'Unknown weather:',
                            data.current.weather_code
                        );
                        return 0;
                }
            })();
            return {
                temperature: data.current.temperature_2m,
                temperatureFeelsLike: data.current.apparent_temperature,
                windDirection: data.current.wind_direction_10m,
                windSpeed: data.current.wind_speed_10m,
                visibilityDistance:
                    data.minutely_15.visibility[visibilityIndex] / 1000,
                humidity: data.current.relative_humidity_2m,
                pressure: data.current.surface_pressure,
                cloudCover: data.current.cloud_cover,
                rainGauge: data.current.precipitation,
                weatherType,
                time: new Date(data.current.time * 1000),
            };
        });
    };

    const visualCrossing = () => {
        return manageRateLimit(
            FIVE_MINUTES,
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city.name}?unitGroup=metric&lang=id&iconSet=icons2&include=current&key=${VISUALCROSSING_API_KEY}&contentType=json`
        )
            .then(data => {
                const weatherType = (() => {
                    switch (data.currentConditions.icon) {
                        case 'snow':
                            return 601;
                        case 'snow-showers-day':
                        case 'snow-showers-night':
                            return 621;
                        case 'thunder-rain':
                        case 'thunder-showers-day':
                        case 'thunder-showers-night':
                            return 201;
                        case 'rain':
                            return 501;
                        case 'rain-showers-day':
                        case 'rain-showers-night':
                            return 521;
                        case 'fog':
                            return 741;
                        case 'wind':
                            return 771;
                        case 'cloudy':
                            return 804;
                        case 'partly-cloudy-day':
                        case 'partly-cloudy-night':
                            return 802;
                        case 'clear-day':
                        case 'clear-night':
                            return 800;
                        default:
                            console.warn(
                                'Unknown weather:',
                                data.currentConditions.icon
                            );
                            return 0;
                    }
                })();
                return {
                    temperature: data.currentConditions.temp,
                    temperatureFeelsLike: data.currentConditions.feelslike,
                    windDirection: data.currentConditions.winddir,
                    windSpeed: data.currentConditions.windspeed,
                    visibilityDistance: data.currentConditions.visibility,
                    humidity: data.currentConditions.humidity,
                    pressure: data.currentConditions.pressure,
                    cloudCover: data.currentConditions.cloudcover,
                    rainGauge: data.currentConditions.precip,
                    weatherType,
                    time: new Date(data.currentConditions.datetimeEpoch * 1000),
                };
            })
            .catch(wttrIn); // TODO: fix fallback
    };

    const openWeatherMap = () => {
        return manageRateLimit(
            FIVE_MINUTES,
            `https://api.openweathermap.org/data/2.5/weather?q=${city.name}&units=metric&appid=${OPENWEATHERMAP_API_KEY}`
        )
            .then(data => {
                return {
                    temperature: data.main.temp,
                    temperatureFeelsLike: data.main.feels_like,
                    windDirection: data.wind.deg,
                    windSpeed: data.wind.speed,
                    visibilityDistance: data.visibility / 1000,
                    humidity: data.main.humidity,
                    pressure: data.main.pressure,
                    cloudCover: data.clouds.all,
                    rainGauge: data.rain?.['1h'] ?? 0,
                    weatherType: data.weather[0].id,
                    time: new Date(data.dt * 1000),
                };
            })
            .catch(wttrIn); // TODO: fix fallback
    };

    const pirateWeather = () => {
        return manageRateLimit(
            FIVE_MINUTES,
            `https://api.pirateweather.net/forecast/${PIRATEWEATHER_API_KEY}/${city.lat},${city.lon}?units=si`
        )
            .then(data => {
                const weatherType = (() => {
                    switch (data.currently.icon) {
                        case 'clear-day':
                        case 'clear-night':
                            return 800;
                        case 'rain':
                            return 501;
                        case 'snow':
                            return 601;
                        case 'sleet':
                            return 611;
                        case 'wind':
                            return 771;
                        case 'fog':
                            return 741;
                        case 'cloudy':
                            return 804;
                        case 'partly-cloudy-day':
                        case 'partly-cloudy-night':
                            return 802;
                        default:
                            console.warn(
                                'Unknown weather:',
                                data.currently.icon
                            );
                            return 0;
                    }
                })();
                return {
                    temperature: data.currently.temperature,
                    temperatureFeelsLike: data.currently.apparentTemperature,
                    windDirection: data.currently.windBearing,
                    windSpeed: data.currently.windSpeed,
                    visibilityDistance: data.currently.visibility,
                    humidity: data.currently.humidity * 100,
                    pressure: data.currently.pressure,
                    cloudCover: data.currently.cloudCover,
                    rainGauge: data.currently.precipIntensity,
                    weatherType,
                    time: new Date(data.currently.time * 1000),
                };
            })
            .catch(wttrIn); // TODO: fix fallback
    };

    const weatherProvider = (() => {
        switch (provider) {
            case 'wttrIn':
                return wttrIn;
            case 'openMeteo':
                return openMeteo;
            case 'visualCrossing':
                return visualCrossing;
            case 'openWeatherMap':
                return openWeatherMap;
            case 'pirateWeather':
                return pirateWeather;
        }
    })();

    const displayData = (key, data) => {
        const round = (value, precision, fixed = false) => {
            const factor = 10 ** precision;
            const roundedValue = Math.round(value * factor) / factor;
            return Intl.NumberFormat(BETTER_MOODLE_LANG, {
                maximumFractionDigits: precision,
                minimumFractionDigits: fixed ? precision : 0,
            }).format(roundedValue);
        };
        const unitConverter = {
            temperature: {
                metric: celsius => [round(celsius, 2), '&#x202F;°C'],
                scientific: celsius => [
                    round(celsius + 273.15, 2, true),
                    '&#x202F;K',
                ],
                imperial: celsius => [
                    round((celsius * 9) / 5 + 32, 2),
                    '&#x202F;°F',
                ],
            },
            temperatureFeelsLike: {
                metric: celsius => [round(celsius, 2), '&#x202F;°C'],
                scientific: celsius => [
                    round(celsius + 273.15, 2, true),
                    '&#x202F;K',
                ],
                imperial: celsius => [
                    round((celsius * 9) / 5 + 32, 2),
                    '&#x202F;°F',
                ],
            },
            windDirection: {
                metric: deg => [round(deg, 2), '°'],
                scientific: deg => [
                    round((deg * Math.PI) / 180, 2, true),
                    '&#x202F;rad',
                ],
                imperial: deg => [round(deg, 2), '°'],
            },
            windSpeed: {
                metric: kmh => [round(kmh, 2), '&#x202F;km/h'],
                scientific: kmh => [
                    round((kmh * 1000) / 3600, 2, true),
                    '&#x202F;m/s',
                ],
                imperial: kmh => [round(kmh / 1.609344, 2), '&#x202F;mph'],
            },
            visibilityDistance: {
                metric: km => [round(km, 2), '&#x202F;km'],
                scientific: km => [round(km * 1000, 0, true), '&#x202F;m'],
                imperial: km => [round(km / 1.609344, 2), '&#x202F;mi'],
            },
            humidity: {
                metric: percent => [round(percent, 2), '&#x202F;%'],
                scientific: percent => [round(percent / 100, 2, true), ''], // TODO: use real SI units (kg/m³)
                imperial: percent => [round(percent, 2), '&#x202F;%'],
            },
            pressure: {
                metric: hPa => [round(hPa, 2), '&#x202F;hPa'],
                scientific: hPa => [round(hPa * 100, 2, true), '&#x202F;Pa'],
                imperial: hPa => [
                    round(hPa * 0.02952998751, 2),
                    '&#x202F;inHg',
                ],
            },
            cloudCover: {
                metric: percent => [round(percent, 2), '&#x202F;%'],
                scientific: percent => [round(percent / 100, 2, true), ''],
                imperial: percent => [round(percent, 2), '&#x202F;%'],
            },
            rainGauge: {
                metric: mm => [round(mm, 2), '&#x202F;mm'],
                scientific: mm => [round(mm / 1000, 3, true), '&#x202F;m'],
                imperial: mm => [round(mm / 25.4, 2), '&#x202F;in'],
            },
        };

        return unitConverter[key][units](Number(data[key])).join('');
    };

    const getWeatherEmoji = weatherType => {
        return (
            weatherType === 0 ? '❓'
            : weatherType >= 200 && weatherType <= 202 ? '⛈️'
            : weatherType >= 210 && weatherType <= 221 ? '🌩️'
            : weatherType >= 230 && weatherType <= 302 ? '⛈️'
            : weatherType >= 310 && weatherType <= 312 ? '🌧️'
            : weatherType >= 313 && weatherType <= 321 ? '🌦️'
            : weatherType >= 500 && weatherType <= 503 ? '🌧️'
            : weatherType === 504 ? '🌊'
            : weatherType === 511 ? '❄️'
            : weatherType >= 520 && weatherType <= 531 ? '🌧️'
            : weatherType >= 600 && weatherType <= 622 ? '🌨️'
            : weatherType >= 701 && weatherType <= 761 ? '🌫️'
            : weatherType === 762 ? '🌋'
            : weatherType === 771 ? '💨'
            : weatherType === 781 ? '🌪️'
            : weatherType === 800 ? '☀️'
            : weatherType === 801 ? '🌤️'
            : weatherType === 802 ? '⛅'
            : weatherType === 803 ? '🌥️'
            : weatherType === 804 ? '☁️'
            : '❓'
        );
    };
    const windDirectionToArrow = deg => {
        const arrows = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖'];
        return arrows[Math.round(deg / 45) % 8];
    };

    const openWeatherDisplayModal = e => {
        e.preventDefault();

        require(['core/modal_factory'], ({ create, types }) =>
            weatherProvider().then(data => {
                create({
                    type: types.ALERT,
                    large: true,
                    scrollable: true,
                    title: `${getWeatherEmoji(
                        data.weatherType
                    )}\xa0${$t('weatherDisplay.title')}`,
                    body: JSON.stringify(data), // TODO: display weather description here
                }).then(modal => {
                    modal.setButtonText(
                        'cancel',
                        `${$t('weatherDisplay.close')}`
                    );
                    modal.getBody()[0].classList.add('mform');

                    const credits = document.createElement('span');
                    credits.classList.add('text-muted', 'small', 'mr-auto');
                    credits.innerHTML = `${$t(
                        'weatherDisplay.credits._long'
                    )} <a href="${$t(
                        `weatherDisplay.credits.${provider}.url`
                    )}">${$t(`weatherDisplay.credits.${provider}.name`)}</a>`;
                    modal.getFooter().prepend(credits);

                    modal.show();
                });
            }));
    };

    const weatherBtnWrapper = document.createElement('div');
    weatherBtnWrapper.id = PREFIX('weather-button');
    const weatherBtn = document.createElement('a');
    weatherBtn.innerText = `${getWeatherEmoji(0)}`;
    weatherBtn.dataset.originalTitle = $t('weatherDisplay.weatherCodes.0');
    weatherBtn.classList.add('nav-link', 'position-relative');
    weatherBtn.href = '#';
    weatherBtn.role = 'button';
    weatherBtn.dataset.toggle = 'tooltip';
    weatherBtn.dataset.placement = 'bottom';
    weatherBtn.dataset.html = 'true';
    weatherBtn.addEventListener('click', openWeatherDisplayModal);
    weatherBtnWrapper.append(weatherBtn);

    ready(() => {
        document
            .querySelector('#usernavigation .usermenu-container')
            ?.before(weatherBtnWrapper);
    });

    animationInterval(
        ONE_MINUTE,
        () => {
            weatherProvider().then(data => {
                const weatherEmoji = getWeatherEmoji(data.weatherType);
                weatherBtn.innerHTML =
                    weatherEmoji +
                    (showTempInNavbar ?
                        ` ${displayData(
                            toggleFeelsLike ?
                                'temperatureFeelsLike'
                            :   'temperature',
                            data
                        )}`
                    :   '');
                weatherBtn.dataset.originalTitle = `<strong>${weatherEmoji}\xa0${$t(
                    `weatherDisplay.weatherCodes.${data.weatherType}`
                )}</strong><br>🌡️:&nbsp;${
                    displayData('temperature', data) +
                    (toggleFeelsLike ?
                        ` (${displayData('temperatureFeelsLike', data)})`
                    :   '')
                }<br>🪁:&nbsp;${displayData(
                    'windSpeed',
                    data
                )}&nbsp;(${windDirectionToArrow(
                    data.windDirection
                )})<br>💦:&nbsp;${displayData(
                    'rainGauge',
                    data
                )}<br><br><small>${$t('weatherDisplay.credits._short')}: ${$t(
                    `weatherDisplay.credits.${provider}.name`
                )}<br>${$t(
                    'weatherDisplay.updated'
                )}:&nbsp;${timeToString(data.time, false)}</small>`;
            });
        },
        true
    );
}
// endregion

// region Feature messages.sendHotkey
const messagesSendHotkey = getSetting('messages.sendHotkey');
if (messagesSendHotkey) {
    ready(() => {
        // .message-app
        const messageApp = document.querySelector('.message-app');
        if (!messageApp) return;

        const inputField = messageApp.querySelector(
            'textarea[data-region="send-message-txt"]'
        );
        const sendBtn = messageApp.querySelector(
            '[data-action="send-message"]'
        );

        if (!inputField || !sendBtn) return;

        inputField.addEventListener('keydown', e => {
            if (e.key !== 'Enter') return;
            if (
                messageApp.querySelector(
                    '.emoji-auto-complete-container:not(.hidden)'
                )
            ) {
                return;
            }

            switch (messagesSendHotkey) {
                case 'shiftEnter':
                    if (e.shiftKey) sendBtn.click();
                    e.preventDefault();
                    break;
                case 'ctrlEnter':
                    if (e.ctrlKey) sendBtn.click();
                    e.preventDefault();
                    break;
            }
        });
    });
}
// endregion

// region Settings modal
// A settings modal
ready(() => {
    if (window.location.pathname.startsWith('/login/')) return;

    const settingsBtnWrapper = document.createElement('div');
    const settingsBtn = document.createElement('a');
    settingsBtn.classList.add(
        'nav-link',
        'position-relative',
        'icon-no-margin'
    );
    settingsBtn.href = '#';
    settingsBtn.role = 'button';
    const settingsIcon = document.createElement('i');
    settingsIcon.classList.add('icon', 'fa', 'fa-gears', 'fa-fw');
    settingsIcon.title = settingsBtn.ariaLabel = `Better-Moodle:\xa0${$t(
        'modals.settings.title'
    ).toString()}`;
    settingsIcon.role = 'img';
    settingsBtn.append(settingsIcon);

    const srSpan = document.createElement('span');
    srSpan.classList.add('sr-only', 'sr-only-focusable');
    srSpan.dataset.region = 'jumpto';
    srSpan.tabIndex = -1;

    settingsBtnWrapper.append(settingsBtn, srSpan);

    const form = document.createElement('form');
    form.classList.add('mform');

    const helpBtn = document.createElement('a');
    helpBtn.classList.add(
        'ml-auto',
        'font-weight-normal',
        'z-index-1',
        'text-right'
    );
    helpBtn.style.setProperty('font-size', 'small');
    helpBtn.href = '#';
    const helpIcon = document.createElement('i');
    helpIcon.classList.add('fa', 'fa-question-circle', 'fa-fw');
    helpBtn.append(helpIcon, $t('modals.help.title').toString());

    let fieldsetCounter = 0;
    let currentFieldset;

    /**
     * @param {string} name
     */
    const createSettingsFieldset = name => {
        const fieldset = createFieldset(
            name,
            `settings-collapseElement-${fieldsetCounter}`,
            `settings-containerElement-${fieldsetCounter}`
        );
        currentFieldset = fieldset.fieldset;
        form.append(currentFieldset);

        // on first fieldset, show the help button
        if (!fieldsetCounter) fieldset.heading.append(helpBtn);

        // all fieldsets are collapsed by default except the first one
        if (!fieldsetCounter) {
            fieldset.collapseBtn.classList.remove('collapsed');
            fieldset.container.classList.add('show');
        }

        fieldsetCounter++;
    };

    let prevSettingIsString;

    SETTINGS.forEach(setting => {
        // if setting is a string, use this as a heading / fieldset
        if (typeof setting === 'string') {
            if (!prevSettingIsString) {
                createSettingsFieldset(setting);
            } else {
                const p = document.createElement('p');
                p.classList.add('col-12');
                p.innerHTML = mdToHtml(setting);
                currentFieldset.querySelector('.fcontainer')?.append(p);
            }
            prevSettingIsString = true;
        }
        // otherwise, add the settings inputs
        else {
            prevSettingIsString = false;
            if (!currentFieldset) createSettingsFieldset('');

            const settingRow = document.createElement('div');
            settingRow.classList.add('form-group', 'row', 'fitem');

            const labelWrapper = document.createElement('div');
            labelWrapper.classList.add(
                'col-md-5',
                'col-form-label',
                'd-flex',
                'pb-0',
                'pt-0'
            );
            const label = document.createElement('label');
            label.classList.add('d-inline', 'word-break');
            label.textContent = setting.title;
            setting.setLabel(label);

            const descWrapper = document.createElement('div');
            descWrapper.classList.add(
                'form-label-addon',
                'd-flex',
                'align-items-center',
                'align-self-start'
            );
            const descBtn = document.createElement('a');
            descBtn.classList.add('btn', 'btn-link', 'p-0');
            descBtn.dataset.container = 'body';
            descBtn.dataset.toggle = 'popover';
            descBtn.dataset.placement = 'right';
            descBtn.dataset.content = setting.description;
            descBtn.dataset.trigger = 'focus';
            descBtn.dataset.originalTitle = '';
            descBtn.title = '';
            descBtn.tabIndex = 0;
            const descIcon = document.createElement('i');
            descIcon.classList.add(
                'icon',
                'fa',
                'fa-question-circle',
                'text-info',
                'fa-fw'
            );
            descBtn.append(descIcon);
            descWrapper.append(descBtn);
            labelWrapper.append(label, descWrapper);

            const inputWrapper = document.createElement('div');
            inputWrapper.classList.add(
                'col-md-7',
                'form-inline',
                'align-items-start',
                'felement',
                'overflow-hidden'
            );
            inputWrapper.dataset.setting = setting.id;
            inputWrapper.append(setting.formControl);

            label.htmlFor = setting.inputId;

            settingRow.append(labelWrapper, inputWrapper);
            currentFieldset.querySelector('.fcontainer')?.append(settingRow);
        }
    });

    const updateDisabledStates = () => {
        SETTINGS.forEach(setting => {
            if (typeof setting === 'string') return;

            setting.toggleDisabled(settingsById);
        });
    };

    form.addEventListener('change', updateDisabledStates);

    /** @type {string} */
    let changelogHtml;

    const changelogCache = 1000 * 60 * 5; // Cache for 5 minutes

    /** @type {() => Promise<string>} */
    const getChangelogHtml = () =>
        changelogHtml ?
            Promise.resolve(changelogHtml)
        :   fetch(
                rawGithubPath(
                    `CHANGELOG.md?_=${Math.floor(Date.now() / changelogCache)}`
                )
            )
                .then(res => res.text())
                .then(md =>
                    md
                        .replace(/^#\s.*/g, '')
                        .replace(/(?<=\n)(?=^##\s)/gm, '---\n\n')
                )
                .then(md => mdToHtml(md, 3))
                .then(html => {
                    changelogHtml = html;
                    setTimeout(() => (changelogHtml = ''), changelogCache);
                    return html;
                });

    document
        .querySelector('#usernavigation .usermenu-container')
        ?.before(settingsBtnWrapper);
    require(['core/modal_factory', 'core/modal_events'], (
        { create, types },
        ModalEvents
    ) =>
        create({
            type: types.SAVE_CANCEL,
            large: true,
            scrollable: true,
            title: `${githubLink('').outerHTML} Better-Moodle:&nbsp;${$t(
                'modals.settings.title'
            )}`,
            body: form,
        }).then(modal => {
            updateDisabledStates();

            const updateBadge = document.createElement('div');
            updateBadge.classList.add('count-container');

            const updateCheck = () =>
                updateAvailable().then(available => {
                    if (available) {
                        versionSpan.before(updateBtn);
                        // region Feature: general.updateNotification
                        if (getSetting('general.updateNotification')) {
                            settingsBtn.append(updateBadge);
                        }
                        // endregion
                    } else {
                        updateBtn.remove();
                        updateBadge.remove();
                    }
                    currentCode.textContent = currentScriptVersion.join('.');
                    latestCode.textContent = latestScriptVersion.join('.');
                });

            // open the modal on click onto the settings button
            settingsBtnWrapper.addEventListener('click', () => {
                updateCheck().then();
                modal.show();
            });

            // region link to moodle settings
            // add a link to moodle settings
            const moodleSettingsLink = document.createElement('a');
            moodleSettingsLink.href = '/user/preferences.php';
            moodleSettingsLink.target = '_blank';
            moodleSettingsLink.textContent = $t(
                'modals.settings.moodleSettings'
            ).toString();
            moodleSettingsLink.style.setProperty('padding', '1rem 1rem');
            moodleSettingsLink.style.setProperty(
                'margin',
                '-.8rem -.8rem -.8rem auto'
            );
            moodleSettingsLink.style.setProperty('font-size', 'small');
            modal.getTitle()[0].after(moodleSettingsLink);
            modal.header[0]
                .querySelector('button.close')
                ?.style.setProperty('margin-left', '0');
            // endregion

            // region save & cancel
            // handle the save & cancel buttons
            modal.getRoot().on(ModalEvents.save, () => {
                SETTINGS.forEach(setting => {
                    if (typeof setting === 'string') return;

                    setting.saveInput();
                });

                window.location.reload();
            });
            modal.getRoot().on(ModalEvents.cancel, () => {
                SETTINGS.forEach(setting => {
                    if (!setting.id) return;

                    setting.resetInput();
                });
                updateDarkReaderMode();
            });
            // endregion

            // region version span & update btn
            // add a small note about current and latest script version
            const versionSpan = document.createElement('span');
            versionSpan.classList.add('small', 'text-right');

            const currentCode = document.createElement('code');
            currentCode.textContent = currentScriptVersion.join('.');
            const latestCode = document.createElement('code');
            latestCode.textContent = latestScriptVersion.join('.');

            versionSpan.append(
                `${$t('modals.settings.installedVersion')}:\xa0`,
                currentCode,
                document.createElement('br'),
                `${$t('modals.settings.latestVersion')}:\xa0`,
                latestCode
            );

            const updateBtn = document.createElement('a');
            updateBtn.classList.add('btn-primary', 'btn-sm');
            updateBtn.href = '#';
            updateBtn.textContent = $t('modals.settings.updateBtn').toString();

            updateBtn.addEventListener('click', e => {
                e.preventDefault();
                create({
                    type: types.ALERT,
                    title: $t('modals.update.title'),
                    body: $t('modals.update.content'),
                }).then(modal => {
                    getChangelogHtml().then(html => {
                        const el = document.createElement('div');
                        el.innerHTML = html;

                        const currentVersionHeadingId = PREFIX(
                            crypto.randomUUID()
                        );

                        for (const heading of el.querySelectorAll('h4')) {
                            if (
                                heading.textContent
                                    .trim()
                                    .startsWith(currentScriptVersion.join('.'))
                            ) {
                                heading.id = currentVersionHeadingId;
                                break;
                            }
                        }

                        el.querySelectorAll(
                            `#${currentVersionHeadingId}, #${currentVersionHeadingId} ~ *`
                        ).forEach(child => child.remove());

                        modal.getBody().append(el);
                    });
                    modal.show();
                });
                open(GM_info.script.downloadURL, '_self');
            });

            updateCheck().then();

            const updateSetting = modal
                .getBody()[0]
                .querySelector(
                    '.felement[data-setting="general.updateNotification"]'
                );
            if (updateSetting) {
                updateSetting.classList.add('justify-content-between');
                updateSetting.append(versionSpan);
            }
            // endregion

            const footerBtnGroup = document.createElement('div');
            footerBtnGroup.classList.add('btn-group', 'mr-auto');

            footerBtnGroup.id = PREFIX('settings-footer-btn-group');

            GM_addStyle(`
/* show button text only on hover */
#${footerBtnGroup.id} > :where(button, a) > span {
    font-size: 0;
    transition: font-size 0.5s;
}
#${footerBtnGroup.id} > :where(button, a):hover > span {
    font-size: unset;
}
`);

            modal.getFooter()[0].prepend(footerBtnGroup);

            // region changelog
            const changelogBtn = githubLink('/blob/main/CHANGELOG.md', false);
            changelogBtn.classList.add('btn', 'btn-outline-primary');
            const changelogIcon = document.createElement('i');
            changelogIcon.classList.add('fa', 'fa-history', 'fa-fw');
            const changelogText = document.createElement('span');
            changelogText.textContent = $t('modals.changelog').toString();
            changelogBtn.append(changelogIcon, changelogText);

            changelogBtn.addEventListener('click', e => {
                e.preventDefault();
                create({
                    type: types.ALERT,
                    large: true,
                    scrollable: true,
                    title: `${
                        githubLink('/blob/main/CHANGELOG.md').outerHTML
                    } Better-Moodle:&nbsp;${$t('modals.changelog')}`,
                    body: getChangelogHtml(),
                }).then(modal => modal.show());
            });
            footerBtnGroup.append(changelogBtn);
            // endregion

            // region help button
            helpBtn.addEventListener('click', e => {
                e.preventDefault();
                create({
                    type: types.ALERT,
                    large: true,
                    scrollable: true,
                    title: $t('modals.help.title'),
                    body: mdToHtml(
                        $t('modals.help.content', {
                            faqLink: githubPath('#faq'),
                            mailAdress: cntctAdr,
                            mailLinkHelp: getEmail(
                                `Better Moodle: ${$t(
                                    'modals.help.mails.help.subject'
                                )}`,
                                $t('modals.help.mails.help.content')
                            ),
                            githubIssueBug: githubPath(
                                '/issues/new?labels=bug&template=bug.yml&title=%5BBUG%5D%3A+'
                            ),
                            mailLinkBug: getEmail(
                                `Better Moodle: ${$t(
                                    'modals.help.mails.bug.subject'
                                )}`,
                                $t('modals.help.mails.bug.content', {
                                    currentVersion:
                                        currentScriptVersion.join('.'),
                                })
                            ),
                            githubIssueFeature: githubPath(
                                '/issues/new?labels=&template=feature.yml&title=%5BFeature+request%5D%3A+'
                            ),
                            mailLinkFeature: getEmail(
                                `Better Moodle: ${$t(
                                    'modals.help.mails.feature.subject'
                                )}`,
                                $t('modals.help.mails.feature.content')
                            ),
                        }).trim(),
                        3
                    ),
                }).then(modal => {
                    modal.setButtonText('cancel', $t('modals.help.close'));
                    modal.show();
                });
            });
            // endregion

            // region export
            const exportBtn = document.createElement('button');
            exportBtn.classList.add('btn', 'btn-outline-primary');

            const exportIcon = document.createElement('i');
            exportIcon.classList.add('fa', 'fa-download', 'fa-fw');
            const exportText = document.createElement('span');
            exportText.textContent = $t('modals.settings.export').toString();
            exportBtn.append(exportIcon, exportText);

            exportBtn.addEventListener('click', e => {
                e.preventDefault();
                const config = Object.fromEntries(
                    GM_listValues().map(key => [key, GM_getValue(key)])
                );
                const blob = new Blob([JSON.stringify(config)], {
                    type: 'application/json',
                });
                const link = document.createElement('a');
                link.download = 'better-moodle-settings.json';
                link.href = URL.createObjectURL(blob);
                link.click();
            });
            footerBtnGroup.append(exportBtn);
            // endregion

            // region import
            const importBtn = document.createElement('button');
            importBtn.classList.add('btn', 'btn-outline-primary');

            const importIcon = document.createElement('i');
            importIcon.classList.add('fa', 'fa-upload', 'fa-fw');
            const importText = document.createElement('span');
            importText.textContent = $t('modals.settings.import').toString();
            importBtn.append(importIcon, importText);

            importBtn.addEventListener('click', e => {
                e.preventDefault();

                const importInput = document.createElement('input');
                importInput.type = 'file';
                importInput.accept = '.json';
                importInput.addEventListener('change', () => {
                    const file = importInput.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.addEventListener('load', () => {
                        const config = JSON.parse(reader.result);
                        Object.entries(config).forEach(([key, value]) =>
                            GM_setValue(key, value)
                        );
                        window.location.reload();
                    });
                    reader.readAsText(file);
                });
                importInput.click();
            });
            footerBtnGroup.append(importBtn);
            // endregion
        }));
});
// endregion

// region Bugfix: Adjust amount of "recently accessed courses" on dashboard when opening / closing drawers
if (isDashboard) {
    ready(() =>
        // TODO: find a way to make moodle init the drawers to publish the PubSub events itself
        require(['core/pubsub'], PubSub => {
            const update = open => {
                PubSub.publish('nav-drawer-toggle-start', open);
                setTimeout(
                    () => PubSub.publish('nav-drawer-toggle-end', open),
                    100
                );
            };

            // TODO: Find a way to get event types via require(['theme_boost/drawers'], ({eventTypes}) => [...]) that does not break moodle;
            window.addEventListener('theme_boost/drawers:shown', () =>
                update(true)
            );
            window.addEventListener('theme_boost/drawers:hidden', () =>
                update(false)
            );
        })
    );
}
// endregion
