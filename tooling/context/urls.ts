import { tag as currentTag } from './version';
import icsParserConfig from '../../ics-parser/wrangler.json';
import { config, metaFileName, scriptFileName } from './config';
import { configFile, isNightlyBuild } from './args';

export const githubUrl = `https://github.com/${config.github.user}/${config.github.repo}`;
export const homepage = `${githubUrl}${config.github.branch ? `/tree/${config.github.branch}` : ''}`;
export const icon = `https://icons.better-moodle.dev/${configFile}.png`;

/**
 * Constructs a url to download a specific file for a specific release
 * @param fileName - the name of the file to download
 * @param versionTag - the tag to download the file from
 * @returns a fully qualified URL for downloading a file of a release
 */
export const versionDownloadURL = (
    fileName: string,
    versionTag = currentTag
) => {
    if (versionTag === 'latest') {
        return `${githubUrl}/releases/latest/download/${fileName}`;
    }
    const tag = isNightlyBuild ? 'nightly' : versionTag;
    return `${githubUrl}/releases/download/${tag}/${fileName}`;
};

export const updateUrl = versionDownloadURL(metaFileName);
export const downloadUrl = versionDownloadURL(scriptFileName);

export const STABLE_DOWNLOAD_URL = versionDownloadURL(scriptFileName, 'latest');
export const NIGHTLY_DOWNLOAD_URL = versionDownloadURL(
    scriptFileName,
    'nightly'
);

export const match = `${config.moodleUrl}/*`;

export const icsParserDomain = icsParserConfig.routes[0].pattern;
