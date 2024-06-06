export default interface Config {
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
}
