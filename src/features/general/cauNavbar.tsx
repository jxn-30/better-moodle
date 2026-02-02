import Feature from '#lib/Feature';
import globalStyle from '#style/index.module.scss';
import { LLF } from '#i18n';
import { ready } from '#lib/DOM';
// import { SelectSetting } from '#lib/Settings/SelectSetting';
import styles from './cauNavbar.module.scss';

const LL = LLF('general', 'cauNavbar');

// const mode = new SelectSetting('mode', 'default', [
// 	'default',
// ]);

const localNavbarPlusDiv = <div id={styles.localnavbarplus} />;

const localnavbarplusSos = (
    <div>
        <span className="fa-stack">
            <span className="fa fa-tower-broadcast fa-stack-1x" />
            <span className="fa fa-bell fa-stack-1x" />
        </span>
        <span>{LL.buttons.sos.sos()}</span>
    </div>
);
const localnavbarplusDiscrimination = (
    <div>
        <span>{LL.buttons.discrimination.discriminationSexism()}</span>
        <span>
            <span className="fa fa-fw icon fa-arrow-right" />{' '}
            {LL.buttons.discrimination.report()}{' '}
            <span className="fa fa-fw icon fa-arrow-right" />{' '}
            {LL.buttons.discrimination.getHelp()}
        </span>
    </div>
);

/**
 * Handles the "localnavbarplus" Buttons.
 */
const reload = async () => {
    // localNavbarPlusDiv.dataset.position = mode.value;
    await ready();
    Array.from(document.getElementsByClassName('localnavbarplus')).forEach(
        el => {
            el.querySelector<HTMLAnchorElement>('a')?.classList.add(
                globalStyle.noExternalLinkIcon
            );
            localNavbarPlusDiv.append(el);
        }
    );
    localNavbarPlusDiv
        .querySelector('#localnavbarplus-sos a i')
        ?.replaceWith(localnavbarplusSos);
    localNavbarPlusDiv
        .querySelector('#localnavbarplus-discrimination a i')
        ?.replaceWith(localnavbarplusDiscrimination);
    document.getElementById('usernavigation')?.before(localNavbarPlusDiv);

    const page = document.getElementById('page');

    if (!page) return;

    let previousScrollPosition = 0;
    let ticking = false;
    let scrollDown = false;
    page.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScrollPosition = page.scrollTop;
                const currentScrollDown =
                    currentScrollPosition > previousScrollPosition;
                if (scrollDown != currentScrollDown) {
                    localNavbarPlusDiv.classList.toggle(
                        styles.scrollDown,
                        currentScrollDown
                    );
                    page.classList.toggle(styles.scrollDown, currentScrollDown);
                }
                previousScrollPosition = currentScrollPosition;
                scrollDown = currentScrollDown;
                ticking = false;
            });
            ticking = true;
        }
    });
};

// mode.onInput(reload);

export default Feature.register({
    settings: new Set([]), // TODO: add multiple modes (like moving the buttons to a sidebar)
    onload: reload,
    onunload: reload,
});
