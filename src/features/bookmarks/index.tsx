import { BooleanSetting } from '@/Settings/BooleanSetting';
import FeatureGroup from '@/FeatureGroup';
import globalStyle from '!/index.module.scss';
import { LLFG } from 'i18n';
import { Modal } from '@/Modal';
import style from './style.module.scss';
import toast from '@/toast';
import { getHtml, ready } from '@/DOM';
import { NavbarItem, NavbarItemComponent } from '@/Components';
import { putTemplate, render } from '@/templates';

const LL = LLFG('bookmarks');

const enabled = new BooleanSetting('enabled', false).addAlias(
    'general.bookmarkManager'
);

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
    void toast(LL.savedNotification(), {
        type: 'success',
        autohide: true,
        closeButton: true,
    });
};

GM_addValueChangeListener(storageKey, (_, __, newBookmarks: Bookmarks) => {
    if (!enabled.value) return;
    bookmarks.splice(0, bookmarks.length, ...newBookmarks);
    void renderDropdown();
});

const navbarItemTemplate: HTMLElement = (
    <i className="icon fa fa-bookmark-o fa-fw mr-0" role="img"></i>
) as HTMLElement;
const order = 900;

let navbarItem: HTMLLIElement | NavbarItemComponent | null = null;

interface EditRowProps {
    title?: string;
    url?: string;
    controls?: boolean;
    index?: number;
}
interface EditRowElement extends HTMLElement {
    readonly title: string;
    readonly url: string;
    index: number;
    readonly elements: HTMLElement[];
    remove(): void;
    before: HTMLElement['before'];
}

/**
 * Creates a component with all inputs and buttons necessary for one Bookmark
 * @param props - the props for this component
 * @param props.title - the initial title
 * @param props.url - the initial url
 * @param props.controls - wether to show controls to move the bookmark up and down
 * @param props.index - the initial index
 * @returns the full component
 */
