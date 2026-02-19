import { configFile } from './args';
import icsParserConfig from '../../ics-parser/wrangler.json';
import { config, metaFileName, scriptFileName } from './config';

export const githubUrl = `https://github.com/${config.github.user}/${config.github.repo}`;
export const releaseDownloadUrl = `${githubUrl}/releases/latest/download`;
export const homepage = `${githubUrl}${config.github.branch ? `/tree/${config.github.branch}` : ''}`;
export const icon = `https://icons.better-moodle.dev/${configFile}.png`;

/**
 * @param version
 * @param path
 */
export const versionDownloadUrl = (version: string, path: string) =>
    `${githubUrl}/releases/download/${version}/${path}`;

export const updateUrl = `${releaseDownloadUrl}/${metaFileName}`;
export const downloadUrl = `${releaseDownloadUrl}/${scriptFileName}`;

export const match = `${config.moodleUrl}/*`; /* */

export const icsParserDomain = icsParserConfig.routes[0].pattern;
