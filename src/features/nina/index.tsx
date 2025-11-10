import { BooleanSetting } from '@/Settings/BooleanSetting';
import { datetimeToString } from '@/localeString';
import FeatureGroup from '@/FeatureGroup';
import { getHtml } from '@/DOM';
import globalStyle from '!/index.module.scss';
import { JSX } from 'jsx-dom/jsx-runtime';
import { LLFG } from 'i18n';
import { Modal } from '@/Modal';
import { SliderSetting } from '@/Settings/SliderSetting';
import style from './style.module.scss';
import toast from '@/toast';
import type { Alert, AlertCache, AlertSummary } from './types';
import {
    arsToCountyLevel,
    getAlertInfoAttribute,
    getAlertInfoParameter,
    getAlertReferences,
    getAlertTitle,
    getProviderCategory,
    getProviderIcon,
    getProviderLabel,
    providerById,
    providerCategoryType,
} from './util/utils';
import { cachedRequest, type NetworkResponseType } from '@/network';
import {
    getCategoryLabel,
    getSeverityEmoji,
    getSeverityLabel,
    MAX_SEVERITY,
    MESSAGE_TYPE,
    severityToNumber,
    URGENCY,
} from './util/enums';
import { NavbarItem, NavbarItemComponent } from '@/Components';
import { TEN_MINUTES, TEN_SECONDS, THIRTY_SECONDS } from '@/times';

// Define Constants
const LL = LLFG('nina');
const CACHE_KEY = 'nina.cache';
const LOCK_NAME = 'better-moodle-nina-cache';
const API_BASE = 'https://nina.api.proxy.bund.dev/api31';

// The amtliche Regionalschlüssel has been extracted from https://www.xrepository.de/api/xrepository/urn:de:bund:destatis:bevoelkerungsstatistik:schluessel:rs_2021-07-31/download/Regionalschl_ssel_2021-07-31.json
const ARS = __UNI__ === 'cau' ? '010020000000' : '010030000000';
const MUNICIPALTY = __UNI__ === 'cau' ? 'Kiel' : 'Lübeck';

// Define Settings
const civilWarningsSetting = new SliderSetting('civilWarnings', 2, {
    min: 0,
    max: 4,
    step: 1,
    labels: ['off', 'extreme', 'severe', 'moderate', 'minor'],
}).addAlias('nina.civilProtectionWarnings');
const policeWarningSetting = new SliderSetting('policeWarnings', 2, {
    min: 0,
    max: 4,
    step: 1,
    labels: ['off', 'extreme', 'severe', 'moderate', 'minor'],
});
const weatherWarningsSetting = new SliderSetting('weatherWarnings', 2, {
    min: 0,
    max: 4,
    step: 1,
    labels: ['off', 'extreme', 'severe', 'moderate', 'minor'],
}).addAlias('nina.weatherWarnings');
const floodWarningsSetting = new SliderSetting('floodWarnings', 0, {
    min: 0,
    max: 1,
    step: 1,
    labels: ['off', 'all'],
}).addAlias('nina.floodWarnings', old => Number(old));
const inAppNotifications = new BooleanSetting('inAppNotifications', true);
const desktopNotifications = new BooleanSetting(
    'desktopNotifications',
    false
).addAlias('nina.notification');

const notifyUpdates = new BooleanSetting('notifyUpdates', false);
const notifyClearSignal = new BooleanSetting('notifyClearSignal', true);

// Handle alert caching
/**
 * Retrieves the cached active alerts.
 * @returns The cached active alerts.
 */
const getCachedActiveAlerts = () => {
    return GM_getValue<AlertCache | undefined>(CACHE_KEY) ?? {};
};
/**
 * Caches the given active alerts.
 * @param alerts - The active alerts to cache.
 * @returns A promise that resolves when the alerts have been cached.
 */
