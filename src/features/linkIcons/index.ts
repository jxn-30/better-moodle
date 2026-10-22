import { BooleanSetting } from '#lib/Settings/BooleanSetting';
import externalCSS from './style/external.scss?inline';
import FeatureGroup from '#lib/FeatureGroup';
import mailCSS from './style/mail.scss?inline';
import mattermostCSS from './style/mattermost.scss?inline';
import phoneCSS from './style/phone.scss?inline';
import { ready } from '#lib/DOM.ts';
import type Setting from '#lib/Setting';
import webexCSS from './style/webex.scss?inline';
import {
    callRestFunction,
    ModUrlGetUrlsCoursesResponse,
} from '#lib/restApi.ts';

interface LinkIconElement {
    setting: BooleanSetting;
    matches: (url: URL) => boolean;
    css: string;
    styleElem?: HTMLElement;
}

const PLACEHOLDER_STRING = '[--mod_url-ids--]'; // TODO: can I use prefix or something like this here?

const settings = new Set<Setting>();
const linkIcons = [] as LinkIconElement[];

// this feature exists natively in UzL-Moodle.
if (__UNI__ !== 'uzl') {
    linkIcons.push({
        setting: new BooleanSetting('external', true).onInput(() => onload()),
        /**
         * Checks whether the URL points to an external HTTP(S) resource.
         * @param url - The URL to check.
         * @returns Whether the URL is external to the current Moodle instance.
         */
        matches: url => !url.href.startsWith(__MOODLE_URL__),
        css: externalCSS,
    });
}

// This Mattermost instance is a CAU thing
if (__UNI__ === 'cau') {
    linkIcons.push({
        setting: new BooleanSetting('mattermostIfI', true).onInput(() =>
            onload()
        ),
        /**
         * Checks whether the URL points to a supported Mattermost instance.
         * @param url - The URL to check.
         * @returns Whether the URL points to a supported Mattermost instance.
         */
        matches: url =>
            url.hostname === 'wetalk.informatik.uni-kiel.de' ||
            url.hostname === 'dill.theorie.informatik.uni-kiel.de',
        css: mattermostCSS,
    });
}

// Webex is only used on UzL-Moodle
if (__UNI__ === 'uzl') {
    linkIcons.push({
        setting: new BooleanSetting('webex', true).onInput(() => onload()),
        /**
         * Checks whether the URL points to a supported Webex service..
         * @param url - The URL to check.
         * @returns Whether the URL points to a supported Webex service..
         */
        matches: url =>
            url.protocol === 'webexteams://' ||
            url.hostname === 'uni-luebeck.webex.com',
        css: webexCSS,
    });
}

linkIcons.push({
    setting: new BooleanSetting('mail', true).onInput(() => onload()),
    /**
     * Checks whether the URL uses the mailto: scheme.
     * @param url - The URL to check.
     * @returns Whether the URL uses the mailto: scheme.
     */
    matches: url => url.protocol === 'mailto:',
    css: mailCSS,
});
linkIcons.push({
    setting: new BooleanSetting('phone', true).onInput(() => onload()),
    /**
     * Checks whether the URL uses the tel: scheme.
     * @param url - The URL to check.
     * @returns Whether the URL uses the tel: scheme.
     */
    matches: url => url.protocol === 'tel:',
    css: phoneCSS,
});

linkIcons.forEach(linkIcon => settings.add(linkIcon.setting));

if (__MOODLE_APP_ENABLED__) {
    void ready().then(() =>
        callRestFunction<ModUrlGetUrlsCoursesResponse>(
            'mod_url_get_urls_by_courses',
            { 'courseids[0]': M.cfg.courseId }
        ).then(x =>
            x.urls
                .reduce(
                    (acc, curr) => {
                        linkIcons.forEach((linkIcon, idx) => {
                            if (
                                linkIcon.matches(
                                    new URL(curr.externalurl, __MOODLE_URL__)
                                )
                            ) {
                                acc[idx].push(`#module-${curr.coursemodule}`);
                            }
                        });
                        return acc;
                    },
                    linkIcons.map(() => [] as string[])
                )
                .forEach((sortedModIds, idx) => {
                    linkIcons[idx].css = linkIcons[idx].css.replaceAll(
                        PLACEHOLDER_STRING,
                        sortedModIds.join(',')
                    );
                    if (linkIcons[idx].styleElem) {
                        linkIcons[idx].styleElem.remove();
                        linkIcons[idx].styleElem = GM_addStyle(
                            linkIcons[idx].css
                        );
                    }
                })
        )
    );
}

/**
 * Adds the event listener that handles the mouseover event
 */
const onload = () => {
    linkIcons.forEach(linkIcon => {
        if (linkIcon.setting?.value) {
            if (linkIcon.styleElem) document.head.append(linkIcon.styleElem);
            else linkIcon.styleElem = GM_addStyle(linkIcon.css);
        } else linkIcon.styleElem?.remove();
    });
};

export default FeatureGroup.register({ settings, onload });
