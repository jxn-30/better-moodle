import packageJSON from '../../package.json' with { type: 'json' };
import { isNightlyBuild, nightlyVersion } from './args.ts';

export const version = isNightlyBuild ? nightlyVersion : packageJSON.version;

export const tag = isNightlyBuild ? 'nightly' : 'latest';
