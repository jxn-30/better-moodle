import boxen from 'boxen';
import { type Context } from '../context';

/**
 * Creates a unicode box as a multiline-js comment.
 * @param content - the full copyright text.
 * @returns a unicode box
 */
const copyrightBox = (content: string) =>
    boxen(content, {
        borderStyle: {
            topLeft: '/*!',
            topRight: '*',
            bottomLeft: ' *',
            bottomRight: '*/',
            top: '*',
            bottom: '*',
            left: '*',
            right: '*',
        },
        title: 'Copyright ©',
        padding: 1,
        width: Math.min(
            120, // The prettier max width for built file
            Math.max(...content.split(/\n/).map(l => l.length)) + 8 // Max line width + padding + border
        ),
    }).toString();

/**
 * @param ctx
 */
export const scriptCopyright = (ctx: Context) =>
    copyrightBox(ctx.copyright.script);
/**
 * @param ctx
 */
export const polyfillsCopyright = (ctx: Context) =>
    copyrightBox(ctx.copyright.polyfills);
