import icsParserConfig from '../../ics-parser/wrangler.json';
import { config, metaFileName, scriptFileName } from './config';
import { configFile, isNightlyBuild } from './args';

/**
 * Get the version or nightly
 * @param version - the version to use if it is not a nightly build
 * @returns nightly if this is a nightly build, otherwise the version string
 */
const getVersion = (version: string) => (isNightlyBuild ? 'nightly' : version);

export const githubUrl = `https://github.com/${config.github.user}/${config.github.repo}`;
export const releaseDownloadUrl = `${githubUrl}/releases/${getVersion('latest')}/download`;
export const homepage = `${githubUrl}${config.github.branch ? `/tree/${config.github.branch}` : ''}`;
export const icon = `https://icons.better-moodle.dev/${configFile}.png`;

/**
 * Constructs a url to download a specific file for a specific release
 * @param version - the version to download the file from
 * @param fileName - the name of the file to download
 * @returns a fully qualified URL for downloading a file of a release
 */
export const versionDownloadUrl = (version: string, fileName: string) =>
    `${githubUrl}/releases/download/${getVersion(version)}/${fileName}`;

export const updateUrl = `${releaseDownloadUrl}/${metaFileName}`;
export const downloadUrl = `${releaseDownloadUrl}/${scriptFileName}`;

export const STABLE_DOWNLOAD_URL = versionDownloadUrl('latest', scriptFileName);
export const NIGHTLY_DOWNLOAD_URL = versionDownloadUrl(
    'nightly',
    scriptFileName
);

export const match = `${config.moodleUrl}/*`;

export const icsParserDomain = icsParserConfig.routes[0].pattern;
