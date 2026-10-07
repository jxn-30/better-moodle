import { BooleanSetting } from '#lib/Settings/BooleanSetting';
import externalCSS from './style/external.scss?inline';
import FeatureGroup from '#lib/FeatureGroup';
import mailStyleEl from './style/mail.scss?style';
import mattermostCSS from './style/mattermost.scss?inline';
import phoneStyleEl from './style/phone.scss?style';
import type Setting from '#lib/Setting';
import webexCSS from './style/webex.scss?inline';
import zoomCSS from './style/zoom.scss?inline';

const settings = new Set<Setting>();

let external: BooleanSetting;
// this feature exists natively in UzL-Moodle.
if (__UNI__ !== 'uzl') {
    external = new BooleanSetting('external', true).onInput(() => onload());
    settings.add(external);
}

let mattermostIfI: BooleanSetting;
if (__UNI__ === 'cau') {
    mattermostIfI = new BooleanSetting('mattermostIfI', true).onInput(() =>
        onload()
    );
    settings.add(mattermostIfI);
}

let webex: BooleanSetting;
// Webex is only used on UzL-Moodle
if (__UNI__ === 'uzl') {
    webex = new BooleanSetting('webex', true).onInput(() => onload());
    settings.add(webex);
}

let zoom: BooleanSetting;
// Zoom is only used on HSNR-Moodle
if (__UNI__ === 'hsnr') {
    zoom = new BooleanSetting('zoom', true).onInput(() => onload());
    settings.add(zoom);
}

const mail = new BooleanSetting('mail', true).onInput(() => onload());
const phone = new BooleanSetting('phone', true).onInput(() => onload());
settings.add(mail).add(phone);

let externalStyle: HTMLElement;
let mattermostStyle: HTMLElement;
let webexStyle: HTMLElement;
let zoomStyle: HTMLElement;
let zoomObserver: MutationObserver | null = null;

/**
 * Scans Moodle URL activity links and marks those pointing to Zoom redirects
 */
const markZoomRedirects = () => {
    const urlLinks = document.querySelectorAll<HTMLAnchorElement>(
        'a[href*="/mod/url/view.php"]:not([data-better-moodle-zoom]), a[href*="zoom-x.de"]:not([data-better-moodle-zoom]), a[href*="zoom.us"]:not([data-better-moodle-zoom]), a[href^="zoommtg://"]:not([data-better-moodle-zoom])'
    );

    urlLinks.forEach(link => {
        const href = link.href.toLowerCase();
        const onClickAttr = link.getAttribute('onclick') ?? '';
        const linkText = link.textContent?.toLowerCase() ?? '';
        const linkTitle = link.getAttribute('title')?.toLowerCase() ?? '';

        // 1. Direct check on link properties or href domains
        let isZoom =
            href.includes('zoom-x.de') ||
            href.includes('zoom.us') ||
            href.startsWith('zoommtg://') ||
            onClickAttr.toLowerCase().includes('zoom') ||
            linkText.includes('zoom') ||
            linkTitle.includes('zoom');

        // 2. Check the parent activity card (wrapper, description, and attributes)
        const activityCard = link.closest(
            '.activity, .activity-item, li.modtype_url, [data-activityname]'
        );

        if (activityCard && !isZoom) {
            const dataActivityName =
                activityCard.getAttribute('data-activityname')?.toLowerCase() ??
                '';
            const cardText = activityCard.textContent?.toLowerCase() ?? '';

            // Match if activity name or description mentions Zoom, meeting IDs, or passcodes
            isZoom =
                dataActivityName.includes('zoom') ||
                cardText.includes('zoom') ||
                cardText.includes('kenncode') ||
                cardText.includes('passwort') ||
                cardText.includes('passcode') ||
                cardText.includes('meeting-id');
        }

        // 3. Check immediately preceding text/label block in the course list
        if (!isZoom) {
            const activityLi = link.closest('li.activity');
            const prevSibling = activityLi?.previousElementSibling;

            if (prevSibling?.classList.contains('modtype_label')) {
                const prevText = prevSibling.textContent?.toLowerCase() ?? '';
                if (prevText.includes('zoom')) {
                    isZoom = true;
                }
            }
        }

        if (isZoom) {
            link.setAttribute('data-better-moodle-zoom', 'true');
        }
    });
};

/**
 * Handles injecting and removing feature styles and dynamic listeners
 */
const onload = () => {
    // external
    if (external?.value) {
        if (externalStyle) document.head.append(externalStyle);
        else externalStyle = GM_addStyle(externalCSS);
    } else externalStyle?.remove();

    // mail
    if (mail.value) document.head.append(mailStyleEl);
    else mailStyleEl.remove();

    if (mattermostIfI?.value) {
        if (mattermostStyle) document.head.append(mattermostStyle);
        else mattermostStyle = GM_addStyle(mattermostCSS);
    } else mattermostStyle?.remove();

    // phone
    if (phone.value) document.head.append(phoneStyleEl);
    else phoneStyleEl.remove();

    // webex
    if (webex?.value) {
        if (webexStyle) document.head.append(webexStyle);
        else webexStyle = GM_addStyle(webexCSS);
    } else webexStyle?.remove();

    // zoom
    if (zoom?.value) {
        if (zoomStyle) document.head.append(zoomStyle);
        else zoomStyle = GM_addStyle(zoomCSS);

        // Run initial scan
        markZoomRedirects();

        // Observe DOM updates for dynamically loaded sections
        if (!zoomObserver) {
            zoomObserver = new MutationObserver(() => markZoomRedirects());
            zoomObserver.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }
    } else {
        zoomStyle?.remove();
        if (zoomObserver) {
            zoomObserver.disconnect();
            zoomObserver = null;
        }
        document
            .querySelectorAll('[data-better-moodle-zoom]')
            .forEach(el => el.removeAttribute('data-better-moodle-zoom'));
    }
};

export default FeatureGroup.register({ settings, onload });
