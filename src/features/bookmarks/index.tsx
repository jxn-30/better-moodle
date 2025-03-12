import { BooleanSetting } from '@/Settings/BooleanSetting';
import classnames from 'classnames';
import FeatureGroup from '@/FeatureGroup';
import { Modal } from '@/Modal';
import { LL } from 'i18n';
import { render } from '@/templates';
import { require } from '@/require.js';
import style from './style.module.scss';
import { getHtml, putTemplate, ready } from '@/DOM';

const enabled = new BooleanSetting('enabled', false);

interface Bookmark {
    title: string;
    url: string;
}

const storageKey = 'bookmarks.list';
const oldStorageKey = 'better-moodle-bookmarks';

const oldValue = GM_getValue(oldStorageKey);
if (oldValue) {
    GM_setValue(storageKey, oldValue);
    GM_deleteValue(oldStorageKey);
}

type Bookmarks = Bookmark[];

const bookmarks = GM_getValue<Bookmarks>(storageKey, []).map(bookmark => ({
    ...bookmark,
    url:
        bookmark.url.startsWith('https://') ?
            bookmark.url
        :   `https://${bookmark.url}`,
}));

/**
 * Saves the bookmarks to script storage
 */
const saveBookmarks = () => {
    GM_setValue(storageKey, bookmarks);
    require(['core/toast'] as const, ({ add }) =>
        void add(LL.features.bookmarks.savedNotification(), {
            type: 'success',
            autohide: true,
            closeButton: true,
        }));
};

GM_addValueChangeListener(storageKey, (_, __, newBookmarks: Bookmarks) => {
    if (!enabled.value) return;
    bookmarks.splice(0, bookmarks.length, ...newBookmarks);
    void renderDropdown();
});

let navbarItem: HTMLLIElement | null = null;

interface EditRowProps {
    title?: string;
    url?: string;
    controls?: boolean;
}
interface EditRowElement extends HTMLElement {
    title: string;
    url: string;
}

/**
 * @param props
 * @param props.title
 * @param props.url
 * @param props.controls
 */
const EditRow = ({
    title = '',
    url = '',
    controls = true,
}: EditRowProps): EditRowElement => {
    const titleInput = (
        <input class="form-control" type="text" placeholder="" />
    ) as HTMLInputElement;
    const urlInput = (
        <input class="form-control" type="url" placeholder="" />
    ) as HTMLInputElement;
    const Row = (
        <>
            {titleInput}
            <div class="input-group">
                <div class="input-group-prepend">
                    <span class="input-group-text">https://</span>
                </div>
                {urlInput}
            </div>
            <div class="w-100 d-lg-none"></div>
            {controls ?
                <div class="btn-group ml-auto">
                    <button class="btn btn-outline-seconday" data-action="up">
                        <i class="fa fa-arrow-up fa-fw"></i>
                    </button>
                    <button class="btn btn-outline-seconday" data-action="down">
                        <i class="fa fa-arrow-down fa-fw"></i>
                    </button>
                    <button class="btn btn-outline-danger" data-action="delete">
                        <i class="fa fa-trash fa-fw"></i>
                    </button>
                </div>
            :   <></>}
        </>
    ) as EditRowElement;

    Object.defineProperty(Row, 'title', {
        /**
         *
         */
        get(): string {
            return titleInput.value.trim();
        },
        /**
         * @param newVal
         */
        set(newVal: string) {
            titleInput.value = newVal.trim();
        },
    });
    Object.defineProperty(Row, 'url', {
        /**
         *
         */
        get(): string {
            const input = urlInput.value.trim();
            if (input.startsWith('https://')) return input;
            return `https://${input}`;
        },
        /**
         * @param newVal
         */
        set(newVal: string) {
            urlInput.value = newVal
                .trim()
                .replace(/^https:\/\//, '')
                .trim();
        },
    });

    Row.title = title;
    Row.url = url;

    return Row;
};

/**
 *
 */
const openAddModal = () => {
    const input = (
        <EditRow
            title={document.title}
            url={window.location.href}
            controls={false}
        />
    ) as EditRowElement;
    new Modal({
        type: 'SAVE_CANCEL',
        title: LL.features.bookmarks.add(),
        body: (
            <form class={classnames('mform', style.form, style.editForm)}>
                <div class="fcontainer">
                    <b>{LL.features.bookmarks.modal.title()}</b>
                    <b>{LL.features.bookmarks.modal.url()}</b>
                    {input}
                </div>
            </form>
        ),
        large: true,
        removeOnClose: true,
    })
        .onSave(() => {
            bookmarks.push({ title: input.title, url: input.url });
            saveBookmarks();
        })
        .show();
};
/**
 *
 */
const openEditModal = () =>
    new Modal({
        type: 'SAVE_CANCEL',
        title: LL.features.bookmarks.edit(),
        body: <></>,
        large: true,
        removeOnClose: true,
    })
        .onSave(() => console.log('closi closi :)'))
        .show();

/**
 *
 */
const renderDropdown = () =>
    render('core/custom_menu_item', {
        title: LL.features.bookmarks.bookmarks(),
        text: getHtml(<i class="icon fa fa-bookmark-o fa-fw" role="img"></i>),
        haschildren: true,
        children: [
            ...bookmarks.map(bookmark => ({
                ...bookmark,
                text: bookmark.title,
            })),
            { divider: true },
            {
                url: '#addBookmark',
                title: LL.features.bookmarks.add(),
                text: LL.features.bookmarks.add(),
            },
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
                const addAnchor = target.closest('a[href*="#addBookmark"]');
                if (addAnchor) {
                    e.preventDefault();
                    openAddModal();
                }
                const editAnchor = target.closest('a[href*="#editBookmarks"]');
                if (editAnchor) {
                    e.preventDefault();
                    openEditModal();
                }
            });
        });

/**
 *
 */
const onload = () => {
    if (enabled.value) {
        void renderDropdown();
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
