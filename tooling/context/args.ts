import { parseArgs } from 'node:util';

const options = {
    'config': { type: 'string' },
    'release': { type: 'boolean', default: false },
    'nightly': { type: 'boolean', default: false },
    'single-file': { type: 'boolean', default: false },
} as const;

const { values: args } = parseArgs({
    // We need to only respect args behind the --, as -- is considered an option terminator and will end option parsing
    args: process.argv.slice(process.argv.indexOf('--') + 1),
    options,
    strict: true,
    allowPositionals: true,
});

if (!args.config) {
    throw new Error(
        'No config specified. Please set a config with --config=...'
    );
}

export const configFile = args.config;

export const isReleaseBuild = args.release;
export const isNightlyBuild = args.nightly;

export const produceSingleFile = args['single-file'];
