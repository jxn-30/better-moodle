import createPlugin from './createPlugin';
import { type Plugin } from 'vite';

/**
 * @param src
 */
const minify = (src: string) =>
    src
        .replace(/\{\{!.*?\}\}/gs, '') // remove mustache comments
        .replace(/\\n/g, '') // remove linebreaks
        .replace(/(?<=\{\{[<>/$#^]?)\s+|\s+(?=\}\})/g, '') // remove unnecessary whitespaces in mustache statements
        .replace(/(?<=<[a-z]+)\s+/g, ' ') // remove unnecessary whitespace in html tags (after tag name)
        .replace(/(?<=")\s+(?=>)/g, '') // remove unnecessary whitespace in html tags (end of tag)
        .replace(/\s+(?=\/>)/g, '') // remove unnecessary whitespace in self-closing html tags
        .replace(/ {3,}/g, '  '); // reduce white spaces to a maximum of 2. This may break at <pre> tags but that isn't an issue yet.

/**
 *
 */
export default function (): Plugin {
    return createPlugin('mustache-loader', {
        transform: { filter: { id: /\.mustache\?raw$/ }, handler: minify },
    });
}
