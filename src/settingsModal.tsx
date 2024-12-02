import awaitImports from '@/imports';
import { GithubLink } from '@/Components';
import { Modal } from '@/Modal';
import { request } from '@/network';
import { lt as semverLt } from '@/semver';
import settingsStyle from './style/settings.module.scss';
import { STORAGE_V2_SEEN_SETTINGS_KEY } from './migrateStorage';
import TempStorage from '@/TempStorage';
import { updateNotification as updateNotificationSetting } from './features/general';
import { BETTER_MOODLE_LANG, LL } from './i18n/i18n';
import {
    debounce,
    htmlToElements,
    mdID,
    mdToHtml,
    PREFIX,
    rawGithubPath,
} from '@/helpers';
import { getLoadingSpinner, readyCallback } from '@/DOM';

const seenSettings = GM_getValue<string[]>(STORAGE_V2_SEEN_SETTINGS_KEY, []);

// we need this to have some kind of sorting in settings
const groups = [
    'general',
    'darkmode',
    'dashboard',
    'myCourses',
    'linkIcons',
] as const;

// region trigger button for settings modal
const settingsBtnTitle = `Better-Moodle:\xa0${LL.settings.modal.title()}`;

const SettingsBtn = (
    <div>
        <div
            id={settingsStyle.openSettingsBtn}
            role="button"
            class="nav-link position-relative icon-no-margin loading"
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
const UpdateAvailableBadge = (
    <div class="count-container"></div>
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
const changelogIdPrefix = 'changelog';

/**
 * Fetches the changelog from the GitHub repo and converts it to HTML.
 * Uses the cached HTML if it is not older than 5 minutes.
 * @returns the HTML string of the changelog
 */
const getChangelogHtml = () =>
    changelogHtml ?
        Promise.resolve(changelogHtml)
    :   request(
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
            .then(md => mdToHtml(md, 3, changelogIdPrefix))
            .then(html => {
                changelogHtml = html;
                setTimeout(() => (changelogHtml = ''), changelogCache);
                return html;
            });

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

// region support button and information
const supportPath = `/blob/${__GITHUB_BRANCH__}/support/${BETTER_MOODLE_LANG}.md`;
let supportHtml: string;
const supportCache = 1000 * 60 * 60 * 24; // 24 hours

/**
 * Fetches the support document from the GitHub repo and converts it to HTML.
 * Uses the cached HTML if it is not older than 24 hours.
 * @returns the HTML string of the support document
 */
const getSupportHtml = () =>
    supportHtml ? supportHtml : (
        request(
            rawGithubPath(
                `support/${BETTER_MOODLE_LANG}.md?_=${Math.floor(Date.now() / supportCache)}`
            )
        )
            .then(res => res.text())
            .then(md => mdToHtml(md, 3))
            .then(html => {
                supportHtml = html;
                setTimeout(() => (supportHtml = ''), supportCache);
                return html;
            })
    );

const SupportBtn = (
    <button className="btn btn-link btn-sm">
        <i className="fa fa-question-circle fa-fw"></i>
        {LL.support.title()}
    </button>
);

SupportBtn.addEventListener('click', e => {
    e.preventDefault();
    new Modal({
        type: 'ALERT',
        large: true,
        title: (
            <>
                <GithubLink path={supportPath} /> {LL.support.title()}
            </>
        ),
        body: getSupportHtml(),
        buttons: {
            cancel: LL.support.close(),
        },
        removeOnClose: true,
    }).show();
});

const latestVersionEl = (
    <code id={PREFIX('settings_latest-version')}></code>
) as HTMLElement;

const SupportWrapper = (
    <div
        id={settingsStyle.supportWrapper}
        className="position-absolute z-index-1 d-flex flex-row flex-lg-column small card border-light mb-3"
    >
        {SupportBtn}
        <span>
            {LL.settings.modal.installedVersion()}:{' '}
            <code>{GM_info.script.version}</code>
        </span>
        <span>
            {LL.settings.modal.latestVersion()}: {latestVersionEl}
        </span>
    </div>
);

const UpdateBtn = (
    <button className="btn btn-primary btn-sm">{LL.update.btn()}</button>
);
UpdateBtn.addEventListener('click', e => {
    e.preventDefault();

    new Modal({
        type: 'SAVE_CANCEL',
        title: LL.update.title(),
        body: getChangelogHtml().then(changelogHtml => {
            const body = <></>;
            body.append(
                ...Array.from(htmlToElements(mdToHtml(LL.update.body()))),
                ...Array.from(htmlToElements(changelogHtml))
            );
            const currentId = mdID(
                `* ${GM_info.script.version}`,
                changelogIdPrefix
            );
            body.querySelectorAll(
                `[id^="${currentId}"], [id^="${currentId}"] ~ *`
            ).forEach(el => el.remove());
            return body;
        }),
        buttons: {
            save: LL.update.reload(),
            cancel: LL.update.close(),
        },
        removeOnClose: true,
    })
        .onSave(() => window.location.reload())
        .on('bodyRendered', () => {
            if (GM_info.script.downloadURL) {
                open(GM_info.script.downloadURL, '_self');
            }
        })
        .show();
});

/**
 * Checks if there is a newer version of Better-Moodle available.
 * If yes, an update button is added to settings modal.
 * The latest available version is shown in settings modal.
 * If enabled, a red dot is appended to the settings trigger button.
 * @returns void
 */
const checkForUpdates = () =>
    getLoadingSpinner()
        .then(spinner =>
            document
                .getElementById(latestVersionEl.id)
                ?.replaceChildren(spinner)
        )
        .then(() =>
            request(
                `https://api.github.com/repos/${__GITHUB_USER__}/${__GITHUB_REPO__}/releases/latest`
            )
        )
        .then(res => res.json())
        .then(({ tag_name: latestVersion }: { tag_name: string }) => {
            latestVersionEl.replaceChildren(latestVersion);

            return semverLt(GM_info.script.version, latestVersion);
        })
        .then(updateAvailable => {
            if (!updateAvailable) {
                UpdateAvailableBadge.remove();
                return;
            }
            document
                .getElementById(settingsStyle.supportWrapper)
                ?.append(UpdateBtn);
            if (updateNotificationSetting.value) {
                document
                    .getElementById(settingsStyle.openSettingsBtn)
                    ?.append(UpdateAvailableBadge);
            } else UpdateAvailableBadge.remove();
        });

void checkForUpdates();
updateNotificationSetting.onChange(() => void checkForUpdates());

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
const newBadges = new Set<HTMLSpanElement>();

// anything beyond this point requires all features to be loaded
const featureGroups = await awaitImports();

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
        <>
            {SupportWrapper}
            <form id={settingsStyle.settingsForm} className="mform">
                {groups
                    .map(group => featureGroups.get(group)?.FieldSet)
                    .filter(fieldset => fieldset !== undefined)}
            </form>
        </>
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
    .onShown(() => void checkForUpdates())
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
    .onReady(() =>
        document
            .getElementById(settingsStyle.openSettingsBtn)
            ?.classList.remove('loading')
    )
    .setTrigger(SettingsBtn);

// append the link to moodle settings to the modal header
void settingsModal.getTitle().then(title =>
    title.after(
        <a href="/user/preferences.php" target="_blank">
            {LL.settings.modal.moodleSettings()}
        </a>
    )
);

/**
 * Check for currently visible "New!"-Badges and mark these settings as seen
 * @param body - the modal body
 */
const markVisibleNewSettingsAsSeen = (body: HTMLElement) => {
    const { top: bodyTop, bottom: bodyBottom } = body.getBoundingClientRect();
    newBadges.forEach(badge => {
        if (!badge.closest('.fcontainer.show')) return;
        const { top: badgeTop, bottom: badgeBottom } =
            badge.getBoundingClientRect();
        if (badgeTop < bodyTop || badgeBottom > bodyBottom) return;
        newBadges.delete(badge);
        const setting = badge.dataset.setting;
        if (setting) {
            seenSettings.push(setting);
        }
        GM_setValue(STORAGE_V2_SEEN_SETTINGS_KEY, seenSettings);
    });
};

// find the "New!"-Badges
void settingsModal.getBody().then(([body]) => {
    body.querySelectorAll(
        `.fcontainer .${settingsStyle.newSettingBadge}`
    ).forEach(badge => newBadges.add(badge as HTMLSpanElement));
    const debounced = debounce(() => markVisibleNewSettingsAsSeen(body), 1000);
    body.addEventListener('scrollend', debounced);
});

// migrate and cleanup storage of seen settings
const allSettingIDs = featureGroups
    .values()
    .reduce(
        (acc, group) => acc.union(new Set(group.settingIDs)),
        new Set<string>()
    );
const settingIDMap = new Map([
    ...featureGroups.values().flatMap(group => group.settingIDMap),
]);
GM_setValue(
    STORAGE_V2_SEEN_SETTINGS_KEY,
    Array.from(
        new Set(
            seenSettings.values().map(id => settingIDMap.get(id)?.id)
        ).intersection(allSettingIDs)
    )
);
// endregion
