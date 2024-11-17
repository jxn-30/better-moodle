import CanBeReady from './CanBeReady';
import CoreModalEvents from '#/require.js/core/modal_events';
import modalStyle from '../style/modal.module.scss';
import { require } from './require.js';
import type {
    default as CoreModalFactory,
    ModalConfig,
    MoodleModal,
} from '#/require.js/core/modal_factory';

interface Config extends ModalConfig {
    backgroundImage?: string;
}

/**
 * A wrapper around Moodle's modal factory.
 */
export class Modal extends CanBeReady {
    readonly #config: Config;
    readonly #savedFooter: Config['footer'];

    #modal: MoodleModal | undefined;
    #modalEvents: CoreModalEvents | undefined;

    /**
     * Create a new modal with the given configuration.
     * @param config - the modals config that is passed almost the same to Moodle's modal factory (required changes are made automatically)
     */
    constructor(config: Config) {
        super();

        this.#config = config;

        // we cannot set footer on this type of modal, so we need to postpone prepending it
        if (config.type === 'SAVE_CANCEL') {
            this.#savedFooter = config.footer;
            delete this.#config.footer;
        }

        require(['core/modal_factory', 'core/modal_events'] as const, (
            { create, types },
            modalEvents
        ) => {
            this.#config.type = types[config.type];
            this.#modalEvents = modalEvents;

            this.#create(create).catch(console.error);
        });

        if (config.backgroundImage) {
            this.setBackgroundImage();
        }
    }

    /**
     * This method is called once the modal is ready. It is only called a single time.
     * It resolves all promises that were created before the modal was ready.
     * It also prepends the footer to the modal if it was saved before the modal was ready.
     */
    async #onReady() {
        super.instanceReady();
        await this.#prependFooter();
    }

    /**
     * Prepends the saved footer to the modal's footer.
     */
    async #prependFooter() {
        if (!this.#savedFooter || !this.instanceIsReady) return;
        this.#modal!.getFooter().prepend(await this.#savedFooter);
    }

    /**
     * Creates the modal using the given create function.
     * This method is called once the modal factory is loaded.
     * @param createFn - the create function from the modal factory
     */
    async #create(createFn: CoreModalFactory['create']) {
        this.#modal = await createFn(this.#config);
        await this.#onReady();
    }

    /**
     * Shows the modal once it is ready.
     * @returns the modal instance itself
     */
    show() {
        this.callWhenReady(() => this.#modal!.show()).catch(console.error);

        return this;
    }

    /**
     * @param callback
     */
    onReady(callback: () => void) {
        void this.callWhenReady(callback);

        return this;
    }

    /**
     * Registers an event listener for the given event on the modals root element.
     * JQuery events are used as long as Moodle core uses JQuery.
     * @param Event - the event to listen for
     * @param callback - the function that is called when the event is triggered
     * @returns the modal instance itself
     */
    on(Event: keyof CoreModalEvents, callback: (event: JQuery.Event) => void) {
        void this.callWhenReady(() =>
            this.#modal!.getRoot().on(this.#modalEvents![Event], callback)
        );

        return this;
    }

    /**
     * Shortcut for registering a listener to the shown event.
     * @param callback - the function that is called when the event is triggered
     * @returns the modal instance itself
     */
    onShown(callback: (event: JQuery.Event) => void) {
        return this.on('shown', callback);
    }

    /**
     * Shortcut for registering a listener to the save event.
     * @param callback - the function that is called when the event is triggered
     * @returns the modal instance itself
     */
    onSave(callback: (event: JQuery.Event) => void) {
        return this.on('save', callback);
    }

    /**
     * Shortcut for registering a listener to the cancel event.
     * @param callback - the function that is called when the event is triggered
     * @returns the modal instance itself
     */
    onCancel(callback: (event: JQuery.Event) => void) {
        return this.on('cancel', callback);
    }

    /**
     * Shortcut for registering a listener to the hidden event.
     * @param callback - the function that is called when the event is triggered
     * @returns the modal instance itself
     */
    onHidden(callback: (event: JQuery.Event) => void) {
        return this.on('hidden', callback);
    }

    /**
     * Registers a click event listener to the {@link trigger} element that opens the modal on click.
     * @param trigger - the element that will trigger the modal to open
     * @returns the modal instance itself
     */
    setTrigger(trigger: Element) {
        trigger.addEventListener('click', e => {
            e.preventDefault();
            this.show();
        });

        return this;
    }

    /**
     * Returns the title element of the modal once the modal is ready.
     * This is a JQuery object as long as moodle is using JQuery.
     * @returns the title element of the modal
     */
    getTitle() {
        return this.callWhenReady(() => this.#modal!.getTitle());
    }

    /**
     * Returns the header element of the modal once the modal is ready.
     * It returns not a jQuery Element but an HTMLElement
     * @returns the header element of the modal
     */
    getHeader() {
        return this.callWhenReady(() => this.#modal!.header[0]);
    }

    /**
     * Set a background image for this modal
     * @param src - the image src
     */
    setBackgroundImage(src = this.#config.backgroundImage) {
        if (!src) return;
        void this.getHeader().then(header =>
            header.before(
                <img
                    class={modalStyle.modalBackgroundImage}
                    src={src}
                    aria-hidden={true}
                    alt=""
                />
            )
        );
    }
}
