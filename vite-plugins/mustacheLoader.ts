import type { Plugin } from 'vite';

/**
 * Minifies a mustache template
 * @param src - the mustache template code
 * @returns the minified mustache template
 */
const minifyMustache = (src: string) =>
    src
        .replace(/\{\{!.*?\}\}/gs, '') // remove mustache comments
        .replace(/\\n/g, '') // remove linebreaks
        .replace(/(?<=\{\{[<>/$#^]?)\s+|\s+(?=\}\})/g, '') // remove unnecessary whitespaces in mustache statements
        .replace(/(?<=<[a-z]+)\s+/g, ' ') // remove unnecessary whitespace in html tags (after tag name)
        .replace(/(?<=")\s+(?=>)/g, '') // remove unnecessary whitespace in html tags (end of tag)
        .replace(/\s+(?=\/>)/g, '') // remove unnecessary whitespace in self-closing html tags
        .replace(/ {3,}/g, '  '); // reduce white spaces to a maximum of 2. This may break at <pre> tags but that isn't an issue yet.

export default {
    name: 'better-moodle:mustache-loader',
    transform: { filter: { id: /\.mustache\?raw$/ }, handler: minifyMustache },
} satisfies Plugin;
