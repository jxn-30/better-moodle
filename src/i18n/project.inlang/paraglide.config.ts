import { defineConfig } from '@inlang/paraglide-js';
import { paraglidePath } from '#/tooling/context/subpaths.ts';

export default defineConfig({
    outdir: paraglidePath,
    // We implement a custom getLocale() so we need no strategy in here.
    strategy: [],
    isServer: 'false',
    additionalFiles: {},
    emitPrettierIgnore: true,
    emitReadme: true,
    emitTsDeclarations: true,
    includeEslintDisableComment: true,
    disableAsyncLocalStorage: true,
    emitGitIgnore: true,
    outputStructure: 'message-modules',
    cleanOutdir: true,
    // TODO: Use additionalFiles for creating feature-wise quick-imports
});
