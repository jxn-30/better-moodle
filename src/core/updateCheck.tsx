import { getLoadingSpinner } from '#lib/DOM';
import { LL } from '#i18n';
import { Modal } from '#lib/Modal';
import { ONE_MINUTE } from '#lib/times';
import { request } from '#lib/network';
import { lt as semverLt } from '#lib/semver';
import settingsStyle from '#style/settings.module.scss';
import { changelogIdPrefix, getChangelogHtml } from '#core/changelog';
import { htmlToElements, isNightly, mdID, mdToHtml } from '#lib/helpers';
import {
    releaseChannel as releaseChannelSetting,
    updateNotification as updateNotificationSetting,
} from '#feats/general';

const latestVersionEl = (<code></code>) as HTMLElement;

export const VersionBox = (
    <div className="d-flex flex-row w-100 align-items-center justify-content-around">
        <span>
            {LL.settings.modal.installedVersion()}: <br />
            {isNightly ? '🌜️ ' : ''}
            <code>{GM_info.script.version}</code>
        </span>
        <span>
            {LL.settings.modal.latestVersion()}: <br />
            {isNightly ? '🌜️ ' : ''}
            {latestVersionEl}
        </span>
    </div>
);

const UpdateAvailableBadge = (
    <div className="count-container"></div>
) as HTMLDivElement;

const UpdateBtn = (
    <button className="btn btn-primary btn-sm col-lg-3">
        {LL.update.btn()}
    </button>
);
UpdateBtn.addEventListener('click', e => {
    e.preventDefault();

    showUpdateModal();
});

/**
 * Shows the update modal and opens the installation URL to trigger the userscript manager
 * @param changelog - whether to show the changelog since the last version
 * @param downloadURL - the installation URL to use for update
 * @returns the modal instance
 */
const showUpdateModal = (
    changelog = true,
    downloadURL = GM_info.script.downloadURL
) =>
    new Modal({
        type: 'SAVE_CANCEL',
        title: LL.update.title(),
        body:
            changelog ?
                getChangelogHtml().then(changelogHtml => {
                    const body = <></>;
                    body.append(
                        ...Array.from(
                            htmlToElements(
                                mdToHtml(LL.update.body(Number(!changelog)))
                            )
                        ),
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
                })
            :   <>
                    {...Array.from(
                        htmlToElements(
                            mdToHtml(LL.update.body(Number(!changelog)))
                        )
                    )}
                </>,
        buttons: { save: LL.update.reload(), cancel: LL.update.close() },
        removeOnClose: true,
    })
        .onSave(() => window.location.reload())
        .on('bodyRendered', () => {
            if (downloadURL) {
                open(downloadURL, '_self');
            }
        })
        .show();

let updateCheckRetryTimeout: ReturnType<(typeof window)['setTimeout']> | null;

/**
 * Fetches the latest version from GitHub-API
 * @returns a promise containing the latest version
 */
export const getLatestVersion = (): Promise<string | undefined | null> =>
    isNightly ?
        request(GM_info.script.updateURL)
            .then(res => res.text())
            .then(meta => /(?<=^\s*\/\/\s*@version\s*)\S.*?$/m.exec(meta)?.[0])
    :   request(
            `https://api.github.com/repos/${__GITHUB_USER__}/${__GITHUB_REPO__}/releases/latest`
        )
            .then(res => res.json())
            .then(
                ({ tag_name: latestVersion }: { tag_name: string }) =>
                    latestVersion
            );

/**
 * Checks if there is a newer version of Better-Moodle available.
 * If yes, an update button is added to settings modal.
 * The latest available version is shown in settings modal.
 * If enabled, a red dot is appended to the settings trigger button.
 * @returns void
 */
export const checkForUpdates = () =>
    getLoadingSpinner('settings')
        .then(spinner => latestVersionEl.replaceChildren(spinner))
        .then(getLatestVersion)
        .then(latestVersion => {
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

releaseChannelSetting.onChange(() => {
    // do not show the modal when change is triggered by the reset
    if (releaseChannelSetting.isBeingReset) return;

    const targetChannel = releaseChannelSetting.value as 'stable' | 'nightly';
    const installURLs = {
        stable: __STABLE_DOWNLOAD_URL__,
        nightly: __NIGHTLY_DOWNLOAD_URL__,
    } as const;

    new Modal({
        type: 'SAVE_CANCEL',
        title: mdToHtml(
            LL.switchReleaseChannel.modal.title(targetChannel),
            1,
            '',
            false
        ),
        body: mdToHtml(LL.switchReleaseChannel.channels[targetChannel]()),
        buttons: {
            cancel: LL.switchReleaseChannel.modal.abort(),
            save: LL.switchReleaseChannel.modal.install(),
        },
        removeOnClose: true,
    })
        .onCancel(() => releaseChannelSetting.reset())
        .onSave(() => showUpdateModal(false, installURLs[targetChannel]))
        .show();
});