const updateCachedActiveAlerts = (alerts: Alert[]) =>
    navigator.locks.request(LOCK_NAME, () => {
        const oldAlertCache: AlertCache = getCachedActiveAlerts();
        const newAlertCache: AlertCache = {};

        alerts.forEach(alert => {
            const alertId = alert.identifier;

            newAlertCache[alertId] = {
                notified: oldAlertCache[alertId]?.notified ?? false,
                seen: oldAlertCache[alertId]?.seen ?? false,
                referenceOnly: false,
            };

            // Referenced alerts should also be added to the cache, but as reference only
            getAlertReferences(alert).forEach(ref => {
                newAlertCache[ref.alertId] = {
                    notified:
                        oldAlertCache[ref.alertId]?.notified ??
                        newAlertCache[alert.identifier].notified,
                    seen:
                        oldAlertCache[ref.alertId]?.seen ??
                        newAlertCache[alert.identifier].seen,
                    referenceOnly:
                        newAlertCache[ref.alertId]?.referenceOnly ?? true,
                };
            });
        });

        GM_setValue(CACHE_KEY, newAlertCache);
    });

/**
 * Fetches all alerts for the set location
 * @returns all active alerts
 */
const getAlerts = () =>
    cachedRequest<'json', NetworkResponseType<'json'>, AlertSummary[]>(
        `${API_BASE}/dashboard/${arsToCountyLevel(ARS)}.json`,
        THIRTY_SECONDS,
        'json',
        undefined,
        { headers: { 'Cache-Control': 'no-cache' } } // Idk if this changes anything, but the official App does this
    );
/**
 * Fetches details of a specific alert
 * @param alertId - the alert id
 * @returns alert details
 */
const getAlert = (alertId: string) =>
    cachedRequest<'json', NetworkResponseType<'json'>, Alert>(
        `${API_BASE}/warnings/${alertId}.json`,
        TEN_MINUTES,
        'json'
    );

/**
 * Shortens the description of an alert to len characters.
 * @param alert - the alert to shorten the description for
 * @param len - the maximum length of the description
 * @returns the shortened description
 */
const shortenAlertDescription = (alert: Alert, len = 200) => {
    const description = (
        (
            <p
                dangerouslySetInnerHTML={{
                    __html: getAlertInfoAttribute(alert, 'description') ?? '',
                }}
            />
        ) as HTMLElement
    ).innerText;
    if (description.length > len) {
        return `${description.substring(0, len).trim()}...`;
    }
    return description;
};

/**
 * Shows the details modal for a specific alert.
 * @param alertId - The ID of the alert to show.
 */
