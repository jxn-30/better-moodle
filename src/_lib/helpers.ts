export const githubPath = (path: string) => `${__GITHUB_URL__}/${path}`;
export const rawGithubPath = (path: string) =>
    `https://raw.githubusercontent.com/${__GITHUB_USER__}/${__GITHUB_REPO__}/main/${path}`;
