import { ready } from '@/DOM';

/**
 * Prefixes a given string with the global prefix.
 * @param str - the string to be prefixed
 * @returns the prefixed string
 */
export const PREFIX = (str: string) => `${__PREFIX__}-${str}`;
/**
 * Prefixes a given setting id to be used as a fully qualified setting key.
 * @param id - the id of the setting
 * @returns the fully qualified setting key
 */
export const getSettingKey = (id: string) => `settings.${id}`;

/**
 * Prefixes a given string and replaces invalid characters to be used as a DOM ID.
 * @param id - the basic id un-prefixed and un-sanitized
 * @returns the prefixed and sanitized id
 */
export const domID = (id: string) =>
    PREFIX(id)
        .replace(/ /gu, '_')
        .replace(/["']/gu, '')
        .replace(/[^\w-]/gu, '-');

/**
 * Prefixes a given path with the GitHub URL (domain + user + repo).
 * @param path - the absolute path on GitHub beginning at the repos root
 * @returns the full URL as a string
 */
export const githubPath = (path: string) => `${__GITHUB_URL__}${path}`;
/**
 * Prefixes a given path with the GitHub URL (domain + user + repo) for RAW access.
 * @param path - the absolute path on GitHub beginning at the repos root
 * @returns the full URL as a string
 */
export const rawGithubPath = (path: string) =>
    `https://raw.githubusercontent.com/${__GITHUB_USER__}/${__GITHUB_REPO__}/${__GITHUB_BRANCH__}/${path}`;

/**
 * Turns the textContent of a markdown string into a valid DOM-ID.
 * @param md - the markdown string to generate the ID from
 * @param idPrefix - a prefix used in the ID to achieve a scoped ID if necessary
 * @returns the ID based on text content
 */
export const mdID = (md: string, idPrefix = '') =>
    domID(
        (idPrefix ? `${idPrefix}__` : '') +
            Array.from(htmlToElements(mdToHtml(md, 1, idPrefix)))
                .map(el => el.textContent)
                .join('')
    );

/**
 * Converts a markdown string to the matching HTML string.
 * There are some caveats as it attempts to be a simple and minimal parser.
 * @param md - the markdown string to be converted
 * @param headingStart - an optional number to start the heading levels at
 * @param idPrefix - a prefix used in IDs to achieve scoped IDs
 * @param pWrap - wether to wrap normal paragraphs into a <p></p>. May be useful to disable for singleline strings
 * @returns the HTML string
 * @see {@link https://github.com/p01/mmd.js} for where this is adopted from.
 */
export const mdToHtml = (
    md: string,
    headingStart = 1,
    idPrefix = '',
    pWrap = true
) => {
    let html = '';

    const referenceLinks = new Map<string, string>();

    /**
     * Replaces inline markdown with HTML (such as images, links, inline code, bold and italic).
     * @param str - the markdown string to be replaced
     * @returns the HTML string
     */
    const inlineEscape = (str: string) =>
        new Option(str).innerHTML // do some HTML Escaping
            .replace(/!\[([^\]]*)]\(([^(]+)\)/g, '<img alt="$1" src="$2">') // image
            .replace(/\[([^\]]+)]\(([^(]+?)\)/g, '<a href="$2">$1</a>') // link
            .replace(/\[([^\]]+)]\[([^[]+?)]/g, '<a data-link="$2">$1</a>') // reference link
            .replace(/`([^`]+)`/g, '<code>$1</code>') // code
            .replace(
                /(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g,
                '<strong>$2</strong>'
            ) // bold
            .replace(/([*_])(?=\S)([^\r]*?\S)\1/g, '<em>$2</em>'); // italic

    md.trim()
        .replace(/\r/g, '') // replace \r newlines
        .replace(/\t/g, '    ') // replace tabs with 4 spaces
        // find reference definitions, store them and remove them from the text
        .replace(/^\[(.+?)]:\s*(.+)$/gm, (_, id: string, url: string) => {
            referenceLinks.set(id, url);
            return '';
        })
        .split(/\n\n+/) // split into paragraphs
        .forEach(mdParagraph => {
            // unordered list
            if (/^[-*]\s/m.test(mdParagraph)) {
                html += `<ul><li>${mdParagraph
                    .split(/^[-*]\s+/gm)
                    .map(l => l.trim())
                    .filter(Boolean)
                    .map(inlineEscape)
                    .join('</li><li>')}</li></ul>`;
            } else if (/^\d+\.?\s/m.test(mdParagraph)) {
                // ordered list
                html += `<ol><li>${mdParagraph
                    .split(/^\d+\.?\s+/gm)
                    .map(l => l.trim())
                    .filter(Boolean)
                    .map(inlineEscape)
                    .join('</li><li>')}</li></ol>`;
            } else if (/^\s{4}/m.test(mdParagraph)) {
                // preformatted text
                html += `<pre>${mdParagraph.split(/^\s{4}/gm).join('')}</pre>`;
            } else if (/^>\s/m.test(mdParagraph)) {
                // blockquote
                html += `<blockquote>${mdParagraph
                    .split(/^>\s/gm)
                    .map(inlineEscape)
                    .join('')}</blockquote>`;
            } else if (/^#{1,6}\s/m.test(mdParagraph)) {
                // heading
                const level = mdParagraph.indexOf(' ') + headingStart - 1;
                const content = mdParagraph.replace(/^#+/m, '').trim();
                html += `<h${level} id="${mdID(
                    content,
                    idPrefix
                )}">${inlineEscape(content)}</h${level}>`;
            } else if (mdParagraph.startsWith('<')) {
                // paragraph starts with html
                html += mdParagraph;
            } else if (/^---+|^\*\*\*+/m.test(mdParagraph)) {
                // hr
                html += '<hr>';
            } else if (pWrap) {
                // normal paragraph, wrapper in a <p>
                html += `<p>${inlineEscape(mdParagraph)}</p>`;
            } else {
                html += inlineEscape(mdParagraph);
            }
        });

    referenceLinks.forEach(
        (url, id) =>
            (html = html.replaceAll(`data-link="${id}"`, `href="${url}"`))
    );

    return html;
};