const showAlertDetailsModal = (alertId: string) => {
    const alertTitleElem = <span />;
    const alertBodyElem = <div className="px-3" />;
    const alertFooterElem = (
        <span className="d-flex align-items-center text-muted mr-auto" />
    );
    const alertModal = new Modal({
        type: 'ALERT',
        large: true,
        scrollable: true,
        title: alertTitleElem,
        body: alertBodyElem,
        footer: alertFooterElem,
    });
    void getAlert(alertId)
        .then(resp => resp.value)
        .then(alert => {
            const provider = providerById(alert.identifier);

            const isCancel = alert.msgType === MESSAGE_TYPE.CANCEL;

            // Title
            const severity = getAlertInfoAttribute(alert, 'severity')!;
            alertTitleElem.append(
                <>
                    <span
                        dataset={{
                            originalTitle:
                                isCancel ?
                                    LL.msgType.cancel()
                                :   getSeverityLabel(severity, provider),
                            toggle: 'tooltip',
                        }}
                    >
                        {isCancel ? '✖️' : getSeverityEmoji(severity)}
                    </span>{' '}
                    <span>{getAlertTitle(alert)}</span>
                </>
            );

            // Body
            const sent = datetimeToString(new Date(alert.sent));
            alertBodyElem.append(
                <span className="small text-muted">
                    {LL.modal.sentAt()}: {sent}
                </span>,
                <br />
            );

            const onset = getAlertInfoAttribute(alert, 'onset') ?? '';
            const expires = getAlertInfoAttribute(alert, 'expires') ?? '';
            if (onset && expires) {
                alertBodyElem.append(
                    <span className="small text-muted">
                        {datetimeToString(new Date(onset), true, false)}
                        {' - '}
                        {datetimeToString(new Date(expires), true, false)}
                    </span>,
                    <br />
                );
            }

            const description = getAlertInfoAttribute(alert, 'description');
            if (description) {
                alertBodyElem.append(
                    <h5>{LL.modal.description()}</h5>,
                    <p dangerouslySetInnerHTML={{ __html: description }} />
                );
            }
            const instruction = getAlertInfoAttribute(alert, 'instruction');
            if (instruction) {
                alertBodyElem.append(
                    <h5>{LL.modal.instruction()}</h5>,
                    <p dangerouslySetInnerHTML={{ __html: instruction }} />
                );
            }
            const categories = getAlertInfoAttribute(alert, 'category') ?? [];
            if (categories.length > 0) {
                alertBodyElem.append(
                    <div className="small">
                        <b>{LL.modal.categories()}:</b>{' '}
                        <span>
                            {categories.map((category, index) => (
                                <>
                                    <span key={category}>
                                        {getCategoryLabel(category)}
                                    </span>
                                    {index < categories.length - 1 && ', '}
                                </>
                            ))}
                        </span>
                    </div>
                );
            }

            // Footer
            const web = getAlertInfoAttribute(alert, 'web');
            if (web) {
                const linkifiedWeb =
                    web.startsWith('http') ? web : `https://${web}`;
                alertFooterElem.append(
                    <a
                        href={linkifiedWeb}
                        className={globalStyle.noExternalLinkIcon}
                        target="_blank"
                    >
                        <i className="icon fa fa-globe fa-fw"></i>
                    </a>
                );
            }

            const alertFooterTextElem = <div className="ml-2 small" />;
            const senderName = getAlertInfoAttribute(alert, 'senderName');
            const senderLongname = getAlertInfoParameter(
                alert,
                'sender_langname'
            );
            alertFooterTextElem.append(
                <span>
                    {LL.modal.providedBy({
                        provider: `${(senderName ?? senderLongname) ? `${senderName ?? senderLongname} ${LL.modal.via()}` : ''} ${getProviderLabel(provider)}`,
                    })}
                </span>,
                <br />
            );
            alertFooterTextElem.append(
                <a
                    href={`https://warnung.bund.de/meldungen/${alertId}/`}
                    target="_blank"
                >
                    {' '}
                    {LL.modal.bbkLink()}
                </a>
            );
            alertFooterElem.append(alertFooterTextElem);

            alertModal.show();

            void navigator.locks.request(LOCK_NAME, () => {
                const alertCache = getCachedActiveAlerts();
                if (!alertCache[alert.identifier]) {
                    alertCache[alert.identifier] = {
                        seen: false,
                        notified: false,
                        referenceOnly: false,
                    };
                }
                alertCache[alert.identifier].seen = true;
                GM_setValue(CACHE_KEY, alertCache);
                // mark as seen in alert overview
                alertsModalBody
                    .querySelector(
                        `.card:has([data-alert="${alert.identifier}"])`
                    )
                    ?.classList.remove(style.unseen);
            });
        });
};

/**
 * Checks if the severity is in the user's preferences.
 * @param sevNum - severity as number
 * @param providerCategory - provider category
 * @returns true if the severity is in the user's preferences
 */
const severityInPreferences = (
    sevNum: number,
    providerCategory: providerCategoryType
) => {
    const providerSetting =
        providerCategory === 'civilProtection' ? civilWarningsSetting
        : providerCategory === 'police' ? policeWarningSetting
        : providerCategory === 'weather' ? weatherWarningsSetting
        : floodWarningsSetting;

    if (providerCategory === 'flood') {
        return providerSetting.value > 0;
    }

    return providerSetting.value > severityToNumber(MAX_SEVERITY) - sevNum;
};

/**
 * Sends a notification for a specific alert.
 * @param alert - The alert to send a notification for.
 * @returns A promise that resolves when the notification has been sent.
 */
