import DrawerTemplate from './Drawer/Drawer.mustache?raw';
import { PREFIX } from '@/helpers';
import { putTemplate } from '@/DOM';
import { renderCustomTemplate } from '@/templates';
import { requirePromise } from '@/require.js';

enum Side {
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
    #content = (<></>) as HTMLElement;

    /**
     * creates a new drawer instance
     * @param id - the id of the drawer for DOM ID and storage
     */
    constructor(id: string) {
        this.#id = PREFIX(id);
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
     * sets the content of the drawer
     * @param content - the content to use
     * @returns this
     */
    setContent(content: HTMLElement) {
        this.#throwOnRendered();
        this.#content = content;
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
            content: this.#content.outerHTML,
        });
    }

    /**
     * creates the drawer
     */
    async create() {
        this.#throwOnRendered();
        const template = await this.#render();
        const [elements, [Drawer, Drawers]] = await Promise.all([
            putTemplate('#page', template, 'before'),
            requirePromise([
                'theme_boost/drawer',
                'theme_boost/drawers',
            ] as const),
        ]);
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
        const drawerInstance = Drawers.getDrawerInstanceForNode(elements[0]);
        if (GM_getValue(this.#storageKey, false)) {
            drawerInstance.openDrawer();
        }
        drawerInstance.drawerNode.addEventListener(
            Drawers.eventTypes.drawerShown,
            () => GM_setValue(this.#storageKey, drawerInstance.isOpen)
        );
        drawerInstance.drawerNode.addEventListener(
            Drawers.eventTypes.drawerHidden,
            () => GM_setValue(this.#storageKey, drawerInstance.isOpen)
        );
    }
}
