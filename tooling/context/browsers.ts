import browserslist from 'browserslist';
import { getUserAgentRegex } from 'browserslist-useragent-regexp';
import { resolveToEsbuildTarget } from 'esbuild-plugin-browserslist';

// load browsers from browserslist config
const queries = browserslist.loadConfig({ path: process.cwd() });
export const browsers = browserslist(queries);

// determine targets for ESBuild and vite-plugin-legacy
const allTargets = new Set(
    resolveToEsbuildTarget(browsers, { printUnknownTargets: false })
)
    .values()
    .toArray()
    .toSorted();

// determine the minimum supported targets as each target browser must not occure more than once anymore
const minTargetsMap = new Map<string, number>();
allTargets.forEach(target => {
    const [browser, version] = target.split(/(?<=^\D+)(?=\d+$)/);

    const minVersion = minTargetsMap.get(browser) ?? Number.MAX_SAFE_INTEGER;
    minTargetsMap.set(browser, Math.min(Number(version), minVersion));
});
export const targets = minTargetsMap
    .entries()
    .map(([browser, version]) => `${browser}${version}`)
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
