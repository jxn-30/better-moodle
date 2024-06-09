import { GithubLink } from './_lib/Components';
import { LL } from './i18n/i18n';
import { Modal } from './_lib/Modal';
import { ready } from './_lib/DOM';
import settingsStyle from './style/settings.module.scss';
import { mdToHtml, rawGithubPath } from './_lib/helpers';

// region trigger button for settings modal
const settingsBtnTitle = `Better-Moodle:\xa0${LL.settings.modal.title()}`;

const SettingsBtn = (
    <div>
        <a
            href="#"
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
        </a>
    </div>
);

// append the Button to the navbar
ready(() =>
    document
        .querySelector('#usernavigation .usermenu-container')
        ?.before(SettingsBtn)
);
// endregion

// region changelog button
const changelogPath = '/blob/main/CHANGELOG.md';
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
    alert('export not yet implemented');
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
    alert('import not yet implemented');
});
// endregion
// endregion

// region settings modal
const settingsModal = new Modal({
    type: 'SAVE_CANCEL',
    large: true,
    scrollable: true,
    title: (
        <>
            <GithubLink path="" /> Better-Moodle:&nbsp;
            {LL.settings.modal.title()}
        </>
    ),
    body: <form id={settingsStyle.settingsForm}>Hello world! ❤️</form>,
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
    .onShown(() => console.log('Modal shown!'))
    .onCancel(() => console.log('Modal canceled!'))
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
