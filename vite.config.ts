import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import { version } from './package.json';
import * as path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
    esbuild: {
        jsxInject: 'import {createElement} from "jsx-dom";',
        jsxFactory: 'createElement',
        jsxFragment: 'createElement',
        jsx: 'transform',
    },
    build: {
        minify: false,
        cssMinify: false,
    },
    css: {
        modules: {
            scopeBehaviour: 'local',
            hashPrefix: 'better-moodle',
            localsConvention: 'camelCaseOnly',
            generateScopedName: (name, filename) => {
                // Skip global styles
                if (!name.startsWith('_')) return name;

                // extract feature name from filename
                const feat = path
                    .relative(__dirname, filename)
                    .replace(/^src\/style\/|\.module\.(scss|sass)$/g, '') // extract feature name
                    .replace(/[^a-zA-Z0-9_-]/, '-') // replace invalid characters with hyphen
                    .replace(/-+/g, '-'); // reduce multiple hyphens to a single one

                return `better-moodle_${feat}__${name.replace(/^_/, '')}`;
            },
        },
    },
    plugins: [
        monkey({
            entry: 'src/core.tsx',
            userscript: {
                'name': '🎓️ UzL: better-moodle 2',
                'namespace': 'https://uni-luebeck.de',
                version,
                'author': 'Jan (jxn_30)',
                'description': {
                    '': 'Improves UzL-Moodle by cool features and design improvements.',
                    'de': 'Verbessert UzL-Moodle durch coole Features und Designverbesserungen.',
                },
                'homepage': 'https://github.com/jxn-30/better-moodle',
                'homepageURL': 'https://github.com/jxn-30/better-moodle',
                'icon': 'https://www.uni-luebeck.de/favicon.ico',
                'updateURL':
                    'https://github.com/jxn-30/better-moodle/releases/latest/download/better-moodle.meta.js',
                'downloadURL':
                    'https://github.com/jxn-30/better-moodle/releases/latest/download/better-moodle.user.js',
                'match': 'https://moodle.uni-luebeck.de/*',
                'run-at': 'document-body',
                'connect': 'studentenwerk.sh',
            },
            clientAlias: 'GM',
            build: {
                fileName: 'better-moodle.user.js',
                autoGrant: true,
            },
        }),
    ],
});
