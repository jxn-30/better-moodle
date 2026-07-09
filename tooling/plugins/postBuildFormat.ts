import * as prettier from 'prettier';
import { type Context } from '../context';
import createPlugin from './createPlugin';
import { ESLint } from 'eslint';
import { type PluginOption } from 'vite';

const prettierConfig = await prettier.resolveConfig('dist');

/**
 * Formats code using Prettier with a specified configuration.
 * @param code - The source code to format.
 * @param path - The file path to use for determining the parser.
 * @returns The formatted code as a promise.
 */
const runPrettier = (code: string, path: string) =>
    prettier.format(code, {
        ...prettierConfig,
        printWidth: 120,
        tabWidth: 2,
        filepath: path,
    });

const eslint = new ESLint({
    overrideConfigFile: 'eslint.userscript.config.js',
    fix: true,
});

/**
 * Lints code using ESLint with a specified configuration.
 * @param code - The source code to lint.
 * @param path - The file path to use to determine the parser.
 * @returns A promise of the lint result containing the formatted code.
 */
const runESLint = (code: string, path: string) =>
    eslint.lintText(code, { filePath: path });

/**
 * Formats and lints code using Prettier and ESLint in sequence.
 * @param code - The source code to process.
 * @param path - The file path to use to determine the parser.
 * @returns The final formatted and linted code.
 */
const lintAndFormat = async (code: string, path: string) => {
    const formatted = await runPrettier(code, path);
    const [linted] = await runESLint(formatted, path);
    const lintedCode = linted.output ?? linted.source ?? formatted;
    const reformatted = await runPrettier(lintedCode, path);

    return reformatted;
};

/**
 * Creates Vite plugins for code formatting and linting.
 * It also replaces the local `@require` userscript headers with valid URLs and valid hashes.
 * @param ctx - The Vite plugin context object.
 * @returns An array containing the formatting and require replacement plugins.
 */
export default function (ctx: Context): PluginOption {
    const requireReplacements = new Map<string, string>();

    const lintAndFormatPlugin = createPlugin('post-build-format-and-lint', {
        enforce: 'post',
        /**
         * Processes the bundle to format and lint code.
         * @param _ - The output options (unused).
         * @param bundle - The bundle object containing chunks and assets.
         * @returns a promise that resolves once all files are processed
         */
        generateBundle(_, bundle) {
            const runners: Promise<[string, string]>[] = [];

            Object.values(bundle).forEach(chunkOrAsset => {
                const fileName = chunkOrAsset.fileName;
                if (chunkOrAsset.type === 'chunk') {
                    runners.push(
                        lintAndFormat(chunkOrAsset.code, fileName)
                            .then(code => (chunkOrAsset.code = code))
                            .then(code => [fileName, code])
                    );
                } else {
                    runners.push(
                        lintAndFormat(chunkOrAsset.source.toString(), fileName)
                            .then(code => (chunkOrAsset.source = code))
                            .then(code => [fileName, code])
                    );
                }
            });

            return Promise.all(runners).then(chunks =>
                chunks.forEach(([fileName, code]) =>
                    requireReplacements.set(
                        fileName,
                        ctx.userscript.require.getUrl(
                            ctx.urls.versionDownloadURL(fileName, ctx.version),
                            ctx.args.isReleaseBuild ? code : false
                        )
                    )
                )
            );
        },
    });

    const replaceRequiresPlugin = createPlugin('post-build-replace-requires', {
        enforce: 'post',
        /**
         * Replaces `@require`-headers in the dist script with resolved URLs.
         * @param _ - The output options (unused).
         * @param bundle - The bundle object containing chunks and assets.
         * @throws {Error} if the generated userscript could not be found.
         */
        generateBundle(_, bundle) {
            const scriptFile = Object.values(bundle).find(
                ({ fileName }) => fileName === ctx.dist.script
            );

            if (!scriptFile) {
                throw new Error(
                    'Could not find the dist script chunk/file. How should I replace internal @require-headers?'
                );
            }

            requireReplacements.forEach((url, fileName) => {
                const escapedFileName = RegExp.escape(fileName);
                const regex = new RegExp(
                    `(?<=^//\\s+@require\\s+)${escapedFileName}$`,
                    'gm'
                );
                if (scriptFile.type === 'chunk') {
                    scriptFile.code = scriptFile.code.replace(regex, url);
                } else {
                    scriptFile.source = scriptFile.source
                        .toString()
                        .replace(regex, url);
                }
            });
        },
    });

    return [lintAndFormatPlugin, replaceRequiresPlugin];
}
