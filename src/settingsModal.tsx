import awaitImports from '@/imports';
import { getLoadingSpinner } from '@/DOM';
import globalStyle from '!/index.module.scss';
import { Modal } from '@/Modal';
import { requirePromise } from '@/require.js';
import { lt as semverLt } from '@/semver';
import settingsStyle from '!/settings.module.scss';
import { STORAGE_V2_SEEN_SETTINGS_KEY } from './migrateStorage';
import TempStorage from '@/TempStorage';
import type { ThemeBoostBootstrapTooltipClass } from '#/require.js/theme_boost/bootstrap/tooltip.d.ts';
import { BETTER_MOODLE_LANG, LL } from 'i18n';
import { cachedRequest, NETWORK_CACHE_KEY, request } from '@/network';
import {
    debounce,
    htmlToElements,
    isNewInstallation,
    mdID,
    mdToHtml,
    rawGithubPath,
} from '@/helpers';
import { FIVE_MINUTES, ONE_DAY, ONE_MINUTE, ONE_SECOND } from '@/times';
import { GithubLink, NavbarItem, type NavbarItemComponent } from '@/Components';
import {
    highlightNewSettings as highlightNewSettingsSetting,
    newSettingsTooltip as newSettingsTooltipSetting,
    updateNotification as updateNotificationSetting,
} from './features/general';

const seenSettings = GM_getValue<string[]>(STORAGE_V2_SEEN_SETTINGS_KEY, []);

// region trigger button for settings modal
const settingsBtnTitle = `Better-Moodle:\xa0${LL.settings.modal.title()}`;

const SettingsBtnIcon = (
    <i className="fa fa-gears fa-fw" role="img" title={settingsBtnTitle}></i>
) as HTMLElement;
const SettingsBtn = (
    <NavbarItem order={999}>
        <div
            id={settingsStyle.openSettingsBtn}
            role="button"
            className="nav-link position-relative icon-no-margin loading"
            title={settingsBtnTitle}
            aria-label={settingsBtnTitle}
        >
            {SettingsBtnIcon}
        </div>
    </NavbarItem>
) as NavbarItemComponent;
const UpdateAvailableBadge = (
    <div className="count-container"></div>
) as HTMLDivElement;

// append the Button to the navbar
SettingsBtn.put();
// endregion

// region changelog button
const changelogPath = `/blob/${__GITHUB_BRANCH__}/CHANGELOG.md`;
const ChangelogBtn = (
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

const changelogIdPrefix = 'changelog';

/**
 * Fetches the changelog from the GitHub repo and converts it to HTML.
 * Uses the cached HTML if it is not older than 5 minutes.
 * @returns the HTML string of the changelog
 */
const getChangelogHtml = () =>
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

/**
 * Fetches the support document from the GitHub repo and converts it to HTML.
 * Uses the cached HTML if it is not older than 24 hours.
 * @returns the HTML string of the support document
 */
const getSupportHtml = () =>
    cachedRequest(
        rawGithubPath(`support/${BETTER_MOODLE_LANG}.md`),
        ONE_DAY,
        'text',
        md => mdToHtml(md, 3)
    ).then(({ value }) => value);

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
        buttons: { cancel: LL.support.close() },
        removeOnClose: true,
    }).show();
});

const latestVersionEl = (<code></code>) as HTMLElement;

