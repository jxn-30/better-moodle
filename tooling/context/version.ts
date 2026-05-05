import { version as baseVersion } from '../../package.json';
import { getUTCString } from '../utils/timestamp';
import { isNightlyBuild } from './args';

export const version =
    isNightlyBuild ? `${baseVersion}-nightly+${getUTCString()}` : baseVersion;

export const tag = isNightlyBuild ? 'nightly' : 'latest';
