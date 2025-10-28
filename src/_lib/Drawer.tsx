import DrawerTemplate from './Drawer/Drawer.mustache?raw';
import { getHtml } from '@/DOM';
import { PREFIX } from '@/helpers';
import { requirePromise } from '@/require.js';
import ThemeBoostDrawers from '#/require.js/theme_boost/drawers';
import { putTemplate, renderCustomTemplate } from '@/templates';

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
     * @throws {Error} if the drawer is already rendered
     */
    #throwOnRendered() {
        if (this.#rendered) {
            throw new Error(`Drawer #${this.#id} already rendered`);
        }
    }

    /**
     * sets an old alias
     * this is only used to migrate the storage key
     * @param alias - the old storage key without prefix and suffix
     * @returns this
     */
    setAlias(alias: string) {
        const undefinedValue = crypto.randomUUID();
        const oldKey = `better-moodle-${alias}-sidebar-open`;
        const oldValue = GM_getValue(oldKey, undefinedValue);
        if (oldValue !== undefinedValue) {
            GM_deleteValue(oldKey);
            GM_setValue(this.#storageKey, oldValue);
        }
        return this;
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
            this.querySelector('.drawerheadercontent')?.replaceChildren(
                heading
            );
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
            this.querySelector('.drawercontent')?.replaceChildren(content);
        } else {
            this.#throwOnRendered();
            this.#content = content;
        }
        return this;
    }

    /**
     * performs a querySelector on the drawer node
     * @param selector - the selector
     * @returns the selector result
     */
    querySelector<ElementType extends Element>(selector: string) {
        return this.#instance?.drawerNode.querySelector<ElementType>(selector);
    }

    /**
     * adds an event listener on the drawer node
     * @param options - the options passed to a normal addEventListener
     * @returns void
     */
    addEventListener(...options: Parameters<HTMLElement['addEventListener']>) {
        return this.#instance?.drawerNode.addEventListener(...options);
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
                    <div className="drawerheadercontent hidden w-100 d-flex">
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
                    className="btn icon-no-margin"
                    dataset={{
                        toggler: 'drawers',
                        action: 'toggle',
                        target: this.#id,
                        toggle: 'tooltip',
                        placement: this.#oppositeSide, // this is placement of tooltip
                    }}
                    title={this.#toggleTitle}
                >
                    <span className="sr-only">{this.#toggleTitle}</span>
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

        /**
         * Publishes messages to indicate changes in drawer state
         * @param isOpen - wether the drawer is open
         * @returns undefined
         */
        const doPubsub = (isOpen: boolean) =>
            void requirePromise(['core/pubsub'] as const).then(([pubsub]) => {
                pubsub.publish('nav-drawer-toggle-start', isOpen);
                setTimeout(
                    () => pubsub.publish('nav-drawer-toggle-end', isOpen),
                    100
                );
            });

        this.addEventListener(Drawers.eventTypes.drawerShown, () => {
            GM_setValue(this.#storageKey, this.#instance?.isOpen);
            // show header content
            this.querySelector('.drawerheadercontent')?.classList.remove(
                'hidden'
            );
            doPubsub(true);
        });
        this.addEventListener(Drawers.eventTypes.drawerHidden, () => {
            GM_setValue(this.#storageKey, this.#instance?.isOpen);
            doPubsub(false);
        });
        // hide the header content when hiding drawer to prevent glitchy behaviour
        // https://git.moodle.org/gw?p=moodle.git;a=blob;f=theme/boost/amd/src/drawers.js;h=86680acfb89f6be03e3ed5a1bc6ef54b9a8667c5;hb=7b04638c5261bd2b2ea3f505bdcd612c96587efa#l427
        this.addEventListener(Drawers.eventTypes.drawerHide, () =>
            this.querySelector('.drawerheadercontent')?.classList.add('hidden')
        );

        return this;
    }
}

// From Moodle 403 onwards, non-left sidebars will hide if an element with < 20px (=hardcoded THRESHOLD) distance is focused
// https://github.com/moodle/moodle/commit/b594536ef075b3d0b0f6ce88bbd2c99ff7d7c759#diff-89175b8a70ee4325c556c8ff0f3e576b01547af8a9214af70d600d577ba5ef8dR592-R610
// This interfers with our fullwidth feature, thus we need a trick to hide only if there is a real overlap, without the 20px radius
// It is not nice to treat the sidebar like this instead of respecting their sensibility, however in this case, user experience is affected too much
if (__MOODLE_VERSION__ >= 403) {
    void requirePromise(['theme_boost/drawers'] as const).then(([Drawers]) => {
        // threshold definition is within .then to allow inlining it
        const THRESHOLD = 20;
        // eslint-disable-next-line @typescript-eslint/unbound-method -- as we cannot bind yet and will not call without binding
        const preventOrig = Drawers.prototype.preventOverlap;
        type Drawer = InstanceType<typeof Drawers>;
        /**
         * Modifies the boundingRect to remove the threshold and then calls the original method
         * @param args - the arguments passed to the original method
         * @returns the result of the original method
         */
        Drawers.prototype.preventOverlap = function (this: Drawer, ...args) {
            // If the drawer has no bounding rect set, we don't have to take action
            if (!this.boundingRect) return preventOrig.call(this, ...args);
            const origRect = this.boundingRect;
            // Although left and right is used within original preventOverlap, we need to adjust x, y, width and height because left and right are calculated properties
            this.boundingRect.x += THRESHOLD;
            this.boundingRect.y += THRESHOLD;
            this.boundingRect.width -= 2 * THRESHOLD;
            this.boundingRect.height -= 2 * THRESHOLD;
            const result = preventOrig.call(this, ...args);
            this.boundingRect = origRect;
            return result;
        };
    });
}
