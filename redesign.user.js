// ==UserScript==
// @name            🎓️ UzL: better-moodle
// @namespace       https://uni-luebeck.de
// @                x-release-please-start-version
// @version         1.21.1
// @                x-release-please-start-end
// @author          Jan (jxn_30)
// @description:de  Verbessert dieses seltsame Design, das Moodle 4 mit sich bringt
// @homepage        https://github.com/jxn-30/better-moodle
// @homepageURL     https://github.com/jxn-30/better-moodle
// @icon            https://www.uni-luebeck.de/favicon.ico
// @updateURL       https://github.com/jxn-30/better-moodle/raw/main/redesign.user.js
// @downloadURL     https://github.com/jxn-30/better-moodle/raw/main/redesign.user.js
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
// ==/UserScript==

/* global M, require */

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
            messages: {
                _title: 'Mitteilungen',
                sendHotkey: {
                    name: 'Mitteilungen per Tastenkombination absenden',
                    description:
                        'Ermöglicht das Absenden von Mitteilungen per Tastenkombination (z. B. Strg + Enter).',
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
            messages: {
                _title: 'Messages',
                sendHotkey: {
                    name: 'Send messages by hotkey',
                    description:
                        'Allows messages to be sent using a key combination (e.g. Ctrl + Enter).',
                },
            },
        },
    },
};
// endregion

// region Helper functions
const PREFIX = str => `better-moodle-${str}`;
const getSettingKey = id => PREFIX(`settings.${id}`);
const getSetting = id =>
    GM_getValue(getSettingKey(id), SETTINGS.find(s => s.id === id)?.default);

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
    toggleBtn.dataset.toggle = 'tooltip';
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
        document
            .querySelector('#page .drawer-toggles')
            ?.append(toggleBtnWrapper);

        callback(content, header);
    });
};

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
                latestMinor > currentMinor || // minor update
                latestPatch > currentPatch // patch update
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
            html += replacement
                ? replacement[1] +
                  `\n${b}`
                      .split(replacement[0])
                      .slice(1)
                      .map(replacement[3] ? escape : inlineEscape)
                      .join(replacement[3] || '</li>\n<li>') +
                  replacement[2]
                : firstChar === '#'
                  ? `<h${(i =
                        b.indexOf(' ') + (headingStart - 1))}>${inlineEscape(
                        b.slice(i + 1 - (headingStart - 1))
                    )}</h${i}>`
                  : firstChar === '<'
                    ? b
                    : b.startsWith('---')
                      ? '<hr />'
                      : `<p>${inlineEscape(b)}</p>`;
        });

    return html;
};

const noExternalLinkIconClass = PREFIX('no-external-icon');

const githubPath = path => `https://github.com/jxn-30/better-moodle${path}`;
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
    fetch('/my/courses.php')
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
        // await fetch('http://localhost:3000/events.json') // this is for testing locally (npx serve --cors)
        fetch(
            'https://raw.githubusercontent.com/jxn-30/better-moodle/main/events.json'
        )
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

