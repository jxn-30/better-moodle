const args = process.argv;

const configArg = args
    .find(arg => arg.startsWith('--config='))
    ?.replace('--config=', '');
if (!configArg) {
    throw new Error(
        'No config specified. Please set a config with --config=...'
    );
}
export const configFile = configArg;

export const isReleaseBuild = args.some(arg => arg === '--release');
