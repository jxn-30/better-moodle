// ==UserScript==
// @name            🎓️ UzL: Better Moodle
// @namespace       https://uni-luebeck.de
// @                x-release-please-start-version
// @version         1.12.1
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
// ==/UserScript==

/* global M, require */

// region Helper functions
const PREFIX = str => `better-moodle-${str}`;
const getSettingKey = id => PREFIX(`settings.${id}`);
const getSetting = id =>
    GM_getValue(getSettingKey(id), SETTINGS.find(s => s.id === id)?.default);

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
    closeBtn.title = 'Blockleiste schließen';
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
    toggleBtn.title = 'Blockleiste öffnen';
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
/** @type {Promise<boolean>} */
const updateAvailable = fetch(
    'https://api.github.com/repos/jxn-30/better-moodle/releases/latest'
)
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

        latestScriptVersion.splice(0, 3, latestMajor, latestMinor, latestPatch);
        Object.freeze(latestScriptVersion);

        currentScriptVersion.splice(
            0,
            3,
            currentMajor,
            currentMinor,
            currentPatch
        );
        Object.freeze(currentScriptVersion);

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

const githubLink = (path, icon = true, iconAndExternalIcon = false) => {
    const link = document.createElement('a');
    link.href = `https://github.com/jxn-30/better-moodle${path}`;
    link.target = '_blank';

    if (icon) {
        const icon = document.createElement('i');
        icon.classList.add('fa', 'fa-github', 'fa-fw');
        link.appendChild(icon);

        if (!iconAndExternalIcon) {
            link.classList.add(PREFIX('no-external-icon'));
        }
    }

    return link;
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
body.dir-ltr a.${PREFIX('no-external-icon')}::after,
body.dir-rtl a.${PREFIX('no-external-icon')}::before {
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

/** @typedef {BooleanSetting | NumberSetting} Setting */

/** @type {Array<Setting | string>} */
const SETTINGS = [
    'Allgemeine Einstellungen',
    {
        id: 'general.updateNotification',
        name: 'Benachrichtigung bei better-moodle Updates',
        description:
            'Zeigt einen kleinen roten Punkt bei den Zahnrädern in der Navigationsleiste an, wenn es ein Update für better-moodle gibt.',
        type: Boolean,
        default: true,
    },
    {
        id: 'general.fullwidth',
        name: 'Volle Breite',
        description:
            'Entfernt den seltsamen weißen Rand und sorgt dafür, dass die Seiten die volle Breite nutzen.',
        type: Boolean,
        default: true,
    },
    {
        id: 'general.externalLinks',
        name: 'Externe Links',
        description:
            'Sorgt dafür, dass externe Links immer automatisch in einem neuen Tab geöffnet werden.',
        type: Boolean,
        default: true,
    },
    {
        id: 'general.truncatedTexts',
        name: 'Abgeschnittene Texte',
        description:
            'Fügt ein Title-Attribut bei potentiell abgeschnittenen Texten hinzu, damit man per Maus-Hover den vollen Text lesen kann.',
        type: Boolean,
        default: true,
    },
    {
        id: 'general.bookmarkManager',
        name: 'Lesezeichen-Manager',
        description:
            'Aktiviert einen kleinen internen Lesezeichen-Manager, um direkt im Moodle zu bestimmten Orten zu springen.',
        type: Boolean,
        default: true,
    },
    {
        id: 'general.noDownload',
        name: 'Download unterbinden',
        description:
            'Verhindert das automatische Herunterladen von Dateien (insbesondere PDFs) wo immer möglich.',
        type: Boolean,
        default: false,
    },
    {
        id: 'general.christmasCountdown',
        name: 'Countdown bis Heiligabend 🎄',
        description:
            'Zeigt einen Countdown bis Heiligabend in der Navigationsleiste an.\nHierbei handelt es sich um eine kleine Hommage an den Mathe-Vorkurs.',
        type: Boolean,
        default: false,
    },
    'Dashboard',
    // {Layout anpassen}
    {
        id: 'dashboard.~layoutPlaceholder',
        name: 'Layout',
        description:
            'Hier sollst du mal das Layout anpassen können. Das ist aber leider noch nicht fertig. Bitte habe noch ein bisschen Geduld hiermit :)',
        type: String,
        default: 'Coming soon...',
        disabled: () => true,
    },
    'Meine Kurse',
    {
        id: 'myCourses.boxesPerRow',
        name: 'Kacheln pro Zeile',
        description:
            'Zahl der Kacheln pro Zeile auf der "Meine Kurse"-Seite, wenn die Ansicht auf "Kacheln" gestellt ist. (Ist bis zu einer Fenster-/Bildschirmbreite bis 840px aktiv)',
        type: Number,
        default: 4,
        attributes: {
            min: 1,
            max: 10,
        },
    },
    {
        id: 'myCourses.navbarDropdown',
        name: 'Dropdown in der Navigationsleiste',
        description:
            'Funktioniert den "Meine Kurse"-Link in eine Dropdown um, um einen schnellen Direktzugriff auf alle eigenen Kurse zu ermöglichen.',
        type: Boolean,
        default: true,
    },
    'Kurse',
    {
        id: 'courses.grades',
        name: 'Link zu Bewertungen in der Sidebar',
        description:
            'Zeigt einen Link zu den Bewertungen des Kurses in der linken Seitenleiste an.',
        type: Boolean,
        default: true,
    },
    {
        id: 'courses.gradesNewTab',
        name: 'Bewertungen in neuem Tab öffnen',
        description: 'Öffnet die Bewertungen standardmäßig einem neuen Tab.',
        type: Boolean,
        default: false,
        disabled: settings => !settings['courses.grades'],
    },
    {
        id: 'courses.collapseAll',
        name: 'Seitenleiste vollständig ein-/ausklappen',
        description:
            'Klappt alle Abschnitte in der Seitenleiste ein oder aus, wenn doppelt auf einen der Pfeile in der Seitenleiste geklickt wird.',
        type: Boolean,
        default: true,
    },
    {
        id: 'courses.imgMaxWidth',
        name: 'Bildüberlauf verhindern',
        description:
            'Verhindert, dass Bilder in den Kursen mehr als die komplette Breite einnehmen und damit ein horizontales Scrollen der Seite verursachen.',
        type: Boolean,
        default: true,
    },
    {
        id: 'courses.imageZoom',
        name: 'Bilder zoomen',
        description:
            'Zoomt ein Bild heran, wenn es angeklickt wird. So lassen sich kleine Bilder einfach per Knopfdruck vergrößert anzeigen.',
        type: Boolean,
        default: true,
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
        bookmarksIcon.title = bookmarksBtn.ariaLabel = 'Lesezeichen';
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
        addBookmarkBtn.textContent = 'Lesezeichen setzen';
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

            const titleInput = addFormItem('Bezeichnung');
            titleInput.value = document.title.replace(/\|.*?$/, '').trim();
            const urlInput = addFormItem('URL', 'https://');
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
                    title: 'Lesezeichen setzen',
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
        manageBookmarksBtn.textContent = 'Lesezeichen verwalten';
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
                titleInput.placeholder = 'Bezeichnung';
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
                urlInput.placeholder = 'URL / Link';

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
                    title: 'Lesezeichen bearbeiten',
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
    content: "Bislang sind keine Lesezeichen vorhanden!";
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

    const SCROLL_SPEED_MS_PER_PX = 100;
    const durationForPx = px => px * SCROLL_SPEED_MS_PER_PX;

    const navItem = document.createElement('div');
    navItem.classList.add('flex-shrink-1');
    navItem.style.setProperty('overflow', 'hidden');
    const navLink = document.createElement('a');
    navLink.classList.add('nav-link', 'position-relative');
    navLink.id = PREFIX('christmas-countdown-wrapper');
    const textSpan = document.createElement('span');
    const textSpanClass = PREFIX('christmas-countdown');
    textSpan.classList.add(textSpanClass);
    const textSpanClone = document.createElement('span');
    textSpanClone.classList.add(textSpanClass);
    const keyFrames = `${textSpanClass}-keyframes`;
    const scrollStartVar = '--christmas-countdown-scroll-start';
    const scrollEndVar = '--christmas-countdown-scroll-end';
    const scrollDurationVar = '--christmas-countdown-scroll-duration';

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

@keyframes ${keyFrames} {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(var(${scrollEndVar}));
    }
}
`);

    const updateCountdown = () => {
        const todayDayOfYear = getDayOfYear(now);
        const daysToChristmas =
            now < firstChristmasDay
                ? getDayOfYear(thisYearChristmas) - todayDayOfYear
                : getDayOfYear(thisYearLastDay) -
                  todayDayOfYear +
                  getDayOfYear(nextYearChristmas);

        textSpanClone.innerHTML = textSpan.innerHTML =
            (daysToChristmas
                ? `Noch&nbsp;<b>${daysToChristmas}</b>&nbsp;Tag${
                      daysToChristmas > 1 ? 'e' : ''
                  } bis Heiligabend.`
                : '🎄 Heute ist Heiligabend. Frohe Weihnachten! 🎄') +
            '\xa0'.repeat(5);

        updateScrollWidth();

        const nextUpdate = new Date();
        nextUpdate.setDate(now.getDate() + 1);
        nextUpdate.setHours(0, 0, 0, 0);
        setTimeout(updateCountdown, nextUpdate - now);
    };

    const updateScrollWidth = () => {
        const navLinkWidth = Math.floor(navLink.getBoundingClientRect().width);
        let textSpanWidth = Math.floor(textSpan.getBoundingClientRect().width);
        if (textSpanWidth <= navLinkWidth) {
            navLink.classList.remove('animated');
            textSpan.innerHTML = textSpan.innerHTML.replace(/(&nbsp;)+$/g, '');
        } else {
            navLink.classList.add('animated');

            textSpan.innerHTML = textSpan.innerHTML.replace(
                /(&nbsp;)*$/g,
                '\xa0'.repeat(5)
            );

            textSpanWidth = Math.floor(textSpan.getBoundingClientRect().width);

            navLink.style.setProperty(scrollEndVar, `-${textSpanWidth}px`);
            navLink.style.setProperty(
                scrollDurationVar,
                `${durationForPx(textSpanWidth)}ms`
            );
        }
    };

    updateCountdown();

    new ResizeObserver(updateScrollWidth).observe(navLink);

    navLink.append(textSpan, textSpanClone);
    navItem.append(navLink);
    ready(() => {
        document.getElementById('usernavigation')?.prepend(navItem);
        updateScrollWidth();
    });
}
// endregion

// region Feature: Dashboard right sidebar
// add a right sidebar with timeline and upcoming events on Dashboard
if (window.location.pathname === '/my/') {
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
        link.append(calcItem, ' Bewertungen');

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
ready(() => {
    if (window.location.pathname.startsWith('/login/')) return;

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

        addDropdownItem({
            fullname: '[Meine Kurse]',
            shortname: '',
            viewurl: myCoursesLink,
        });
    }

    // add a left sidebar
    if (window.location.pathname === '/my/') {
        createSidebar(
            'dashboard-left',
            'left',
            'graduation-cap',
            (content, header) => {
                sidebarContent = content;

                // add the my-courses link as a sidebar header
                const myCoursesLink = document.createElement('a');
                myCoursesLink.textContent = 'Meine Kurse';
                myCoursesLink.href = '/my/courses.php';
                myCoursesLink.classList.add('w-100', 'text-center');
                header.append(myCoursesLink);
            }
        );
    }

    // fetch the courses
    require(['core_course/repository'], ({
        getEnrolledCoursesByTimelineClassification,
    }) =>
        getEnrolledCoursesByTimelineClassification(
            'all',
            0,
            0,
            'shortname'
        ).then(({ courses }) =>
            courses.forEach(course => {
                addDropdownItem(course);
                addSidebarItem(course);
            })
        ));
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

// region Settings modal
// A settings modal
ready(() => {
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
    settingsIcon.title = settingsBtn.ariaLabel =
        'Einstellungen von Better Moodle';
    settingsIcon.role = 'img';
    settingsBtn.append(settingsIcon);

    // region Feature: general.updateNotification
    if (getSetting('general.updateNotification')) {
        updateAvailable.then(available => {
            if (!available) return;
            const updateBadge = document.createElement('div');
            updateBadge.classList.add('count-container');
            settingsBtn.append(updateBadge);
        });
    }
    // endregion

    const srSpan = document.createElement('span');
    srSpan.classList.add('sr-only', 'sr-only-focusable');
    srSpan.dataset.region = 'jumpto';
    srSpan.tabIndex = -1;

    settingsBtnWrapper.append(settingsBtn, srSpan);

    const form = document.createElement('form');
    form.classList.add('mform');

    let fieldsetCounter = 0;
    let currentFieldset;

    /**
     * @param {string} name
     */
    const createFieldset = name => {
        const fieldset = (currentFieldset = document.createElement('fieldset'));
        form.append(fieldset);

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
            'mr-1'
        );
        const collapseBtn = document.createElement('a');
        collapseBtn.classList.add(
            'btn',
            'btn-icon',
            'mr-1',
            'icons-collapse-expand',
            'stretched-link',
            'fheader'
        );
        collapseBtn.dataset.toggle = 'collapse';
        collapseBtn.id = PREFIX(`settings-collapseElement-${fieldsetCounter}`);
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
            'mb-0'
        );
        heading.textContent = name;

        headerWrapper.append(collapseBtn, heading);
        headerRow.append(headerWrapper);

        const container = document.createElement('div');
        container.classList.add('fcontainer', 'collapseable', 'collapse');
        container.id = PREFIX(`settings-containerElement-${fieldsetCounter}`);
        collapseBtn.href = `#${container.id}`;

        // all fieldsets are collapsed by default except the first one
        if (fieldsetCounter) collapseBtn.classList.add('collapsed');
        else container.classList.add('show');

        fieldset.append(legend, headerRow, container);
        fieldsetCounter++;
    };

    SETTINGS.forEach((setting, index) => {
        // if setting is a string, use this as a heading / fieldset
        if (typeof setting === 'string') {
            createFieldset(setting);
        }
        // otherwise, add the settings inputs
        else {
            const SETTING_KEY = getSettingKey(setting.id);

            if (!currentFieldset) createFieldset('');

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
            label.textContent = setting.name;

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
                'col-md-8',
                'form-inline',
                'align-items-start',
                'felement'
            );
            inputWrapper.dataset.setting = setting.id;

            const value = GM_getValue(SETTING_KEY, setting.default);

            /** @type{HTMLInputElement} */
            const input = document.createElement('input');
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
            title: `${
                githubLink('').outerHTML
            }&nbsp;Better Moodle: Einstellungen`,
            body: form,
        }).then(modal => {
            // open the modal on click onto the settings button
            settingsBtnWrapper.addEventListener('click', () => modal.show());

            // region link to moodle settings
            // add a link to moodle settings
            const moodleSettingsLink = document.createElement('a');
            moodleSettingsLink.href = '/user/preferences.php';
            moodleSettingsLink.target = '_blank';
            moodleSettingsLink.textContent = 'Zu den Moodle-Einstellungen';
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
                'installierte Version:\xa0',
                currentCode,
                ' ',
                'aktuellste Version:\xa0',
                latestCode
            );

            updateAvailable.then(available => {
                if (!available) return;
                const updateBtn = document.createElement('a');
                updateBtn.classList.add('btn-primary', 'btn-sm', 'ml-2');
                updateBtn.href = '#';
                updateBtn.textContent = 'Update installieren';
                versionSpan.append(updateBtn);

                updateBtn.addEventListener('click', e => {
                    e.preventDefault();
                    create({
                        type: types.ALERT,
                        title: 'Better Moodle aktualisieren',
                        body: 'Den Anweisungen zum Aktualisieren im Script-Manager (z.&nbsp;B. Tampermonkey) folgen und anschließend Moodle neu laden.',
                    }).then(modal => modal.show());
                    open(GM_info.script.updateURL, '_self');
                });
            });

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
#${footerBtnGroup.id} > button > span {
    font-size: 0;
    transition: font-size 0.5s;
}
#${footerBtnGroup.id} > button:hover > span {
    font-size: unset;
}
`);

            modal.getFooter()[0].prepend(footerBtnGroup);

            // region changelog
            const changelogBtn = document.createElement('button');
            changelogBtn.classList.add('btn', 'btn-outline-primary');
            const changelogIcon = document.createElement('i');
            changelogIcon.classList.add('fa', 'fa-history', 'fa-fw');
            const changelogText = document.createElement('span');
            changelogText.textContent = 'Changelog';
            changelogBtn.append(changelogIcon, changelogText);

            changelogBtn.addEventListener('click', () =>
                create({
                    type: types.ALERT,
                    large: true,
                    scrollable: true,
                    title: `${
                        githubLink('/blob/main/CHANGELOG.md').outerHTML
                    }&nbsp;Better Moodle: Changelog`,
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
                }).then(modal => modal.show())
            );
            footerBtnGroup.append(changelogBtn);
            // endregion

            // region export
            const exportBtn = document.createElement('button');
            exportBtn.classList.add('btn', 'btn-outline-primary');

            const exportIcon = document.createElement('i');
            exportIcon.classList.add('fa', 'fa-download', 'fa-fw');
            const exportText = document.createElement('span');
            exportText.textContent = 'Einstellungen exportieren';
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
            importText.textContent = 'Einstellungen importieren';
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
