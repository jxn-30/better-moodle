import CoreModalEvents from '../../types/require.js/core/modal_events';
import { require } from './require.js';
import type {
    default as CoreModalFactory,
    ModalConfig,
    MoodleModal,
} from '../../types/require.js/core/modal_factory';

export class Modal {
    readonly #config: ModalConfig;
    readonly #savedFooter: ModalConfig['footer'];

    #modal: MoodleModal | undefined;
    #modalEvents: CoreModalEvents | undefined;

    #queue: ((...args: unknown[]) => unknown)[] = [];
    #isReady = false;

    constructor(config: ModalConfig) {
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

            await this.#create(create);
        });
    }

    #callWhenReady<Fn extends (...args: unknown[]) => unknown>(
        callback: Fn
    ): Promise<ReturnType<Fn>> {
        if (this.#isReady) {
            return Promise.resolve(callback());
        } else {
            return new Promise(resolve =>
                this.#queue.push(() => resolve(callback()))
            );
        }
    }

    #onReady() {
        this.#isReady = true;
        this.#queue.forEach(callback => callback());
        await this.#prependFooter();
    }

    async #prependFooter() {
        if (!this.#savedFooter) return;
        this.#modal!.getFooter().prepend(await this.#savedFooter);
    }

    #create(createFn: CoreModalFactory['create']) {
        return createFn(this.#config).then(modal => {
            this.#modal = modal;
            this.#onReady();
        });
    }

    show() {
        await this.#callWhenReady(() => this.#modal!.show());

        return this;
    }

    on(Event: keyof CoreModalEvents, callback: (event: JQuery.Event) => void) {
        await this.#callWhenReady(() =>
            this.#modal!.getRoot().on(this.#modalEvents![Event], callback)
        );

        return this;
    }

    onShown(callback: (event: JQuery.Event) => void) {
        return this.on('shown', callback);
    }

    onSave(callback: (event: JQuery.Event) => void) {
        return this.on('save', callback);
    }

    onCancel(callback: (event: JQuery.Event) => void) {
        return this.on('cancel', callback);
    }

    onHidden(callback: (event: JQuery.Event) => void) {
        return this.on('hidden', callback);
    }

    setTrigger(trigger: Element) {
        trigger.addEventListener('click', () => this.show());

        return this;
    }

    getTitle() {
        return this.#callWhenReady(() => this.#modal!.getTitle());
    }
}
