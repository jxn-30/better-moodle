import { Modal } from './_lib/Modal';
import { GithubLink } from './_lib/Components';
import settingsStyle from './style/settings.module.scss';
import { ready } from './_lib/DOM';

// region trigger button for settings modal
const settingsBtnTitle = 'Settings';

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

// region export and import settings
// region export settings
const ExportBtn = (
    <button className="btn btn-outline-primary">
        <i className="fa fa-download fa-fw"></i>
        <span>modals.export</span>
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
        <span>modals.import</span>
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
            <GithubLink path="" /> Better-Moodle:&nbsp;modals.settings.title
        </>
    ),
    body: <form id={settingsStyle.settingsForm}>Hello world! ❤️</form>,
    footer: (
        <div class="btn-group mr-auto" id={settingsStyle.settingsFooterBtns}>
            {/* Changelog btn */}
            <GithubLink
                path="/blob/main/CHANGELOG.md"
                icon={false}
                class="btn btn-outline-primary"
            >
                <i class="fa fa-history fa-fw"></i>
                <span>modals.changelog</span>
            </GithubLink>

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
settingsModal.getTitle().then(title => {
    title.after(
        <a href="/user/preferences.php" target="_blank">
            modals.settings.moodleSettings
        </a>
    );
});
// endregion
