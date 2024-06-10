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
export const getSettingKey = (id: string) => PREFIX(`settings.${id}`);

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
    `https://raw.githubusercontent.com/${__GITHUB_USER__}/${__GITHUB_REPO__}/main/${path}`;

/**
 * Converts a markdown string to the matching HTML string.
 * @param md - the markdown string to be converted
 * @param headingStart - an optional number to start the heading levels at
 * @returns the HTML string
 * @see {@link https://github.com/p01/mmd.js} for where this is adopted from.
 */
export const mdToHtml = (md: string, headingStart = 1) => {
    let html = '';

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
