import Config from './require.js/core/config';
import type MathJax from '@types/mathjax';

declare global {
    const M: {
        cfg: Config;
        util: {
            // in moodle 402 they fixed this not to be a nested array anymore
            complete_js: [string][] | string[];
        };
    };
    const MathJax: MathJax;
}

// we need an empty export, otherwise extending window object will not work.
export {};
