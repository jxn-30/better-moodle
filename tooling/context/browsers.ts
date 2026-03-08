import browserslist from 'browserslist';
import { getUserAgentRegex } from 'browserslist-useragent-regexp';
import { resolveToEsbuildTarget } from 'esbuild-plugin-browserslist';

// load browsers from browserslist config
const queries = browserslist.loadConfig({ path: process.cwd() });
export const browsers = browserslist(queries);

// determine targets for ESBuild and vite-plugin-legacy
export const targets = new Set(
    resolveToEsbuildTarget(browsers, { printUnknownTargets: false })
)
    .values()
    .toArray()
    .toSorted();

// determine the minimum supported browser versions
const minVersionsMap = new Map<string, number>();
browsers.forEach(browser => {
    const [id, version] = browser.split(' ');

    // map to a readable name if needed, names will be shown capitalized
    const browserId = { and_ff: 'firefox (android)' }[id] ?? id;

    const minVersion = minVersionsMap.get(browserId) ?? Number.MAX_SAFE_INTEGER;
    minVersionsMap.set(browserId, Math.min(Number(version), minVersion));
});
export const minVersions = Object.fromEntries(minVersionsMap);

// determine the RegExp to check the useragent
export const uaRegExp = getUserAgentRegex({
    browsers,
    allowHigherVersions: true,
});
