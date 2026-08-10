import type { PluginOption } from 'vite';
import terserPlugin from '@rollup/plugin-terser';

/**
 * The terser plugin to minify and optimize the output a little
 * @returns the configured terser plugin
 */
export default function (): PluginOption {
    return terserPlugin({
        module: true,
        compress: {
            defaults: false,
            arrows: true,
            arguments: true,
            // booleans: true, // This may make boolean expressions less readable. Re-evaluate later.
            booleans_as_integers: false,
            collapse_vars: true,
            // comparisons: true, // This may make comparisons less readable. Re-evaluate later.
            computed_props: true,
            // conditionals: true, // Some transformations seem odd but are syntactically and semantically correct. Re-evaluate later.
            dead_code: true,
            directives: true,
            ecma: 2020,
            builtins_ecma: 2020,
            builtins_pure: true,
            evaluate: true,
            expression: false,
            hoist_funs: true,
            hoist_props: true,
            hoist_vars: false,
            // if_return: true, // Maybe together with conditionals?
            // inline: true, // This sometimes makes the output longer and more unreadable (for larger functions). Setting inline to 1 or 2 also has some more unreadable outputs. Most inlines are fine. Re-evaluate later.
            join_vars: false,
            keep_classnames: true,
            keep_fargs: true,
            keep_fnames: true,
            keep_infinity: true,
            lhs_constants: true,
            loops: true,
            module: true,
            negate_iife: true,
            passes: 5,
            properties: true,
            pure_getters: 'strict',
            pure_new: false,
            reduce_vars: true,
            reduce_funcs: false,
            sequences: false,
            side_effects: true,
            switches: true,
            toplevel: true,
            top_retain: null,
            typeofs: true,
            unsafe: false,
            unused: true,
        },
        format: { comments: 'all', ecma: 2020 },
        mangle: false,
        ecma: 2020,
        keep_classnames: true,
        keep_fnames: true,
    }) as PluginOption;
}
