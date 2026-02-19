import * as prettier from 'prettier';
import createPlugin from './createPlugin';
import { type Context } from '../context';
import { ESLint } from 'eslint';

const prettierConfig = await prettier.resolveConfig('dist');

/**
 * @param code
 * @param path
 */
const runPrettier = (code: string, path: string) =>
    prettier.format(code, {
        ...prettierConfig,
        printWidth: 120,
        tabWidth: 2,
        filepath: path,
    });

/**
 * @param code
 * @param path
 */
const runESLint = (code: string, path: string) =>
    new ESLint({
        overrideConfigFile: 'eslint.userscript.config.js',
        fix: true,
    }).lintText(code, { filePath: path });

/**
 * @param code
 * @param path
 */
const lintAndFormat = async (code: string, path: string) => {
    const formatted = await runPrettier(code, path);
    const [linted] = await runESLint(formatted, path);
    const lintedCode = linted.output ?? linted.source ?? formatted;
    const reformatted = await runPrettier(lintedCode, path);

    return reformatted;
};

/**
 * @param ctx
 */
export default function (ctx: Context) {
    const requireReplacements = new Map<string, string>();

    const lintAndFormatPlugin = createPlugin('post-build-format-and-lint', {
        enforce: 'post',
        /**
         * @param _
         * @param bundle
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
                            ctx.urls.versionDownloadUrl(ctx.version, fileName),
                            ctx.isReleaseBuild ? code : false
                        )
                    )
                )
            );
        },
    });

    const replaceRequiresPlugin = createPlugin('post-build-replace-requires', {
        enforce: 'post',
        /**
         * @param _
         * @param bundle
         */
        generateBundle(_, bundle) {
            const scriptFile = Object.values(bundle).find(
                ({ fileName }) => fileName === ctx.dist.script
            );

            if (!scriptFile) {
                throw new Error(
                    'Could not find the dist script chunk/file. How should I replace internal @require-rules?'
                );
            }

            requireReplacements.forEach((url, fileName) => {
                // @ts-expect-error - TS does not know of RegExp.escape yet
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                const escapedFileName = RegExp.escape(fileName) as string;
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
