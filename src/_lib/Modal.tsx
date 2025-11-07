import CanBeReady from './CanBeReady';
import { className } from 'jsx-dom';
import CoreModalEvents from '#/require.js/core/modal_events';
import type { ModalFactoryConfig } from '#/require.js/core/modal_factory';
import modalStyle from '!/modal.module.scss';
import type MoodleModal from '#/require.js/core/modal';
import { require } from './require.js';

interface Config extends ModalFactoryConfig {
    backgroundImage?: string;
    bodyClass?: Parameters<typeof className>[0];
}

const TypeTo403Lib = {
    ALERT: 'core/local/modal/alert',
    CANCEL: 'core/modal_cancel',
    DEFAULT: 'core/modal',
    SAVE_CANCEL: 'core/modal_save_cancel',
} as const;

/**
 * A wrapper around Moodle's modal factory.
 */
export class Modal extends CanBeReady {
    readonly #config: Config;
    readonly #savedFooter: Config['footer'];

    #modal: MoodleModal | undefined;
    #modalEvents: CoreModalEvents | undefined;
    #triggers = new Map<Element, (event: Event) => void>();

    /**
     * Create a new modal with the given configuration.
     * @param config - the modals config that is passed almost the same to Moodle's modal factory (required changes are made automatically)
     */
    constructor(config: Config) {
        super();

        this.#config = config;

        // setting a footer will prevent creating the button(s)
        // thus we will prepend it later
        if (config.footer) {
            this.#savedFooter = config.footer;
            delete this.#config.footer;
        }

        void this.#create();

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
        if (this.#savedFooter) {
            // We cannot use this.getFooter() as it relies on super.instanceReady being called,
            // which should be called last to avoid visual glitches
            this.#modal!.getFooter().prepend(await this.#savedFooter);
        }

        if (this.#config.bodyClass) {
            // We cannot use this.getBody() as it relies on super.instanceReady being called,
            // which should be called last to avoid visual glitches
            const bodyClassPromise = this.#modal!.getBodyPromise().then(
                ([body]) =>
                    body.classList.add(
                        ...className(this.#config.bodyClass).split(' ')
                    )
            );

            // Seems counter-intuitive on first sight but this is the idea:
            // * If the body is a promise, we want to show the modal immediately as there will be the loading-circle
            // * Otherwise, we can wait for the classes to be added as this will also happen (also) immediately
            if (!(this.#config.body instanceof Promise)) await bodyClassPromise;
        }

        // the instance is ready once modifications are done
        super.instanceReady();
    }

    /**
     * Creates the modal.
     * This method handles the changes introduced in 403
     */
    async #create() {
        const { promise, resolve } = Promise.withResolvers<MoodleModal>();

        if (__MOODLE_VERSION__ < 403) {
            // legacy modal factory
            require(['core/modal_factory', 'core/modal_events'] as const, (
                { create, types },
                modalEvents
            ) => {
                this.#config.type = types[this.#config.type];
                this.#modalEvents = modalEvents;

                void create(this.#config).then(resolve);
            });
        } else {
            // new import for each modal type
            require([
                TypeTo403Lib[this.#config.type],
                'core/modal_events',
            ] as const, (modalClass, modalEvents) => {
                this.#modalEvents = modalEvents;

                void modalClass.create(this.#config).then(resolve);
            });
        }

        this.#modal = await promise;
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
     * Hides the modal once it is ready.
     * @returns the modal instance itself
     */
    hide() {
        this.callWhenReady(() => this.#modal!.hide()).catch(console.error);

        return this;
    }

    /**
     * The callback is called once the modal instance is ready;
     * @param callback - the function that is called
     * @returns the modal instance itself
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
        trigger.classList.add(modalStyle.modalTrigger);
        /**
         * Shows the modal on click
         * @param e - the click event
         */
        const triggerFn = (e: Event) => {
            e.preventDefault();
            this.show();
        };
        trigger.addEventListener('click', triggerFn);
        this.#triggers.set(trigger, triggerFn);

        return this;
    }

    /**
     * Removes a click event listener from the {@link trigger} element.
     * @param trigger - the element that should not be used as a trigger anymore
     * @returns the modal isntance itself
     */
    unsetTrigger(trigger: Element) {
        const triggerFn = this.#triggers.get(trigger);
        if (triggerFn) {
            trigger.classList.remove(modalStyle.modalTrigger);
            trigger.removeEventListener('click', triggerFn);
            this.#triggers.delete(trigger);
        }
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
     * Returns the body element of the modal once the modal is ready.
     * This is a JQuery object as long as moodle is using JQuery.
     * @returns the body element of the modal
     */
    getBody() {
        const { promise, resolve, reject } =
            Promise.withResolvers<JQuery<HTMLDivElement>>();
        void this.callWhenReady(
            async () =>
                await this.#modal!.getBodyPromise().then(resolve, reject)
        );
        return promise;
    }

    /**
     * Returns the footer element of the modal once the modal is ready.
     * This is a JQuery object as long as moodle is using JQuery.
     * @returns the footer element of the modal
     */
    getFooter() {
        return this.callWhenReady(() => this.#modal!.getFooter());
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
                    className={modalStyle.modalBackgroundImage}
                    src={src}
                    aria-hidden={true}
                    alt=""
                />
            )
        );
    }
}
