// TODO: Make sure we don't need this anymore
/* eslint-disable */

import { glob } from 'node:fs/promises';
import plugin from '@inlang/plugin-i18next';

const featureDirs = glob('./src/features/*', { withFileTypes: true });
const featureArray = await Array.fromAsync(featureDirs);
const featureObjectArray = featureArray
    .filter(el => el.isDirectory())
    .map(el => [el.name, `../../src/features/${el.name}/i18n/{locale}.json`]);

const i18nextUserscriptPlugin: typeof plugin = {
    ...plugin,
    /**
     * @param root0
     * @param root0.settings
     */
    toBeImportedFiles: async ({ settings }) => {
        settings[plugin.key] = {
            pathPattern: Object.fromEntries(featureObjectArray),
        };
        return plugin.toBeImportedFiles!({ settings });
    },
    /**
     * @param root0
     * @param root0.files
     * @param root0.settings
     */
    importFiles: async ({ files, settings }) => {
        // console.log(files, settings);
        const result = await plugin.importFiles!({ files, settings });
        // console.log(result.bundles);
        // console.log(result.messages);
        // console.log(JSON.stringify(result.variants, null, 4));
        // console.log(paraglidePath);
        return result;
    },
};

export default i18nextUserscriptPlugin;
