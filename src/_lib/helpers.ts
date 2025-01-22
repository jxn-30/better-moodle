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
     * Escapes a string to be used within HTML. HTML special chars are replaced by their entity equivalents.
     * @param str - the string to be escaped
     * @returns the escaped string
     */
    const escape = (str: string) => new Option(str).innerHTML;
    /**
     * Replaces inline markdown with HTML (such as images, links, inline code, bold and italic).
     * @param str - the markdown string to be replaced
     * @returns the HTML string
     */
    const inlineEscape = (str: string) =>
        escape(str)
            .replace(/!\[([^\]]*)]\(([^(]+)\)/g, '<img alt="$1" src="$2">') // image
            .replace(/\[([^\]]+)]\(([^(]+?)\)/g, '<a href="$2">$1</a>') // link
            .replace(/\[([^\]]+)]\[([^[]+?)]/g, '<a data-link="$2">$1</a>') // reference link
            .replace(/`([^`]+)`/g, '<code>$1</code>') // code
            .replace(
                /(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g,
                '<strong>$2</strong>'
            ) // bold
            .replace(/([*_])(?=\S)([^\r]*?\S)\1/g, '<em>$2</em>'); // italic

    const replacements = new Map<
        string,
        [RegExp, string, string] | [RegExp, string, string, string]
    >([
        ['*', [/\n\* /, '<ul><li>', '</li></ul>']],
        ['1', [/\n[1-9]\d*\.? /, '<ol><li>', '</li></ol>']],
        [' ', [/\n {4}/, '<pre><code>', '</code></pre>', '\n']],
        ['>', [/\n> /, '<blockquote>', '</blockquote>', '\n']],
    ]);

    md.replace(/^\s+|\r|\s+$/g, '')
        .replace(/\t/g, '    ')
        // find reference definitions, store them and remove them from the text
        .replace(/^\[(.+?)]:\s*(.+)$/gm, (_, id: string, url: string) => {
            referenceLinks.set(id, url);
            return '';
        })
        .split(/\n\n+/)
        .forEach(b => {
            const firstChar = b[0];
            const replacement = replacements.get(firstChar);
            let i;
            html +=
                replacement ?
                    replacement[1] +
                    `\n${b}`
                        .split(replacement[0])
                        .slice(1)
                        .map(replacement[3] ? escape : inlineEscape)
                        .join(replacement[3] ?? '</li>\n<li>') +
                    replacement[2]
                : firstChar === '#' ?
                    `<h${(i = b.indexOf(' ') + (headingStart - 1))}
                      id="${mdID(
                          b.slice(i + 1 - (headingStart - 1)),
                          idPrefix
                      )}"
                      >${inlineEscape(
                          b.slice(i + 1 - (headingStart - 1))
                      )}</h${i}>`
                : firstChar === '<' ? b
                : b.startsWith('---') ? '<hr />'
                : pWrap ? `<p>${inlineEscape(b)}</p>`
                : inlineEscape(b);
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
export const animate = <Args extends unknown[]>(
    delay: number,
    callback: (...args: Args) => void,
    runImmediate = false
) => {
    if (runImmediate) callback();

    let last = 0;
    /**
     * call the callback if enough time has passed
     * @param now - a time identifier
     */
    const intervalCallback = now => {
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
 * Checks if the user is logged in by checking the current URL.
 */
export const isLoggedIn = !window.location.pathname.startsWith('/login');

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
