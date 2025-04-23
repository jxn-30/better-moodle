// For some reason, importing from ./_configs.d.ts does not work, so we're just duplicating here :(
type MoodleVersion = 400 | 401 | 402 | 403 | 404 | 405;

type VersionRecord<ValueType> = Partial<Record<MoodleVersion, ValueType>>;

export interface GlobalConfig {
    /** This is the schema file we are using. */
    $schema: '_globalSchema.json';
    /** If a feature is specific to only a single moodle instance (e.g. a bugfix for instance modifications), it is a good idea to disable them in general and explicitely include them in the specific config via includeNonDefaultFeatures. */
    defaultDisabled: string[];
    /** For each version, we can specify features and featureGroups that should not be included if the moodle instance version is below the key, e.g. if a feature does not make sense for moodle versions before 405. */
    enabledFrom: VersionRecord<string[]>;
    /** For each version, we can specify features and featureGroups that should not be included if the moodle instance version is above the key, e.g. if a feature does not make sense for moodle versions since 405. */
    disabledFrom: VersionRecord<string[]>;
}

/**
 * This is the configuration file for Better-Moodle.
 * It it used to toggle features to be disabled by default.
 * It also allows disabling a feature depending on the moodleVersion a build uses.
 */
export default GlobalConfig;
