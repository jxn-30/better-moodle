import DrawerTemplate from './Drawer/Drawer.mustache?raw';
import { PREFIX } from '@/helpers';
import { renderCustomTemplate } from '@/templates';
import { requirePromise } from '@/require.js';
import ThemeBoostDrawers from '#/require.js/theme_boost/drawers';
import { getHtml, putTemplate } from '@/DOM';

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
    #content = (<></>);
    #heading = (<></>);
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
    setHeading(heading: JSXElement) {
        if (this.#instance) {
            this.#instance.drawerNode
                .querySelector('.drawerheadercontent')
                ?.replaceChildren(heading);
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
    setContent(content: JSXElement) {
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
        return renderCustomTemplate(`drawer`, DrawerTemplate, {
            classes: `drawer drawer-${this.#side} ${Array.from(this.#classes).join(' ')}`,
            id: this.#id,
            tooltip: this.#oppositeSide,
            state: `show-drawer-${this.#side}`,
            content: getHtml(this.#content),
            // Moodle 403 introduced a special wrapper element.
            // For < 403 we want to create this on our own, so will be undefined until >= 403
            drawerheading:
                __MOODLE_VERSION__ > 403 ? getHtml(this.#heading) : undefined,
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

        // Moodle 4.3 introduced `.drawerheadercontent` field
        if (__MOODLE_VERSION__ < 403) {
            element
                .querySelector('.drawerheader')
                ?.append(
                    <div class="drawerheadercontent hidden w-100 d-flex">
                        {this.#heading}
                    </div>
                );
        }
        // we want `.drawerheadercontent` to use as much width as possible
        else {
            element
                .querySelector('.drawerheadercontent')
                ?.classList.add('w-100', 'd-flex');
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
            () => {
                GM_setValue(this.#storageKey, this.#instance?.isOpen);
                // show header content
                this.#instance?.drawerNode
                    .querySelector('.drawerheadercontent')
                    ?.classList.remove('hidden');
            }
        );
        this.#instance.drawerNode.addEventListener(
            Drawers.eventTypes.drawerHidden,
            () => GM_setValue(this.#storageKey, this.#instance?.isOpen)
        );
        // hide the header content when hiding drawer to prevent glitchy behaviour
        // https://git.moodle.org/gw?p=moodle.git;a=blob;f=theme/boost/amd/src/drawers.js;h=86680acfb89f6be03e3ed5a1bc6ef54b9a8667c5;hb=7b04638c5261bd2b2ea3f505bdcd612c96587efa#l427
        this.#instance.drawerNode.addEventListener(
            Drawers.eventTypes.drawerHide,
            () =>
                this.#instance?.drawerNode
                    .querySelector('.drawerheadercontent')
                    ?.classList.add('hidden')
        );

        return this;
    }
}
