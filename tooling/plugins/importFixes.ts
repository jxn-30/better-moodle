import { type Context } from '../context';
import createPlugin from './createPlugin';
import { type Plugin } from 'vite';

const VIRTUAL_PUBLIC_ID = 'virtual:fixes';
const VIRTUAL_RESOLVED_ID = `\0${VIRTUAL_PUBLIC_ID}`;

/**
 * @param ctx
 */
export default function (ctx: Context): Plugin {
    const importString = ctx.fixes
        .map(fix => `import ${JSON.stringify(`#fixes/${fix}`)};`)
        .join('');

    return createPlugin('import-fixes', {
        /**
         * @param source
         */
        resolveId(source) {
            if (source === VIRTUAL_PUBLIC_ID) return VIRTUAL_RESOLVED_ID;
            return undefined;
        },
        /**
         * @param id
         */
        load(id) {
            if (id === VIRTUAL_RESOLVED_ID) return importString;
            return null;
        },
    });
}
