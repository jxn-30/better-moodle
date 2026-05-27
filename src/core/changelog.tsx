import { cachedRequest } from '#lib/network';
import { FIVE_MINUTES } from '#lib/times';
import { GithubLink } from '#lib/Components';
import { LL } from '#i18n';
import { Modal } from '#lib/Modal';
import { mdToHtml, rawGithubPath } from '#lib/helpers';

const changelogPath = `/blob/${__GITHUB_BRANCH__}/CHANGELOG.md`;

export const changelogIdPrefix = 'changelog';

/**
 * Fetches the changelog from the GitHub repo and converts it to HTML.
 * Uses the cached HTML if it is not older than 5 minutes.
 * @returns the HTML string of the changelog
 */
export const getChangelogHtml = () =>
    cachedRequest(rawGithubPath('CHANGELOG.md'), FIVE_MINUTES, 'text', md =>
        mdToHtml(
            md
                // remove the title
                .replace(/^#\s.*/g, '')
                // add a horizontal rule before each heading except first
                .trim()
                .replace(/(?<=\n)(?=^##\s)/gm, '---\n\n'),
            3,
            changelogIdPrefix
        )
    ).then(({ value }) => value);

export const ChangelogBtn = (
    <GithubLink
        path={changelogPath}
        icon={false}
        className="btn btn-outline-primary"
        title={LL.settings.changelog()}
    >
        <i className="fa fa-history fa-fw"></i>
        <span>{LL.settings.changelog()}</span>
    </GithubLink>
);
ChangelogBtn.addEventListener('click', e => {
    e.preventDefault();
    new Modal({
        type: 'ALERT',
        large: true,
        title: (
            <>
                <GithubLink path={changelogPath} /> Better-Moodle:&nbsp;
                {LL.settings.changelog()}
            </>
        ),
        body: getChangelogHtml(),
        removeOnClose: true,
    }).show();
});