const $t = (key, args = {}) => {
    const t =
        key
            .split('.')
            .reduce(
                (prev, current) => (prev || TRANSLATIONS[MOODLE_LANG])[current],
                TRANSLATIONS[MOODLE_LANG]
            ) ?? key;
    if (t === key) {
        console.warn(
            `Better-Moodle: Translation for key "${key}" on locale ${MOODLE_LANG} not found!`
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
     * @returns {Speiseplan.speisen}
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
                url: `https://studentenwerk.sh/${MOODLE_LANG}/${
                    localizedPath[MOODLE_LANG]
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

    /** @type {SpeiseplanFilter} */
    const filters = {};
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
    `);
// endregion

// region Settings
/**
 * @typedef {Object} BaseSetting
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {(settings: Record<string, boolean>) => boolean} [disabled]
 */

/**
 * @typedef {BaseSetting} BooleanSetting
 * @extends BaseSetting
 * @property {typeof Boolean} type
 * @property {boolean} default
 */

/**
 * @typedef {BaseSetting} NumberSetting
 * @extends BaseSetting
 * @property {typeof Number} type
 * @property {number} default
 */

/**
 * @typedef {BaseSetting} StringSetting
 * @extends BaseSetting
 * @property {typeof String} type
 * @property {string} default
 */

/**
 * @typedef {BaseSetting} SelectSetting
 * @extends BaseSetting
 * @property {typeof HTMLSelectElement} type
 * @property {string[] | string} default
 * @property {(() => Promise<{key: string, title: string}[]>) | {key: string, title: string}[]} options
 * @property {boolean} multiselect
 */

/** @typedef {BooleanSetting | NumberSetting | StringSetting | SelectSetting} Setting */

/** @type {Array<Setting | string>} */
const SETTINGS = [
    $t('settings.general._title'),
    {
        id: 'general.updateNotification',
        type: Boolean,
        default: true,
    },
    {
        id: 'general.fullwidth',
        type: Boolean,
        default: true,
    },
    {
        id: 'general.externalLinks',
        type: Boolean,
        default: true,
    },
    {
        id: 'general.truncatedTexts',
        type: Boolean,
        default: true,
    },
    {
        id: 'general.bookmarkManager',
        type: Boolean,
        default: false,
    },
    {
        id: 'general.noDownload',
        type: Boolean,
        default: false,
    },
    {
        id: 'general.eventAdvertisements',
        type: Boolean,
        default: true,
    },
    {
        id: 'general.christmasCountdown',
        type: Boolean,
        default: false,
    },
    { id: 'general.speiseplan', type: Boolean, default: false },
    $t('settings.dashboard._title'),
    // {Layout anpassen}
    {
        id: 'dashboard.~layoutPlaceholder',
        type: String,
        default: 'Coming soon...',
        disabled: () => true,
    },
    {
        id: 'dashboard.courseListFilter',
        type: HTMLSelectElement,
        options: getCourseGroupingOptions,
        default: '_sync',
        multiselect: false,
    },
    $t('settings.myCourses._title'),
    {
        id: 'myCourses.boxesPerRow',
        type: Number,
        default: 4,
        attributes: {
            min: 1,
            max: 10,
        },
    },
    {
        id: 'myCourses.navbarDropdown',
        type: Boolean,
        default: true,
    },
    {
        id: 'myCourses.navbarDropdownFilter',
        type: HTMLSelectElement,
        options: getCourseGroupingOptions,
        default: '_sync',
        multiselect: false,
        disabled: settings => !settings['myCourses.navbarDropdown'],
    },
    $t('settings.courses._title'),
    {
        id: 'courses.grades',
        type: Boolean,
        default: true,
    },
    {
        id: 'courses.gradesNewTab',
        type: Boolean,
        default: false,
        disabled: settings => !settings['courses.grades'],
    },
    {
        id: 'courses.collapseAll',
        type: Boolean,
        default: true,
    },
    {
        id: 'courses.imgMaxWidth',
        type: Boolean,
        default: true,
    },
    {
        id: 'courses.imageZoom',
        type: Boolean,
        default: true,
    },
    {
        id: 'courses.hideSelfEnrolHint',
        type: Boolean,
        default: false,
    },
    $t('settings.messages._title'),
    {
        id: 'messages.sendHotkey',
        type: HTMLSelectElement,
        options: () =>
            Promise.resolve([
                {
                    key: '',
                    title: '[Deaktiviert] Kein Absenden per Tastenkombination',
                },
                {
                    key: 'shiftEnter',
                    title: 'Umschalt + Enter',
                },
                {
                    key: 'ctrlEnter',
                    title: 'Strg + Enter',
                },
            ]),
        default: '',
    },
];
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
                const httpsUrl = url.startsWith('https://')
                    ? url
                    : `https://${url}`;
                const bookmark = document.createElement('a');
                bookmark.classList.add('dropdown-item');
                bookmark.href = httpsUrl;
                bookmark.textContent = title;
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

            const form = document.createElement('form');
            form.classList.add('mform');
            form.id = PREFIX('bookmark-manager-form');
            const container = document.createElement('div');
            container.classList.add('fcontainer');

            if (!manageFormStyleAdded) {
                GM_addStyle(`
#${form.id} {
    color: inherit;
}

#${form.id} > .fcontainer :is(.fitem:first-child [data-button="up"], .fitem:last-child [data-button="down"]) {
    opacity: 0.65;
    pointer-events: none;
    cursor: not-allowed;
}`);
                manageFormStyleAdded = true;
            }

            const addFormItem = (title, url) => {
                const group = document.createElement('div');
                group.classList.add('form-group', 'row', 'fitem');
                const titleWrapper = document.createElement('div');
                titleWrapper.classList.add(
                    'col-md-4',
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
                    'col-md-8',
                    'form-inline',
                    'align-items-start',
                    'felement',
                    'input-group'
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

                const mobileLinebreak = document.createElement('div');
                mobileLinebreak.classList.add('w-100', 'd-lg-none');

                const btns = document.createElement('div');
                btns.classList.add(
                    'btn-group',
                    'ml-auto',
                    'input-group-append'
                );
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
                urlWrapper.append(httpsAddon, urlInput, mobileLinebreak, btns);

                group.append(titleWrapper, urlWrapper);

                container.append(group);
            };

            GM_getValue(BOOKMARKS_STORAGE, []).forEach(({ title, url }) =>
                addFormItem(title, url)
            );

            const addBookmarkBtn = document.createElement('button');
            addBookmarkBtn.classList.add(
                'btn',
                'btn-outline-success',
                'd-block',
                'ml-auto'
            );
            const addIcon = document.createElement('i');
            addIcon.classList.add('fa', 'fa-plus', 'fa-fw');
            addBookmarkBtn.append(addIcon);

            addBookmarkBtn.addEventListener('click', e => {
                e.preventDefault();
                addFormItem('', '');
            });

            form.append(container, addBookmarkBtn);

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
            now < firstChristmasDay
                ? getDayOfYear(thisYearChristmas) - todayDayOfYear
                : getDayOfYear(thisYearLastDay) -
                  todayDayOfYear +
                  getDayOfYear(nextYearChristmas);

        textSpan.innerHTML = textSpanClone.innerHTML = daysToChristmas
            ? $t(`christmasCountdown.countdown.${Number(!!daysToChristmas)}`, {
                  days: daysToChristmas,
              }).toString()
            : $t('christmasCountdown.christmas').toString();

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
`);

    const createDayFieldset = (day, speisen, filter, firstFieldset) => {
        const date = new Date(day);
        const { fieldset, container, collapseBtn } = createFieldset(
            date.toLocaleString(MOODLE_LANG, {
                weekday: 'long',
                year: undefined,
                month: '2-digit',
                day: '2-digit',
            }),
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
                allergenSpan.textContent += `${allergenFilter.abk}:\xa0${allergenFilter.title}`;
                allergene.append(allergenSpan);
            });
            if (speise.allergene.length) speiseCell.append(allergene);
            const zusatzstoffe = document.createElement('div');
            zusatzstoffe.classList.add(abkClass, 'text-muted');
            speise.zusatzstoffe.forEach(zusatzstoff => {
                const zusatzstoffFilter = filter.zusatzstoffe[zusatzstoff];
                const zusatzstoffSpan = document.createElement('span');
                zusatzstoffSpan.textContent += `${zusatzstoffFilter.abk}:\xa0${zusatzstoffFilter.title}`;
                zusatzstoffe.append(zusatzstoffSpan);
            });
            if (speise.zusatzstoffe.length) speiseCell.append(zusatzstoffe);

            const artenCell = row.insertCell();
            artenCell.classList.add(artenClass);
            speise.arten.forEach(art => {
                const img = document.createElement('img');
                const artFilter = filter.arten[art];
                img.src = artFilter.img;
                img.alt = img.title = artFilter.title;
                artenCell.append(img);
            });

            const preiseCell = row.insertCell();
            preiseCell.classList.add(preiseClass);
            speise.preise.forEach(preis => {
                const preisEl = document.createElement('span');
                preisEl.textContent = preis.toLocaleString(MOODLE_LANG, {
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
                studiwerkLink.href = `https://studentenwerk.sh/${MOODLE_LANG}/${
                    { de: 'mensen-in-luebeck', en: 'food-overview' }[
                        MOODLE_LANG
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
        link.append(calcItem, `\xa0${$t('courses.grades')}`);

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
                        collapseIcon.classList.contains('collapsed')
                            ? ':not(.collapsed)'
                            : '.collapsed'
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
            ...(course.shortname
                ? [shortName, document.createElement('br')]
                : []),
            fullName
        );
        anchor.title = anchor.textContent;
        anchor.title = anchor.textContent;

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
            sidebarGroupingSetting === '_sync'
                ? await getCourseGroupings().then(
                      courseGroupings =>
                          courseGroupings.find(grouping => grouping.active) ??
                          courseGroupings[0]
                  )
                : JSON.parse(sidebarGroupingSetting);

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
            dropdownGroupingSetting === '_sync'
                ? await getCourseGroupings().then(
                      courseGroupings =>
                          courseGroupings.find(grouping => grouping.active) ??
                          courseGroupings[0]
                  )
                : JSON.parse(dropdownGroupingSetting);

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
    helpBtn.classList.add('ml-auto', 'font-weight-normal', 'z-index-1');
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

    SETTINGS.forEach((setting, index) => {
        // if setting is a string, use this as a heading / fieldset
        if (typeof setting === 'string') {
            createSettingsFieldset(setting);
        }
        // otherwise, add the settings inputs
        else {
            const SETTING_KEY = getSettingKey(setting.id);

            if (!currentFieldset) createSettingsFieldset('');

            const settingRow = document.createElement('div');
            settingRow.classList.add('form-group', 'row', 'fitem');

            const labelWrapper = document.createElement('div');
            labelWrapper.classList.add(
                'col-md-4',
                'col-form-label',
                'd-flex',
                'pb-0',
                'pt-0'
            );
            const label = document.createElement('label');
            label.classList.add('d-inline', 'word-break');
            label.textContent = $t(`settings.${setting.id}.name`).toString();

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
            descBtn.dataset.content = $t(
                `settings.${setting.id}.description`
            ).toString();
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
                'col-md-8',
                'form-inline',
                'align-items-start',
                'felement'
            );
            inputWrapper.dataset.setting = setting.id;

            const value = GM_getValue(SETTING_KEY, setting.default);

            const inputType = {
                [HTMLSelectElement]: 'select',
            };

            /** @type{HTMLInputElement | HTMLSelectElement} */
            const input = document.createElement(
                inputType[setting.type] || 'input'
            );
            /** @type{HTMLElement} */
            let formControl;

            input.id = PREFIX(`settings-input-${index}`);

            let showInput = true;

            switch (setting.type) {
                case Boolean: {
                    formControl = document.createElement('div');
                    formControl.classList.add(
                        'custom-control',
                        'custom-switch'
                    );
                    input.classList.add('custom-control-input');
                    input.type = 'checkbox';
                    input.checked = value;
                    const switchLabel = document.createElement('label');
                    switchLabel.setAttribute('for', input.id);
                    switchLabel.classList.add('custom-control-label');
                    switchLabel.textContent = ' ';
                    formControl.append(input, switchLabel);
                    break;
                }
                case Number: {
                    input.classList.add('form-control');
                    input.type = 'number';
                    input.value = value;
                    break;
                }
                case String:
                    input.classList.add('form-control');
                    input.type = 'text';
                    input.value = value;
                    break;
                case HTMLSelectElement: {
                    input.classList.add('custom-select');
                    input.dataset.initialValue = value;
                    /** @type {Promise<{key: string, title: string}[]>} **/
                    const options = Array.isArray(setting.options)
                        ? new Promise(resolve => resolve(setting.options))
                        : setting.options();
                    options.then(options =>
                        options.forEach(option => {
                            const optionEl = document.createElement('option');
                            optionEl.value = option.key;
                            optionEl.textContent = option.title;

                            if (option.key === value) {
                                optionEl.selected = true;
                            }

                            input.append(optionEl);
                        })
                    );
                    break;
                }
                default: {
                    showInput = false;
                }
            }

            if (showInput) {
                label.setAttribute('for', input.id);
                input.name = setting.id;

                if (setting.attributes) {
                    Object.entries(setting.attributes).forEach(
                        ([key, value]) => {
                            input.setAttribute(key, value);
                        }
                    );
                }
            } else {
                label.classList.add('text-muted');
            }

            if (formControl) inputWrapper.append(formControl);
            else if (showInput) inputWrapper.append(input);

            settingRow.append(labelWrapper, inputWrapper);
            currentFieldset.querySelector('.fcontainer')?.append(settingRow);
        }
    });

    const getFormValue = () => {
        const formValue = {};
        SETTINGS.forEach(({ id, type }) => {
            if (!id) return;

            switch (type) {
                case Boolean:
                    formValue[id] = form[id]?.checked;
                    break;
                default:
                    formValue[id] = form[id]?.value;
            }

            if (typeof formValue[id] === 'undefined') delete formValue[id];
        });
        return formValue;
    };

    const updateDisabledStates = () => {
        const settings = getFormValue();
        SETTINGS.forEach(({ id, disabled }) => {
            if (!id || !disabled || !form[id]) return;

            const isDisabled = disabled(settings);
            const classMethod = isDisabled ? 'add' : 'remove';
            form[id].disabled = isDisabled;
            form[id].classList[classMethod]('disabled');
            form.querySelectorAll(`label[for="${form[id].id}"]`).forEach(
                label => label.classList[classMethod]('text-muted')
            );
        });
    };

    updateDisabledStates();
    form.addEventListener('change', updateDisabledStates);

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
            const updateBadge = document.createElement('div');
            updateBadge.classList.add('count-container');

            const updateCheck = () =>
                updateAvailable().then(available => {
                    if (available) {
                        versionSpan.append(updateBtn);
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
                Object.entries(getFormValue()).forEach(([setting, value]) =>
                    GM_setValue(getSettingKey(setting), value)
                );

                window.location.reload();
            });
            modal.getRoot().on(ModalEvents.cancel, () =>
                SETTINGS.forEach(setting => {
                    if (!setting.id) return;

                    const input = form[setting.id];
                    if (!input) return;

                    const value = getSetting(setting.id);

                    switch (setting.type) {
                        case Boolean:
                            input.checked = value;
                            break;
                        default:
                            input.value = value;
                    }
                })
            );
            // endregion

            // region version span & update btn
            // add a small note about current and latest script version
            const versionSpan = document.createElement('span');
            versionSpan.classList.add('small', 'ml-auto');

            const currentCode = document.createElement('code');
            currentCode.textContent = currentScriptVersion.join('.');
            const latestCode = document.createElement('code');
            latestCode.textContent = latestScriptVersion.join('.');

            versionSpan.append(
                `${$t('modals.settings.installedVersion')}:\xa0`,
                currentCode,
                ' ',
                `${$t('modals.settings.installedVersion')}:\xa0`,
                latestCode
            );

            const updateBtn = document.createElement('a');
            updateBtn.classList.add('btn-primary', 'btn-sm', 'ml-2');
            updateBtn.href = '#';
            updateBtn.textContent = $t('modals.settings.updateBtn').toString();

            updateBtn.addEventListener('click', e => {
                e.preventDefault();
                create({
                    type: types.ALERT,
                    title: $t('modals.update.title'),
                    body: $t('modals.update.content'),
                }).then(modal => modal.show());
                open(GM_info.script.updateURL, '_self');
            });

            updateCheck().then();

            modal
                .getBody()[0]
                .querySelector(
                    '.felement[data-setting="general.updateNotification"]'
                )
                ?.append(versionSpan);
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
            const changelogBtn = githubLink(
                '/better-moodle/blob/main/CHANGELOG.md',
                false
            );
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
                    body: fetch(
                        `https://raw.githubusercontent.com/jxn-30/better-moodle/main/CHANGELOG.md?_=${
                            Math.floor(Date.now() / (1000 * 60 * 5)) // Cache for 5 minutes
                        }`
                    )
                        .then(res => res.text())
                        .then(md =>
                            md
                                .replace(/^#\s.*/g, '')
                                .replace(/(?<=\n)(?=^##\s)/gm, '---\n\n')
                        )
                        .then(md => mdToHtml(md, 3)),
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
