export const githubPath = (path: string) => `${__GITHUB_URL__}${path}`;
export const rawGithubPath = (path: string) =>
    `https://raw.githubusercontent.com/${__GITHUB_USER__}/${__GITHUB_REPO__}/main/${path}`;

// this is adopted from https://github.com/p01/mmd.js
export const mdToHtml = (md: string, headingStart = 1) => {
    let html = '';

    const escape = (str: string) => new Option(str).innerHTML;
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
