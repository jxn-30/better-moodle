export type MoodleVersion = 400 | 401 | 402 | 403 | 404 | 405;

interface BaseConfig {
    /** This is the schema file we are using. */
    $schema: '_schema.json';
    /** The short name of the Uni. Used for the userscript name. */
    uniName: string;
    /** A namespace for the userscript to allow userscript managers to uniquely identify it. */
    namespace: string;
    /**
     * Additional authors for this uni-specific version of Better-Moodle.
     * It is suggested to only list maintainers here instead of each single contributor.
     */
    additionalAuthors?: string[];
    /**
     * A description of the userscript in multiple languages.
     * It is suggested to provide at least english ("") and the native / primary language of the userbase.
     */
    description: Record<string, string>;
    /**
     * Information about the GitHub repository this Better-Moodle lives on.
     * This is used to generate download and update links as well as links to the repository.
     */
    github: {
        /** The GitHub user hosting the repository. */
        user: string;
        /** The actual repository name. */
        repo: string;
        /** The branch this instance ist developed on. */
        branch?: string;
    };
    /** A URL that is resolved to the Better-Moodle icon. */
    icon: string;
    /**
     * The URL this Moodle is accessible at.
     * This is used to generate the `@match` property in the userscript metadata.
     */
    moodleUrl: string;
    /**
     * We haven't found a way to find out which moodle version we're currently running on.
     * Setting a version here enables specific compatibility patches required for lower versions.
     * If version is not known, the lowest realisticly possible value should be chosen.
     */
    moodleVersion: MoodleVersion;
    /**
     * Does this instance of Better-Moodle require a connection to the internet?
     * If so, list the origins that need to be connected to.
     * You do not have to add better-moodle.dev as it is included by standard.
     */
    connects: string[];
    /**
     * Should this instance of Better-Moodle load any additional fixes that are not included in every single instance?
     * List the IDs of these fixes here.
     */
    fixes?: string[];
    /**
     * Should this instance of Better-Moodle load any features or featureGroups that are not included by default?
     * Features and feature groups can be defaultDisabled via global config.
     * List the IDs of these features or feature groups here.
     */
    includeNonDefaultFeatures?: string[];
}

interface ConfigWithExplicitFeatures extends BaseConfig {
    /**
     * A list of features that should be included in this instance of Better-Moodle.
     * If this is set, only the features listed here (+ general, which is always included) will be included.
     *
     * Features are included by their full ID `{group}.{feature}`.
     * Specifying a group ID will include all features in that group.
     *
     * If this is set, the `excludeFeatures` property cannot be used.
     */
    includeFeatures: string[];
}

interface ConfigWithExcludedFeatures extends BaseConfig {
    /**
     * A list of features that should be excluded in this instance of Better-Moodle.
     * If this is set, only the features not listed here will be included.
     * If `general` is included in here, it will still be included as the feature group cannot be disabled.
     *
     * Features are excluded by their full ID `{group}.{feature}`.
     * Specifying a group ID will exclude all features in that group.
     *
     * If this is set, the `includeFeatures` property cannot be used.
     */
    excludeFeatures: string[];
}

export type Config =
    | BaseConfig
    | ConfigWithExplicitFeatures
    | ConfigWithExcludedFeatures;

/**
 * This is the configuration file for Better-Moodle.
 * It configures metadata for the userscript as well as which features should be included in this instance.
 */
export default Config;
