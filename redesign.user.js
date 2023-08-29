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
// @run-at          document-start
// @grant           GM_addStyle
// ==/UserScript==

GM_addStyle(`
/* Use full width */
#topofscroll, .header-maxwidth {
    max-width: unset !important;
}
    `);
