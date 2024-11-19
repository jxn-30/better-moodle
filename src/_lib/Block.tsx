import { PREFIX } from '@/helpers';
import { render } from '@/templates';
import { getDocumentFragmentHtml, putTemplate } from '@/DOM';

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
    #controls: DocumentFragment | null = null;
    #content = (<></>) as DocumentFragment;
    #footer = (<></>) as DocumentFragment;
    #annotation = (<></>) as DocumentFragment;

    #element: Element | undefined;

    /**
     * creates a new block instance
     * @param id - the id of the block for DOM ID and storage
     */
    constructor(id: string) {
        this.#id = PREFIX(id);
        this.#instanceId = Block.#counters.get(id) ?? 0;
        Block.#counters.set(id, this.#instanceId + 1);
    }

    /**
     * throws an error if the block is already rendered
     * @throws if the block is already rendered
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
     * @returns this
     */
    setContent(content: DocumentFragment) {
        if (this.#element) {
            // TODO
        } else {
            this.#throwOnRendered();
            this.#content = content;
        }
        return this;
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
            controls:
                this.#controls ? getDocumentFragmentHtml(this.#controls) : '',
            content: getDocumentFragmentHtml(this.#content),
            footer: getDocumentFragmentHtml(this.#footer),
            annotation: getDocumentFragmentHtml(this.#annotation),
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

        this.#element = await putTemplate(element, template, action).then(els =>
            els.find(el => el.matches('section'))
        );

        return this;
    }
}
