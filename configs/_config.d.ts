interface BaseConfig {
    uniName: string;
    namespace: string;
    additionalAuthors?: string[];
    description: Record<string, string>;
    github: {
        user: string;
        repo: string;
    };
    icon: string;
    moodleUrl: string;
    connects: string[];
    fixes?: string[];
}

interface ConfigWithExplicitFeatures extends BaseConfig {
    includeFeatures: string[];
}

interface ConfigWithExcludedFeatures extends BaseConfig {
    excludeFeatures: string[];
}

export type Config =
    | BaseConfig
    | ConfigWithExplicitFeatures
    | ConfigWithExcludedFeatures;

export default Config;
