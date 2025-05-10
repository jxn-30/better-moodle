import Feature from '@/Feature';
import globalStyle from '!/index.module.scss';
import { ready } from '@/DOM';
// import { SelectSetting } from '@/Settings/SelectSetting';
import styles from './cauNavbar.module.scss';

// const mode = new SelectSetting('mode', 'default', [
// 	'default',
// ]);

const localNavbarPlusDiv = <div id={styles.localnavbarplus} />;

/**
 * Handles the "localnavbarplus" Buttons.
 */
const reload = async () => {
    // localNavbarPlusDiv.dataset.position = mode.value;
    await ready();
    Array.from(document.getElementsByClassName('localnavbarplus')).forEach(
        el => {
            el
                .querySelector<HTMLAnchorElement>('a')
                ?.classList.add(globalStyle.noExternalLinkIcon);
            localNavbarPlusDiv.append(el);
        }
    );
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
