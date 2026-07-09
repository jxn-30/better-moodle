import { version as baseVersion } from '../../package.json';
import { isNightlyBuild, nightlyVersion } from './args';

export const version = isNightlyBuild ? nightlyVersion : baseVersion;

export const tag = isNightlyBuild ? 'nightly' : 'latest';