const SupportWrapper = (
    <div
        id={settingsStyle.supportWrapper}
        className="position-absolute z-index-1 d-flex flex-row small card border-light mb-3"
    >
        {SupportBtn}
        <div className="d-flex flex-row flex-lg-column align-items-center">
            <span>
                {LL.settings.modal.installedVersion()}:{' '}
                <code>{GM_info.script.version}</code>
            </span>
            <span>
                {LL.settings.modal.latestVersion()}: {latestVersionEl}
            </span>
        </div>
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
        buttons: { save: LL.update.reload(), cancel: LL.update.close() },
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

let updateCheckRetryTimeout: ReturnType<(typeof window)['setTimeout']> | null;

/**
 * Checks if there is a newer version of Better-Moodle available.
 * If yes, an update button is added to settings modal.
 * The latest available version is shown in settings modal.
 * If enabled, a red dot is appended to the settings trigger button.
 * @returns void
 */
const checkForUpdates = () =>
    getLoadingSpinner()
        .then(spinner => latestVersionEl.replaceChildren(spinner))
        .then(() =>
            request(
                `https://api.github.com/repos/${__GITHUB_USER__}/${__GITHUB_REPO__}/releases/latest`
            )
        )
        .then(res => res.json())
        .then(({ tag_name: latestVersion }: { tag_name: string }) => {
            if (!latestVersion) {
                throw new Error(
                    `It is unlikely that ${JSON.stringify(latestVersion)} is the latest version. Aborting update check, please try again in a minute.`
                );
            }

            latestVersionEl.replaceChildren(latestVersion);

            return semverLt(GM_info.script.version, latestVersion);
        })
        .then(updateAvailable => {
            updateCheckRetryTimeout = null;
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
        })
        .catch(() => {
            updateCheckRetryTimeout ??= setTimeout(
                () => void checkForUpdates(),
                ONE_MINUTE
            );
        });

void checkForUpdates();
updateNotificationSetting.onChange(() => void checkForUpdates());

// endregion

// region export and import settings
// region export settings
const ExportBtn = (
    <button
        className="btn btn-outline-primary"
        title={LL.settings.modal.export()}
    >
        <i className="fa fa-download fa-fw"></i>
        <span>{LL.settings.modal.export()}</span>
    </button>
);

ExportBtn.addEventListener('click', e => {
    e.preventDefault();
    const unwantedKeys = new Set([NETWORK_CACHE_KEY]);
    const storage = Object.fromEntries(
        GM_listValues()
            .filter(key => !unwantedKeys.has(key))
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
    <button
        className="btn btn-outline-primary"
        title={LL.settings.modal.import()}
    >
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
            const result = reader.result ?? '{}';
            const config = JSON.parse(
                result instanceof ArrayBuffer ?
                    new TextDecoder('utf-8').decode(new Uint8Array(result))
                :   result
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

// region search
const SearchInput = (
    <input
        className="form-control-sm form-control"
        type="search"
        placeholder={LL.settings.modal.search()}
    />
) as HTMLInputElement;
const SearchStyle = <style></style>;
const SearchWrapper = (
    <div className="form-group ml-auto mr-auto">
        {SearchInput}
        <i class="fa-solid fa-search"></i>
        {SearchStyle}
    </div>
);

SearchInput.addEventListener(
    'input',
    debounce(() => {
        const search = SearchInput.value.trim();
        if (!search) SearchStyle.textContent = '';
        else {
            SearchStyle.textContent = `
#${settingsStyle.settingsForm} .icons-collapse-expand {
    display: none;
}

#${settingsStyle.settingsForm} .fcontainer.collapseable {
    display: block;
}

#${settingsStyle.settingsForm} .fitem:not([data-search*="${CSS.escape(search)}" i]),
#${settingsStyle.settingsForm} fieldset:not(:has(.fitem[data-search*="${CSS.escape(search)}" i])) {
    display: none;
}
  `;
        }
    }, 100)
);

document.addEventListener('keydown', e => {
    if (e.key === 'k' && e.ctrlKey) {
        e.preventDefault();
        SearchInput.focus();
    }
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
                {__FEATURE_GROUPS__
                    .map(group => featureGroups.get(group)?.FieldSet)
                    .filter(fieldset => fieldset !== undefined)}
            </form>
        </>
    ),
    footer: (
        <div
            className="btn-group mr-auto"
            id={settingsStyle.settingsFooterBtns}
        >
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
        void requirePromise(['core/toast'] as const).then(
            ([{ add }]) =>
                void add(LL.settings.saved(), {
                    type: 'success',
                    autohide: true,
                    closeButton: true,
                })
        );
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
        SearchWrapper,
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
    // all settings are now seen!
    if (!newBadges.size) {
        newSettingsTooltip?.dispose();
        newSettingsTooltip = null;
    }
};

// work with unseen settings on the modal body
void settingsModal.getBody().then(([body]) => {
    // find the "New!"-Badges
    body.querySelectorAll(
        `.fcontainer .${settingsStyle.newSettingBadge}`
    ).forEach(badge => newBadges.add(badge as HTMLSpanElement));
    const debounced = debounce(
        () => markVisibleNewSettingsAsSeen(body),
        ONE_SECOND
    );
    body.addEventListener('scrollend', debounced);

    // initially check when modal is being shown
    void settingsModal.onShown(() => markVisibleNewSettingsAsSeen(body));

    /**
     * Updates the visibility status of the "New!"-Badges by toggling a class on modal body
     * @returns void
     */
    const updateNewBadgesVisibility = () =>
        body.classList.toggle(
            settingsStyle.hideNewSettingBadges,
            !highlightNewSettingsSetting.value
        );
    updateNewBadgesVisibility();

    highlightNewSettingsSetting.onInput(() => updateNewBadgesVisibility());
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
        new Set(seenSettings.map(id => settingIDMap.get(id)?.id)).intersection(
            allSettingIDs
        )
    )
);

// "New!"-Tooltip if there are unseen settings or no settings ever seen
let newSettingsTooltip: ThemeBoostBootstrapTooltipClass | null;
if (
    isNewInstallation ||
    seenSettings.length === 0 ||
    (newSettingsTooltipSetting.value &&
        featureGroups.values().some(group => group.hasNewSetting))
) {
    void requirePromise(['theme_boost/bootstrap/tooltip'] as const)
        .then(([Tooltip]) => {
            SettingsBtnIcon.title = LL.settings.newBadge();
            return new Tooltip(SettingsBtnIcon, {
                trigger: 'manual',
                title: LL.settings.newBadge(),
                template: (
                    (
                        <div className="tooltip" role="tooltip">
                            <div className="arrow"></div>
                            <div
                                className={[
                                    'tooltip-inner badge bg-success text-uppercase',
                                    globalStyle.shining,
                                    globalStyle.sparkling,
                                    settingsStyle.newSettingBadge,
                                ]}
                            ></div>
                        </div>
                    ) as HTMLDivElement
                ).outerHTML,
            });
        })
        .then(tooltip => {
            tooltip
                .getTipElement()
                .addEventListener('click', () => SettingsBtn.click());
            tooltip.show();
            tooltip.update();
            newSettingsTooltip = tooltip;
        });
    let listenersAttached = false;
    void settingsModal.onShown(() => {
        if (!newSettingsTooltip || listenersAttached) return;
        listenersAttached = true;
        /**
         * Hides the "New!"-Tooltip
         */
        const hide = () => {
            newSettingsTooltip?.hide();
        };
        /**
         * Shows the "New!"-Tooltip (the manual update seems to be necessary)
         */
        const show = () => {
            newSettingsTooltip?.show();
            newSettingsTooltip?.update();
        };
        hide();

        // if this is a new installation, we want to mark all settings as seen to avoid visual overload on next page reload
        if (isNewInstallation || seenSettings.length === 0) {
            GM_setValue(
                STORAGE_V2_SEEN_SETTINGS_KEY,
                Array.from(allSettingIDs)
            );
        }

        SettingsBtn.addEventListener('mouseenter', show);
        SettingsBtn.addEventListener('mouseleave', hide);
        SettingsBtn.addEventListener('focusin', show);
        SettingsBtn.addEventListener('focusout', hide);
        newSettingsTooltip.getTipElement().addEventListener('mouseenter', show);
        newSettingsTooltip.getTipElement().addEventListener('mouseleave', hide);
    });
}
// endregion
