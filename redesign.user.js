// ==UserScript==
// @name            🎓️ UzL: Better Moodle
// @namespace       https://uni-luebeck.de
// @version         1.0.0
// @author          Jan (jxn_30)
// @description:de  Verbessert dieses seltsame Design, das Moodle 4 mit sich bringt
// @homepage        https://github.com/jxn-30/better-moodle
// @homepageURL     https://github.com/jxn-30/better-moodle
// @icon            https://www.uni-luebeck.de/favicon.ico
// @updateURL       https://github.com/jxn-30/better-moodle/redesign.user.js
// @downloadURL     https://github.com/jxn-30/better-moodle/redesign.user.js
// @match           https://moodle.uni-luebeck.de/*
// @run-at          document-body
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_setValue
// ==/UserScript==

/* global M */

// use full width instead of maximum 830px
GM_addStyle(`
/* Use full width */
#topofscroll, .header-maxwidth {
    max-width: unset !important;
}
    `);

const PREFIX = str => `better-moodle-${str}`;

/**
 * @param {() => void} callback
 */
const ready = callback => {
    if (document.readyState !== 'loading') callback();
    else {
        document.addEventListener('DOMContentLoaded', callback, { once: true });
    }
};

// add a right sidebar with timeline and upcoming events on Dashboard
if (window.location.pathname === '/my/') {
    const prefix = str => `${PREFIX('dashboard-sidebar-right')}-${str}`;
    const storage = prefix('open');

    const sidebar = document.createElement('div');
    sidebar.id = 'theme_boost-drawers-blocks';
    sidebar.classList.add(
        'drawer',
        'drawer-right',
        'd-print-none',
        'not-initialized'
    );
    sidebar.dataset.region = 'fixed-drawer';
    sidebar.dataset.preference = crypto.randomUUID();
    sidebar.dataset.state = 'show-drawer-right';
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
    closeBtn.dataset.placement = 'left';
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

    const toggleBtn = document.createElement('div');
    toggleBtn.classList.add(
        'drawer-toggler',
        'drawer-right-toggle',
        'ml-auto',
        'd-print-none'
    );
    const toggleBtnInner = document.createElement('button');
    toggleBtnInner.classList.add('btn', 'icon-no-margin');
    toggleBtnInner.dataset.toggler = 'drawers';
    toggleBtnInner.dataset.action = 'toggle';
    toggleBtnInner.dataset.target = sidebar.id;
    toggleBtnInner.dataset.toggle = 'tooltip';
    toggleBtnInner.dataset.toggle = 'tooltip';
    toggleBtnInner.title = 'Blockleiste öffnen';
    toggleBtnInner.dataset.originalTitle = toggleBtnInner.title;
    const toggleBtnSRSpan = document.createElement('span');
    toggleBtnSRSpan.classList.add('sr-only');
    toggleBtnSRSpan.textContent = toggleBtnInner.title;
    const toggleBtnIconSpan = document.createElement('span');
    const toggleBtnIcon = document.createElement('i');
    toggleBtnIcon.classList.add('icon', 'fa', 'fa-calendar', 'fa-fw');
    toggleBtnIcon.setAttribute('aria-hidden', 'true');
    toggleBtnIconSpan.appendChild(toggleBtnIcon);
    toggleBtnInner.append(toggleBtnSRSpan, toggleBtnIcon);
    toggleBtn.appendChild(toggleBtnInner);

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
        // move blocks into sidbar
        content.append(document.querySelector('.block_timeline'));
        content.append(document.querySelector('.block_calendar_upcoming'));

        // append the toggle button
        document.querySelector('#page .drawer-toggles')?.append(toggleBtn);
    });
}
