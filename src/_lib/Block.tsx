import { PREFIX } from '@/helpers';
import { render } from '@/templates';
import { getHtml, putTemplate } from '@/DOM';

/**
 * A utility class to create a fully working block / sidebar.
 */
export default class Block {
    readonly #id: string;

    static #counters = new Map<string, number>();

    #rendered = false;
    #hidden = false;
    #classes = new Set<string>();
    readonly #instanceId: number;
    #ariaRole = 'complementary';
    #ariaLabel = '';
    #title = '';
    #showTitle = true;
    #controls: JSXElement | null = null;
    #content = (<></>);
    #footer = (<></>);
    #annotation = (<></>);
    readonly #card: boolean;

    #elements: HTMLElement[] = [];
    #element: HTMLElement | undefined;

    /**
     * creates a new block instance
     * @param id - the id of the block for DOM ID and storage
     * @param card - wether to add additional markup to make the block look more like a card
     */
    constructor(id: string, card = true) {
        this.#id = PREFIX(id);
        this.#instanceId = Block.#counters.get(id) ?? 0;
        this.#card = card;
        Block.#counters.set(id, this.#instanceId + 1);
    }

    /**
     * throws an error if the block is already rendered
     * @throws {Error} if the block is already rendered
     */
    #throwOnRendered() {
        if (this.#rendered) {
            throw new Error(`Block #${this.#id} already rendered`);
        }
    }

    /**
     * adds classes to the block
     * @param classes - the classes to add
     * @returns this
     */
    addClasses(...classes: string[]) {
        this.#throwOnRendered();
        classes.forEach(c => this.#classes.add(c));
        return this;
    }

    /**
     * Sets the title of the block
     * @param title - the title to use
     * @returns this
     */
    setTitle(title: string) {
        this.#throwOnRendered();
        this.#title = title;
        return this;
    }

    /**
     * sets the content of the block
     * @param content - the content to use
     * @param showTitle - wether to add the blocks title to the markup
     * @returns this
     */
    setContent(content: JSXElement, showTitle = this.#showTitle) {
        this.#showTitle = showTitle;
        if (this.#element) {
            this.#content = content;
            this.#element.replaceChildren(this.#realContent);
        } else {
            this.#throwOnRendered();
            this.#content = content;
        }
        return this;
    }

    /**
     * Returns the "real" content of the block.
     * This includes some additional html if the block shall be a card and if the title shall be shown.
     * @returns the content with additional html if required
     */
    get #realContent() {
        return this.#card ?
                <div className="card-body p-3">
                    {this.#showTitle ?
                        <h5 className="card-title d-inline">{this.#title}</h5>
                    :   <></>}
                    <div className="card-text content mt-3">
                        {this.#content}
                    </div>
                </div>
            :   this.#content;
    }

    /**
     * Get if this block has already been rendered.
     * @returns the rendered state
     */
    get rendered() {
        return this.#rendered;
    }

    /**
     * Get the block content element.
     * @returns the block content element
     */
    get element() {
        return this.#element;
    }

    /**
     * renders the block
     * @returns a Promise with the rendered template
     */
    #render() {
        this.#throwOnRendered();
        this.#rendered = true;
        return render('core/block', {
            showskiplink: true,
            title: this.#title,
            skipid: `${this.#id}-${this.#instanceId}`,
            id: `${this.#id}-${this.#instanceId}`,
            hidden: this.#hidden,
            class: Array.from(this.#classes).join(' '),
            hascontrols: this.#controls !== null,
            ariarole: this.#ariaRole,
            type: this.#id,
            blockinstanceid: this.#instanceId,
            arialabel: this.#ariaLabel,
            controls: this.#controls ? getHtml(this.#controls) : '',
            content: getHtml(this.#realContent),
            footer: getHtml(this.#footer),
            annotation: getHtml(this.#annotation),
        });
    }

    /**
     * creates and adds the block to the DOM
     * @param element - the element to which the block should be added
     * @param action - where to put the block in relation to the element
     * @returns a Promise with the created block instance
     */
    async create(
        element: HTMLElement | string,
        action: 'append' | 'prepend' | 'before' | 'after'
    ) {
        this.#throwOnRendered();
        const template = await this.#render();

        this.#elements = await putTemplate<HTMLElement[]>(
            element,
            template,
            action
        );
        this.#element = this.#elements.find(el => el.matches('section'));

        return this;
    }

    /**
     * Removes the block from the DOM
     */
    remove() {
        this.#elements.forEach(el => el.remove());
    }

    /**
     * Adds the block to the DOM
     * @param element - the element to which the block should be added
     * @param action - where to put the block in relation to the element
     */
    put(
        element: HTMLElement,
        action: 'append' | 'prepend' | 'before' | 'after'
    ) {
        element[action](...this.#elements);
    }
}
