import DrawerTemplate from './Drawer/Drawer.mustache?raw';
import { PREFIX } from '@/helpers';
import { renderCustomTemplate } from '@/templates';
import { requirePromise } from '@/require.js';
import ThemeBoostDrawers from '#/require.js/theme_boost/drawers';
import { getDocumentFragmentHtml, putTemplate } from '@/DOM';

export enum Side {
    Left = 'left',
    Right = 'right',
}

/**
 * A utility class to create a fully working drawer / sidebar.
 */
export default class Drawer {
    readonly #id: string;

    #rendered = false;
    #side: Side = Side.Left;
    #classes = new Set<string>();
    #icon = '';
    #toggleTitle = '';
    #content: DocumentFragment | HTMLElement = (<></>) as DocumentFragment;
    #heading: DocumentFragment | HTMLElement = (<></>) as DocumentFragment;
    #instance: ThemeBoostDrawers | null = null;

    /**
     * creates a new drawer instance
     * @param id - the id of the drawer for DOM ID and storage
     */
    constructor(id: string) {
        this.#id = PREFIX(`drawer__${id}`);
    }

    /**
     * throws an error if the drawer is already rendered
     * @throws if the drawer is already rendered
     */
    #throwOnRendered() {
        if (this.#rendered) {
            throw new Error(`Drawer #${this.#id} already rendered`);
        }
    }

    /**
     * sets the side of the drawer
     * @param side - the side of the drawer
     * @returns this
     */
    setSide(side: Side) {
        this.#throwOnRendered();
        this.#side = side;
        return this;
    }

    /**
     * adds classes to the drawer
     * @param classes - the classes to add
     * @returns this
     */
    addClasses(...classes: string[]) {
        this.#throwOnRendered();
        classes.forEach(c => this.#classes.add(c));
        return this;
    }

    /**
     * sets the icon of the drawer
     * @param icon - the FA-Icon to use
     * @returns this
     */
    setIcon(icon: string) {
        this.#throwOnRendered();
        this.#icon = icon;
        return this;
    }

    /**
     * sets the title of the drawer for the toggle button tooltip
     * @param title - the title to use
     * @returns this
     */
    setToggleTitle(title: string) {
        this.#throwOnRendered();
        this.#toggleTitle = title;
        return this;
    }

    /**
     * sets the heading of the drawer
     * @param heading - the heading to use
     * @returns this
     */
    setHeading(heading: DocumentFragment | HTMLElement) {
        if (this.#instance) {
            const header =
                this.#instance.drawerNode.querySelector('.drawerheader');
            const toggler = header?.querySelector('.drawertoggle');
            if (toggler && this.#side === Side.Left) {
                header?.replaceChildren(toggler, heading);
            } else if (toggler) header?.replaceChildren(heading, toggler);
        } else {
            this.#throwOnRendered();
            this.#heading = heading;
        }
        return this;
    }

    /**
     * sets the content of the drawer
     * @param content - the content to use
     * @returns this
     */
    setContent(content: DocumentFragment | HTMLElement) {
        if (this.#instance) {
            this.#instance.drawerNode
                .querySelector('.drawercontent')
                ?.replaceChildren(content);
        } else {
            this.#throwOnRendered();
            this.#content = content;
        }
        return this;
    }

    /**
     * returns the opposite side of the side the drawer lives on
     * @returns the opposite side of the side the drawer lives on
     */
    get #oppositeSide() {
        return this.#side === Side.Left ? Side.Right : Side.Left;
    }

    /**
     * returns the storage key for the drawer
     * @returns the storage key for the drawer
     */
    get #storageKey() {
        return `drawer.${this.#id}`;
    }

    /**
     * renders the drawer
     * @returns a Promise with the rendered template
     */
    #render() {
        this.#throwOnRendered();
        this.#rendered = true;
        return renderCustomTemplate(`drawer/${this.#id}`, DrawerTemplate, {
            classes: `drawer drawer-${this.#side} ${Array.from(this.#classes).join(' ')}`,
            id: this.#id,
            tooltip: this.#oppositeSide,
            state: `show-drawer-${this.#side}`,
            content:
                this.#content instanceof DocumentFragment ?
                    getDocumentFragmentHtml(this.#content)
                :   this.#content.outerHTML,
            drawerheading:
                this.#heading instanceof DocumentFragment ?
                    getDocumentFragmentHtml(this.#heading)
                :   this.#heading.outerHTML,
        });
    }

    /**
     * creates the drawer
     * @returns a Promise with the created drawer instance
     */
    async create() {
        this.#throwOnRendered();
        const template = await this.#render();
        const [[element], [Drawer, Drawers]] = await Promise.all([
            putTemplate('#page', template, 'before'),
            requirePromise([
                'theme_boost/drawer',
                'theme_boost/drawers',
            ] as const),
        ]);

        // for Moodle 4.2+ this is not needed anymore but all Moodles before need this
        if (__MOODLE_VERSION__ < 402 && this.#heading) {
            element
                .querySelector('.drawertoggle')
                ?.[
                    this.#side === Side.Left ? 'after' : 'before'
                ](this.#heading);
        }

        document.querySelector('#page .drawer-toggles')?.append(
            <div
                className={`drawer-toggler drawer-${this.#side}-toggle ml-auto d-print-none`}
            >
                <button
                    class="btn icon-no-margin"
                    data-toggler="drawers"
                    data-action="toggle"
                    data-target={this.#id}
                    data-toggle="tooltip"
                    data-placement={
                        /* this is placement of tooltip */
                        this.#oppositeSide
                    }
                    title={this.#toggleTitle}
                >
                    <span class="sr-only">{this.#toggleTitle}</span>
                    <span>
                        <i className={`icon fa fa-fw fa-${this.#icon}`}></i>
                    </span>
                </button>
            </div>
        );
        Drawer.init();
        this.#instance = Drawers.getDrawerInstanceForNode(element);
        if (GM_getValue(this.#storageKey, false)) {
            this.#instance.openDrawer();
        }
        this.#instance.drawerNode.addEventListener(
            Drawers.eventTypes.drawerShown,
            () => GM_setValue(this.#storageKey, this.#instance?.isOpen)
        );
        this.#instance.drawerNode.addEventListener(
            Drawers.eventTypes.drawerHidden,
            () => GM_setValue(this.#storageKey, this.#instance?.isOpen)
        );

        return this;
    }
}