const sendAlertNotification = (alert: Alert) =>
    void navigator.locks.request(LOCK_NAME, () => {
        const alertId = alert.identifier;
        const alertCache = getCachedActiveAlerts();
        if (!alertCache[alertId]) {
            alertCache[alertId] = {
                seen: false,
                notified: false,
                referenceOnly: false,
            };
        }

        if (
            alertCache[alertId].notified ||
            alertCache[alertId].seen ||
            alertCache[alertId].referenceOnly
        ) {
            return;
        }

        const urgency = getAlertInfoAttribute(alert, 'urgency')!;
        const severity = severityToNumber(
            getAlertInfoAttribute(alert, 'severity')!
        );
        const provider = providerById(alertId);
        const provCat = getProviderCategory(provider);
        const isUpdate = alert.msgType === MESSAGE_TYPE.UPDATE;
        const isCancel = alert.msgType === MESSAGE_TYPE.CANCEL;

        const wasNotified = getAlertReferences(alert).some(
            ref => alertCache[ref.alertId].notified
        );

        if (
            !isEnabled() ||
            urgency === URGENCY.PAST ||
            !severityInPreferences(severity, provCat) ||
            (isUpdate && !notifyUpdates.value && wasNotified) ||
            (isCancel && !notifyClearSignal.value) ||
            (isCancel && !wasNotified)
        ) {
            return;
        }

        const title = getAlertTitle(alert);
        const shortDescription = shortenAlertDescription(alert, 75);

        if (inAppNotifications.value) {
            void toast(shortDescription, {
                type: 'warning',
                autohide: true,
                closeButton: true,
                delay: TEN_SECONDS,
                title,
                subtitle: getHtml(
                    <a
                        href={`https://warnung.bund.de/meldungen/${alertId}/`}
                        dataset={{ alert: alertId }}
                        target="_blank"
                    >
                        {LL.modal.showMore()}
                    </a>
                ),
            });
            alertCache[alertId].notified = true;
        }
        if (desktopNotifications.value) {
            GM_notification({
                title,
                text: shortDescription,
                image: getProviderIcon(provider, isCancel),
                // eslint-disable-next-line jsdoc/require-jsdoc
                onclick: () => showAlertDetailsModal(alertId),
            });
            alertCache[alertId].notified = true;
        }

        GM_setValue(CACHE_KEY, alertCache);
    });

let disabledByOtherTab = false;
/**
 * Checks if any warning settings are enabled.
 * @returns True if any warning settings are enabled, false otherwise.
 */
const isEnabled = () =>
    (civilWarningsSetting.value !== 0 ||
        weatherWarningsSetting.value !== 0 ||
        floodWarningsSetting.value !== 0) &&
    !disabledByOtherTab;

// Setup main modal
let alertsModalShown = false;
let alertsModalContent: JSX.Element[] = [];
const alertsNavItem = (
    <NavbarItem order={600}>
        <div className="nav-link icon-no-margin">
            <i className="icon fa fa-exclamation-triangle fa-fw text-warning" />
        </div>
    </NavbarItem>
) as NavbarItemComponent;
const alertsModalReloadButton = (
    <button type="button" className="btn mr-auto">
        <i className="icon fa fa-refresh fa-fw" />
        {LL.modal.reload()}
    </button>
);
const alertsModalBody = <div />;
const alertsModal: Modal = new Modal({
    type: 'ALERT',
    large: true,
    scrollable: true,
    title: (
        <>
            <i className="icon fa fa-exclamation-triangle fa-fw text-warning" />
            {LL.modal.activeWarnings({ municipalty: MUNICIPALTY })}
        </>
    ),
    body: alertsModalBody,
    footer: alertsModalReloadButton,
});
alertsModal.setTrigger(alertsNavItem);
alertsModal.onShown(() => {
    alertsModalShown = true;
});
alertsModal.onHidden(() => {
    alertsModalShown = false;
});
alertsModalReloadButton.addEventListener('click', () => {
    const icon = alertsModalReloadButton.querySelector('i');
    icon?.classList.add(style.spin);
    void requestAlerts()
        .then(reloadAlertsModal)
        .then(() => {
            alertsModalReloadButton.addEventListener(
                'animationiteration',
                () => {
                    icon?.classList.remove(style.spin);
                },
                { once: true }
            );
        });
});
document.addEventListener('click', e => {
    const target = (e.target as HTMLElement).closest('[data-alert]');
    if (target && target instanceof HTMLElement) {
        e.preventDefault();
        const alertId = target.dataset?.alert;
        if (alertId) {
            showAlertDetailsModal(alertId);
        }
    }
});

/**
 * Reloads the alerts modal with the given alerts.
 * @returns void
 */
const reloadAlertsModal = (): void =>
    alertsModalBody.replaceChildren(
        ...alertsModalContent
            .flatMap(contentElem => [contentElem, <hr />])
            .slice(0, -1)
    );

let scheduledInterval: ReturnType<typeof setTimeout> | null = null;

/**
 * Requests alerts from the NINA API.
 * @returns A promise that resolves when the alerts have been requested.
 */