const EditRow = ({
    title = '',
    url = '',
    controls = true,
    index = 0,
}: EditRowProps): EditRowElement => {
    const titleInput = (
        <input
            className="form-control"
            type="text"
            placeholder=""
            value={title.trim()}
        />
    ) as HTMLInputElement;
    const urlInput = (
        <input
            className="form-control"
            type="url"
            placeholder=""
            value={url
                .trim()
                .replace(/^https:\/\//, '')
                .trim()}
        />
    ) as HTMLInputElement;
    const urlInputGroup = (
        <div className="input-group">
            <div className="input-group-prepend">
                <span className="input-group-text">https://</span>
            </div>
            {urlInput}
        </div>
    );
    const controlsGroup =
        controls ?
            ((
                <div
                    className="btn-group ml-auto"
                    dataset={{ index: index.toString() }}
                >
                    <button
                        className="btn btn-outline-secondary"
                        dataset={{ action: 'up' }}
                    >
                        <i className="fa fa-arrow-up fa-fw"></i>
                    </button>
                    <button
                        className="btn btn-outline-secondary"
                        dataset={{ action: 'down' }}
                    >
                        <i className="fa fa-arrow-down fa-fw"></i>
                    </button>
                    <button
                        className="btn btn-outline-danger"
                        dataset={{ action: 'delete' }}
                    >
                        <i className="fa fa-trash fa-fw"></i>
                    </button>
                </div>
            ) as HTMLDivElement)
        :   null;
    const Row = (
        <>
            {titleInput}
            {urlInputGroup}
            {controlsGroup}
        </>
    ) as EditRowElement;

    let _index = index;

    Object.defineProperty(Row, 'title', {
        /**
         * Gets the current title
         * @returns The title inputs current value, trimmed
         */
        get(): string {
            return titleInput.value.trim();
        },
    });
    Object.defineProperty(Row, 'url', {
        /**
         * Gets the current url
         * @returns The url inputs current value, trimmed and prefixed by https://
         */
        get(): string {
            const input = urlInput.value.trim();
            if (input.startsWith('https://')) return input;
            return `https://${input}`;
        },
    });
    Object.defineProperty(Row, 'index', {
        /**
         * Gets the current index
         * @returns the current index of this bookmark
         */
        get(): number {
            return _index;
        },
        /**
         * Sets the index of this bookmark
         * @param newVal - the new index
         */
        set(newVal: number) {
            _index = newVal;
            if (controlsGroup) {
                controlsGroup.dataset.index = _index.toString();
            }
        },
    });
    Object.defineProperty(Row, 'elements', {
        value: [titleInput, urlInputGroup, controlsGroup] as const,
    });
    Object.defineProperty(Row, 'remove', {
        /**
         * Removes all elements of this row
         * @returns void
         */
        value: () => Row.elements.forEach(el => el?.remove()),
    });
    Object.defineProperty(Row, 'before', {
        /**
         * Adds elements before this row
         * @param elements - the elements to add
         * @returns void
         */
        value: (...elements: Node[]) => Row.elements.at(0)?.before(...elements),
    });

    return Row;
};

/**
 * Creates and opens a modal to add a new bookmark
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
        title: LL.add(),
        body: (
            <form className={['mform', style.form, style.editForm]}>
                <div className="fcontainer">
                    <b>{LL.modal.title()}</b>
                    <b>{LL.modal.url()}</b>
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
 * Creates and opens a modal to edit the bookmarks and add new ones
 */
const openEditModal = () => {
    const inputs = new Map<number, EditRowElement>();
    bookmarks.forEach((bookmark, i) =>
        inputs.set(
            i,
            (
                <EditRow title={bookmark.title} url={bookmark.url} index={i} />
            ) as EditRowElement
        )
    );

    const container = (
        <div className="fcontainer">
            <b>{LL.modal.title()}</b>
            <b>{LL.modal.url()}</b>
            <div className="d-none d-sm-block"></div>
            {...Array.from(inputs.values())}
        </div>
    ) as HTMLDivElement;
    container.addEventListener('click', e => {
        const target = e.target;
        if (!(target instanceof Element)) return;
        const btn = target.closest<HTMLButtonElement>('button[data-action]');
        const indexStr =
            btn?.closest<HTMLDivElement>('[data-index]')?.dataset.index;
        const action = btn?.dataset.action;
        if (!indexStr || !action) return;
        const index = Number(indexStr);
        const row = inputs.get(index);
        if (!row) return;
        e.preventDefault();
        if (action === 'delete') {
            row.remove();
            inputs.delete(index);
            const inputArray = Array.from(inputs.values());
            inputs.clear();
            inputArray.forEach((row, i) => {
                row.index = i;
                inputs.set(i, row);
            });
        } else if (action === 'up') {
            const prevRow = inputs.get(index - 1);
            if (prevRow) {
                [prevRow.index, row.index] = [row.index, prevRow.index];
                prevRow.before(...row.elements);
                inputs.set(index, prevRow);
                inputs.set(index - 1, row);
            }
        } else if (action === 'down') {
            const nextRow = inputs.get(index + 1);
            if (nextRow) {
                [nextRow.index, row.index] = [row.index, nextRow.index];
                row.before(...nextRow.elements);
                inputs.set(index, nextRow);
                inputs.set(index + 1, row);
            }
        }
    });

    const addBtn = (
        <button className="btn btn-outline-success pull-right float-end">
            <i className="fa fa-plus fa-fw"></i>
        </button>
    ) as HTMLButtonElement;
    addBtn.addEventListener('click', e => {
        e.preventDefault();
        const newInput = (
            <EditRow
                title={document.title}
                url={window.location.href}
                index={inputs.size}
            />
        ) as EditRowElement;
        inputs.set(inputs.size, newInput);
        container.append(newInput);
    });

    new Modal({
        type: 'SAVE_CANCEL',
        title: LL.edit(),
        body: (
            <form className={['mform', style.form]}>
                {container}
                {addBtn}
            </form>
        ),
        large: true,
        removeOnClose: true,
    })
        .onSave(() => {
            bookmarks.splice(
                0,
                bookmarks.length,
                ...Array.from(inputs.values())
                    .toSorted((a, b) => a.index - b.index)
                    .map(({ title, url }) => ({ title, url }))
            );
            saveBookmarks();
        })
        .show();
};

/**
 * Preprocesses the bookmark icon element.
 * @param elements - The elements to preprocess.
 * @param elements."0" - The bookmark icon element.
 */
const preprocessBookmarkIcon: (elements: [HTMLLIElement]) => void = ([
    item,
]) => {
    item.id = style.dropdown;
    item.classList.add(globalStyle.navbarItem);
    item.style.setProperty('order', `${order}`);
    item.style.setProperty('--empty-text', JSON.stringify(LL.empty()));
};

/**
 * Renders the dropdown with the current bookmarks and puts it into the correct position in DOM.
 * @returns a Promise that resolves when the rendering finished
 */
const renderDropdown = () =>
    render('core/custom_menu_item', {
        title: LL.bookmarks(),
        text: getHtml(navbarItemTemplate),
        haschildren: true,
        children: [
            ...bookmarks.map(bookmark => ({
                ...bookmark,
                text: bookmark.title,
            })),
            { divider: true },
            { url: '#addBookmark', title: LL.add(), text: LL.add() },
            { url: '#editBookmarks', title: LL.edit(), text: LL.edit() },
        ],
    })
        .then(template =>
            navbarItem ?
                putTemplate<[HTMLLIElement]>(
                    navbarItem,
                    template,
                    'replaceWith',
                    preprocessBookmarkIcon
                )
            :   ready().then(() =>
                    putTemplate<[HTMLLIElement]>(
                        '#usernavigation',
                        template,
                        'append',
                        preprocessBookmarkIcon
                    )
                )
        )
        .then(([item]) => {
            navbarItem = item;

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
        })
        .catch(() => {
            // if an error occurs (e.g. element not found), don't do anything for now
        });

/**
 * Triggers rendering or removal of the dropdown, based on the settings state
 */
const reload = () => {
    if (enabled.value) {
        navbarItem ??= (
            <NavbarItem order={order}>
                <div className={`${globalStyle.awaitsDropdown} nav-link`}>
                    {navbarItemTemplate}
                </div>
            </NavbarItem>
        ) as NavbarItemComponent;
        if (!(navbarItem instanceof HTMLLIElement)) {
            navbarItem.put();
        }
        void renderDropdown();
    } else {
        navbarItem?.remove();
        navbarItem = null;
    }
};

enabled.onInput(() => void reload());

export default FeatureGroup.register({
    settings: new Set([enabled]),
    onload: reload,
    onunload: reload,
});
