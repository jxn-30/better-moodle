// For some reason, importing from ./_configs.d.ts does not work, so we're just duplicating here :(
type MoodleVersion = 400 | 401 | 402 | 403 | 404 | 405;

type VersionRecord<ValueType> = Partial<Record<MoodleVersion, ValueType>>;

export interface GlobalConfig {
    /** This is the schema file we are using. */
    $schema: '_globalSchema.json';
    // defaultDisabled: string;
    enabledFrom: VersionRecord<string[]>;
    disabledFrom: VersionRecord<string[]>;
}

/**
 * This is the configuration file for Better-Moodle.
 * It it used to toggle features to be disabled by default.
 * It also allows disabling a feature depending on the moodleVersion a build uses.
 */
export default GlobalConfig;
