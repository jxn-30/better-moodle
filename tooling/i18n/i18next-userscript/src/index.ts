// TODO: Make sure we don't need this anymore
/* eslint-disable */

import plugin from '@inlang/plugin-i18next';

const i18nextUserscriptPlugin: typeof plugin = {
    ...plugin,
    /**
     * @param root0
     * @param root0.settings
     */
    toBeImportedFiles: async ({ settings }) => {
        settings[plugin.key] = {
            pathPattern: {
                // TODO: Make these dynamic
                bookmarks: '../../src/features/bookmarks/i18n/{locale}.json',
            },
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