/**
 * Converts an HTML string to collection of DOM elements.
 * @param html - the raw HTML string
 * @returns a collection of DOM elements created from this HTML
 */
export const htmlToElements = (html: string) =>
    new DOMParser().parseFromString(html, 'text/html').body.children;

/**
 * Debounces a function to be called after a certain delay.
 * @param fn - the function to be debounced
 * @param delay - the delay in milliseconds
 * @returns the debounced function
 */
export const debounce = <Args extends unknown[]>(
    fn: (...args: Args) => void,
    delay = 100
) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: Args) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
};

/**
 * Animate things in a specific interval.
 * @param delay - the delay in ms between two callback calls
 * @param callback - the function to execute every delay ms
 * @param runImmediate - wether to run the callback immediately
 * @returns a method to cancel / abort the animation
 */
export const animate = (
    delay: number,
    callback: () => void,
    runImmediate = false
) => {
    if (runImmediate) callback();

    let last = 0;
    /**
     * call the callback if enough time has passed
     * @param now - a time identifier
     */
    const intervalCallback = (now: DOMHighResTimeStamp) => {
        currentId = requestAnimationFrame(intervalCallback);

        const elapsed = now - last;

        if (elapsed >= delay) {
            last = now - (elapsed % delay);
            callback();
        }
    };
    let currentId = requestAnimationFrame(intervalCallback);

    return () => cancelAnimationFrame(currentId);
};

/**
 * Checks if the user is logged in.
 * @returns a promise that resolves with information about the login state
 */
export const isLoggedIn = () =>
    __MOODLE_VERSION__ >= 405 ?
        moodleAndDomReady().then(() => (M.cfg.userId ?? 0) > 1) // M.cfg.userId has been added for 405 https://github.com/moodle/moodle/commit/fbca10b8f320 // userId of 1 is guest user
    :   moodleAndDomReady().then(
            () =>
                !!document.querySelector(
                    `a[href$="/login/logout.php?sesskey=${M.cfg.sesskey}"]`
                )
        ); // for < 405 we check the existance of a logout button

/**
 * Checks if the current page is the dashboard by checking the current URL.
 */
export const isDashboard = /^\/my\/(index\.php)?$/.test(
    window.location.pathname
);

/**
 * Checks if this is a new installation. Can be determined by the fact that there are no values stored at all.
 */
export const isNewInstallation = GM_listValues().length === 0;

/**
 * Waits for Moodle's M object to be available.
 * @param checkDelay - Time between checks for M in ms
 * @returns a promise that resolves once M is defined
 */
export const moodleReady = (checkDelay = 10) => {
    const { promise, resolve } = Promise.withResolvers<void>();

    /**
     * Checks if M is available and resolves the promise.
     * @returns void
     */
    const check = () => {
        if (typeof M !== 'undefined') {
            return resolve();
        }
        setTimeout(check, checkDelay);
    };
    check();

    return promise;
};

/**
 * Waits for both Moodle's M object and the dom to be available.
 * @returns a promise that resolves once M is defined and the dom is loaded
 */
export const moodleAndDomReady = () => Promise.all([ready(), moodleReady()]);

/**
 * Checks if the certain JS action in moodle has been completed.
 * @param action - the action string to wait for
 * @returns a promise that resolves once the action string is present in M.util.complete_js
 */
export const mdlJSComplete = async (action: string) => {
    // Ensure M is available
    await moodleReady();

    const { promise, resolve } = Promise.withResolvers<void>();

    /**
     * Checks if the certain JS action in moodle has been completed.
     * Resolves the promise if the action string is present in M.util.complete_js
     * @returns void
     */
    const check = () => {
        if (M.util?.complete_js.flat().includes(action)) {
            return resolve();
        }
        setTimeout(check, 100);
    };
    check();

    return promise;
};
