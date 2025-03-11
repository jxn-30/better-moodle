import { BooleanSetting } from '@/Settings/BooleanSetting';
import FeatureGroup from '@/FeatureGroup';
import { LL } from 'i18n';
import { render } from '@/templates';
import style from './style.module.scss';
import { getHtml, putTemplate, ready } from '@/DOM';

const enabled = new BooleanSetting('enabled', false);

interface Bookmark {
    title: string;
    url: string;
}

type Bookmarks = Bookmark[];

const storageKey = 'bookmarks.list';
const oldStorageKey = 'better-moodle-bookmarks';

const oldValue = GM_getValue(oldStorageKey);
if (oldValue) {
    GM_setValue(storageKey, oldValue);
    GM_deleteValue(oldStorageKey);
}

let navbarItem: HTMLLIElement | null = null;

/**
 * @param bookmarks
 */
const renderDropdown = (bookmarks: Bookmarks) =>
    render('core/custom_menu_item', {
        title: LL.features.bookmarks.bookmarks(),
        text: getHtml(<i class="icon fa fa-bookmark-o fa-fw" role="img"></i>),
        haschildren: true,
        children: [
            ...bookmarks.map(bookmark => ({
                ...bookmark,
                text: bookmark.title,
            })),
            {
                url: '#editBookmarks',
                title: LL.features.bookmarks.edit(),
                text: LL.features.bookmarks.edit(),
            },
        ],
    })
        .then(template =>
            navbarItem ?
                putTemplate<[HTMLLIElement]>(
                    navbarItem,
                    template,
                    'replaceWith'
                )
            :   ready().then(() =>
                    putTemplate<[HTMLLIElement]>(
                        '#usernavigation .usermenu-container',
                        template,
                        'before'
                    )
                )
        )
        .then(([item]) => {
            navbarItem = item;
            navbarItem.id = style.dropdown;
            navbarItem.style.setProperty(
                '--empty-text',
                JSON.stringify(LL.features.bookmarks.empty())
            );

            const currentPage = new URL(window.location.href);
            currentPage.hash = '';

            if (
                bookmarks.some(({ url }) => {
                    const urlWithoutHash = new URL(url);
                    urlWithoutHash.hash = '';
                    return currentPage.href.includes(urlWithoutHash.href);
                })
            ) {
                navbarItem
                    .querySelector('.fa-bookmark-o')
                    ?.classList.replace('fa-bookmark-o', 'fa-bookmark');
            }

            navbarItem.addEventListener('click', e => {
                const target = e.target;
                if (!(target instanceof HTMLElement)) return;
                const editAnchor = target.closest('a[href*="#editBookmarks"]');
                if (!editAnchor) return;
                e.preventDefault();
                alert('Edit kommt noch');
            });
        });

/**
 *
 */
const onload = () => {
    if (enabled.value) {
        const bookmarks = GM_getValue<Bookmarks>(storageKey, []).map(
            bookmark => ({
                ...bookmark,
                url:
                    bookmark.url.startsWith('https://') ?
                        bookmark.url
                    :   `https://${bookmark.url}`,
            })
        );
        void renderDropdown(bookmarks);
    } else {
        navbarItem?.remove();
    }
};

enabled.onInput(() => void onload());

/**
 *
 */
const onunload = () => {
    navbarItem?.remove();
};

export default FeatureGroup.register({
    settings: new Set([enabled]),
    onload,
    onunload,
});
