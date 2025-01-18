import classNames from 'classnames';
import { debounce } from '@/helpers';
import { ready } from '@/DOM';
import style from '../style/marquee.module.scss';

type Position = 'prepend';

/**
 * A class that creates and manages a marquee
 */
export default class Marquee {
    readonly #parentSelector: string;
    readonly #parentPosition: Position;
    #parent: HTMLElement | null;
    #getMaxWidth: () => number;
    readonly #span = document.createElement('span');
    readonly #cloneSpan = document.createElement('span');
    readonly #content = (
        <div
            className={classNames([style.marquee, 'd-flex align-items-center'])}
        >
            {this.#span}
            {this.#cloneSpan}
        </div>
    ) as HTMLDivElement;
    readonly #observer = new ResizeObserver(
        debounce(() => this.#recalculate())
    );
    readonly #observedElements = new Set<Element>();
    readonly #minWidthPlaceholder = (
        <div class={style.marqueeMinWidthPlaceholder}></div>
    );
    readonly #contentClones = new Map<Element, Element>();

    /**
     * Initializes the Marquee
     * @param parentSelector - a selector that describes the element the marquee will be attached to
     * @param position - where to put the marquee in relation to the parent
     */
    constructor(parentSelector: string, position: Position) {
        this.#parentSelector = parentSelector;
        this.#parentPosition = position;

        this.#observer.observe(this.#span);
    }

    /**
     * Puts the marquee at the designated position to its designated parent
     */
    async #put() {
        await ready();
        this.#parent = document.querySelector<HTMLElement>(
            this.#parentSelector
        );
        if (!this.#parent) {
            throw new Error(
                `Could'nt find a parent with selector ${this.#parentSelector} for marquee`
            );
        }
        this.#parent[this.#parentPosition](
            this.#minWidthPlaceholder,
            this.#content
        );
        this.#recalculate();
        this.#observer.observe(this.#parent);
        this.#observedElements.forEach(el => this.#observer.observe(el));
        window.dispatchEvent(new Event('resize'));
    }

    /**
     * Removes the marquee from the parent
     */
    #remove() {
        this.#parent = null;
        this.#content.remove();
        this.#minWidthPlaceholder.remove();
        this.#observer.disconnect();
    }

    /**
     * Override the default function to calculate the maximum available width
     * @param maxWidthFn - the new function to use
     */
    setMaxWidthFunction(maxWidthFn: () => number) {
        this.#getMaxWidth = maxWidthFn;
        this.#recalculate();
    }

    /**
     * Get the current maximum available width;
     * @returns the current maximum available width in pixels but without unit
     */
    get #maxWidth() {
        if (!this.#parent) return 0;
        return (
            this.#getMaxWidth?.() ??
            parseFloat(getComputedStyle(this.#parent).width)
        );
    }

    /**
     * Adds new elements to the marquee
     * @param els - all elements that shall be added
     * @returns a list that contains the added elements and their respective clones
     */
    add(...els: Element[]) {
        const clones = els.map(el => {
            const clone = el.cloneNode(true) as typeof el;
            this.#span.append(el);
            this.#cloneSpan.append(clone);
            this.#contentClones.set(el, clone);
            return [el, clone];
        });

        if (!this.#parent) void this.#put();

        this.#recalculate();

        return clones;
    }

    /**
     * Remove an element and its clone from the marquee
     * @param el - the element that is to be removed
     */
    remove(el: Element) {
        el.remove();
        this.#contentClones.get(el)?.remove();
        this.#contentClones.delete(el);
        this.#recalculate();

        if (this.#contentClones.size === 0) this.#remove();
    }

    /**
     * Observe this element for resizing to trigger recalculation
     * @param el - the element to observe
     */
    observe(el?: HTMLElement) {
        if (!el) return;
        if (this.#parent) this.#observer.observe(el);
        this.#observedElements.add(el);
    }

    /**
     * Recalculate and set the maximum available width and position
     */
    #recalculate() {
        const maxWidth = Math.floor(this.#maxWidth);
        const textWidth = Math.round(
            parseFloat(getComputedStyle(this.#span).width)
        );
        this.#content.style.setProperty('--max-width', `${maxWidth}px`);
        this.#content.style.setProperty('--text-width', textWidth);

        if (this.#parent) {
            this.#content.style.setProperty(
                '--parent-left',
                `${Math.round(this.#parent.getBoundingClientRect().left)}px`
            );
        }

        if (textWidth > maxWidth) {
            this.#span.dataset.rolling = '';
        } else delete this.#span.dataset.rolling;
    }
}
