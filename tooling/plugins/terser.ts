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
            collapse_vars: true,
            computed_props: true,
            dead_code: true,
            directives: true,
            evaluate: true,
            keep_classnames: true,
            keep_fnames: true,
            keep_infinity: true,
            lhs_constants: true,
            loops: true,
            passes: 5,
            properties: true,
            reduce_vars: true,
            side_effects: true,
            switches: true,
            typeofs: true,
            unused: true,
        },
        format: { comments: 'all', ecma: 2020 },
        mangle: false,
        ecma: 2020,
        keep_classnames: true,
        keep_fnames: true,
    });
}