const requestAlerts = () =>
    getAlerts()
        .then(resp => resp.value)
        .then(alertSummaries => alertSummaries.map(s => s.id))
        .then(async alertIds => {
            // Fetch alert details
            const alertResponses = await Promise.all(alertIds.map(getAlert));
            const alerts = alertResponses
                .map(resp => resp.value)
                .filter(
                    alert =>
                        severityInPreferences(
                            severityToNumber(
                                getAlertInfoAttribute(alert, 'severity')!
                            ),
                            getProviderCategory(providerById(alert.identifier))
                        ) &&
                        (alert.msgType !== MESSAGE_TYPE.CANCEL ||
                            notifyClearSignal.value)
                );

            // Display navbar item if there are any alerts
            void (alerts.length > 0 ?
                alertsNavItem.put()
            :   alertsNavItem.remove());

            await updateCachedActiveAlerts(alerts);
            const alertCache = getCachedActiveAlerts();

            // Sort alerts by seen, severity
            alerts.sort((a, b) => {
                const seenA = alertCache[a.identifier].seen;
                const seenB = alertCache[b.identifier].seen;
                const severityA = getAlertInfoAttribute(a, 'severity')!;
                const severityB = getAlertInfoAttribute(b, 'severity')!;
                if (seenA !== seenB) {
                    return seenA ? 1 : -1;
                }
                if (severityA !== severityB) {
                    return (
                        severityToNumber(severityA) -
                        severityToNumber(severityB)
                    );
                }
                return 0;
            });

            // Handle the alerts
            alerts.forEach(alert => {
                sendAlertNotification(alert);
            });
            alertsModalContent = alerts.map(alert => {
                const alertId = alert.identifier;
                const severity = getAlertInfoAttribute(alert, 'severity')!;
                const provider = providerById(alertId);
                const shortDescription = shortenAlertDescription(alert);

                const isCancel = alert.msgType === MESSAGE_TYPE.CANCEL;

                const onset = getAlertInfoAttribute(alert, 'onset') ?? '';
                const expires = getAlertInfoAttribute(alert, 'expires') ?? '';
                const duration =
                    onset && expires ?
                        <span className="small text-muted ml-1">
                            ({datetimeToString(new Date(onset), true, false)}
                            {' - '}
                            {datetimeToString(new Date(expires), true, false)})
                        </span>
                    :   null;

                const seen = alertCache[alertId].seen;
                return (
                    <div className={`card p-3 ${!seen ? style.unseen : ''}`}>
                        <h5>
                            <span
                                dataset={{
                                    originalTitle:
                                        isCancel ?
                                            LL.msgType.cancel()
                                        :   getSeverityLabel(
                                                severity,
                                                provider
                                            ),
                                    toggle: 'tooltip',
                                }}
                            >
                                {isCancel ? '✖️' : getSeverityEmoji(severity)}
                            </span>{' '}
                            {getAlertTitle(alert)}
                            {duration}
                        </h5>
                        <span className="small text-muted">
                            {LL.modal.sentAt()}:{' '}
                            {datetimeToString(new Date(alert.sent))}
                        </span>
                        <br />
                        <p>{shortDescription}</p>
                        <div className="small">
                            <a
                                href={`https://warnung.bund.de/meldungen/${alertId}/`}
                                dataset={{ alert: alertId }}
                                target="_blank"
                            >
                                {LL.modal.showMore()}
                            </a>
                        </div>
                    </div>
                );
            });
            if (alertsModalContent.length === 0) {
                alertsModalContent = [<p>{LL.modal.noActiveWarnings()}</p>];
            }

            if (alertsModalShown) {
                return;
            }
            reloadAlertsModal();
        });

/**
 * Reloads the NINA feature.
 */
const reload = () => {
    void requestAlerts();
    scheduledInterval ??= setInterval(
        () => void requestAlerts(),
        THIRTY_SECONDS
    );

    disabledByOtherTab = false;
};

export default FeatureGroup.register({
    settings: new Set([
        civilWarningsSetting,
        policeWarningSetting,
        weatherWarningsSetting,
        floodWarningsSetting,
        inAppNotifications,
        desktopNotifications,
        notifyUpdates,
        notifyClearSignal,
    ]),
    onload: reload,
    onunload: reload,
});
