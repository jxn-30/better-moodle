import featureGroups from '@/imports';
import { GithubLink } from '@/Components';
import { LL } from './i18n/i18n';
import { Modal } from '@/Modal';
import { readyCallback } from '@/DOM';
import settingsStyle from './style/settings.module.scss';
import TempStorage from '@/TempStorage';
import { mdToHtml, rawGithubPath } from '@/helpers';

// we need this to have some kind of sorting in settings
const groups = ['general', 'darkmode', 'dashboard', 'myCourses'] as const;

// region trigger button for settings modal
const settingsBtnTitle = `Better-Moodle:\xa0${LL.settings.modal.title()}`;

const SettingsBtn = (
    <div>
        <div
            role="button"
            class="nav-link position-relative icon-no-margin"
            title={settingsBtnTitle}
            aria-label={settingsBtnTitle}
        >
            <i
                class="fa fa-gears fa-fw"
                role="img"
                title={settingsBtnTitle}
            ></i>
        </div>
    </div>
) as HTMLDivElement;

// append the Button to the navbar
readyCallback(() =>
    document
        .querySelector('#usernavigation .usermenu-container')
        ?.before(SettingsBtn)
);
// endregion

// region changelog button
const changelogPath = `/blob/${__GITHUB_BRANCH__}/CHANGELOG.md`;
const ChangelogBtn = (
    <GithubLink
        path={changelogPath}
        icon={false}
        class="btn btn-outline-primary"
    >
        <i class="fa fa-history fa-fw"></i>
        <span>{LL.settings.changelog()}</span>
    </GithubLink>
);

let changelogHtml: string;
const changelogCache = 1000 * 60 * 5; // 5 minutes

/**
 * Fetches the changelog from the GitHub repo and converts it to HTML.
 * Uses the cached HTML if it is not older than 5 minutes.
 * @returns the HTML string of the changelog
 */
const getChangelogHtml = () =>
    changelogHtml ? changelogHtml : (
        fetch(
            rawGithubPath(
                `CHANGELOG.md?_=${Math.floor(Date.now() / changelogCache)}`
            )
        )
            .then(res => res.text())
            .then(md =>
                md
                    // remove the title
                    .replace(/^#\s.*/g, '')
                    // add a horizontal rule before each heading except first
                    .trim()
                    .replace(/(?<=\n)(?=^##\s)/gm, '---\n\n')
            )
            .then(md => mdToHtml(md, 3))
            .then(html => {
                changelogHtml = html;
                setTimeout(() => (changelogHtml = ''), changelogCache);
                return html;
            })
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
// endregion

// region export and import settings
// region export settings
const ExportBtn = (
    <button className="btn btn-outline-primary">
        <i className="fa fa-download fa-fw"></i>
        <span>{LL.settings.modal.export()}</span>
    </button>
);

ExportBtn.addEventListener('click', e => {
    e.preventDefault();
    const storage = Object.fromEntries(
        GM_listValues()
            .toSorted() // we want to sort the keys because why not
            .map(key => [key, GM_getValue(key)])
    );
    const blob = new Blob([JSON.stringify(storage)], {
        type: 'application/json',
    });
    // cannot use GM_download here as JSON is blocked by default (at least in Tampermonkey) and this would cause more confusion than it's worth
    const link = document.createElement('a');
    link.download = 'better-moodle-settings.json';
    link.href = URL.createObjectURL(blob);
    link.click();
});
// endregion

// region import settings
const ImportBtn = (
    <button className="btn btn-outline-primary">
        <i className="fa fa-upload fa-fw"></i>
        <span>{LL.settings.modal.import()}</span>
    </button>
);

ImportBtn.addEventListener('click', e => {
    e.preventDefault();
    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.accept = '.json';
    importInput.addEventListener('change', () => {
        const file = importInput.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const config = JSON.parse(
                reader.result?.toString() ?? '{}'
            ) as Record<string, unknown>;
            Object.entries(config)
                .toSorted(([a], [b]) => a.localeCompare(b))
                .forEach(([key, value]) => GM_setValue(key, value));
            window.location.reload();
        });
        reader.readAsText(file);
    });
    importInput.click();
});
// endregion
// endregion

// region settings modal
const settingsModal = new Modal({
    type: 'SAVE_CANCEL',
    large: true,
    scrollable: true,
    backgroundImage: rawGithubPath('img/moothel.png'),
    title: (
        <>
            <GithubLink path={`/tree/${__GITHUB_BRANCH__}`} />{' '}
            Better-Moodle:&nbsp;
            {LL.settings.modal.title()}
        </>
    ),
    body: (
        <form id={settingsStyle.settingsForm} className="mform">
            {groups
                .map(group => featureGroups.get(group)?.FieldSet)
                .filter(fieldset => fieldset !== undefined)}
        </form>
    ),
    footer: (
        <div class="btn-group mr-auto" id={settingsStyle.settingsFooterBtns}>
            {/* Changelog btn */}
            {ChangelogBtn}

            {/* Export settings btn */}
            {ExportBtn}

            {/* Import settings btn */}
            {ImportBtn}
        </div>
    ),
})
    .onCancel(() => featureGroups.forEach(group => group.undoSettings()))
    .onSave(event => {
        featureGroups.forEach(group => group.saveSettings());
        // reload the page if required
        if (TempStorage.settingsRequireReload) {
            // do not close the modal
            event.preventDefault();
            window.location.reload();
        }
    })
    .setTrigger(SettingsBtn);

// append the link to moodle settings to the modal header
settingsModal
    .getTitle()
    .then(title => {
        title.after(
            <a href="/user/preferences.php" target="_blank">
                {LL.settings.modal.moodleSettings()}
            </a>
        );
    })
    .catch(console.error);
// endregion
