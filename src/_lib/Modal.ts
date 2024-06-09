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

            this.#create(create).catch(console.error);
        });
    }

    #callWhenReady<Args extends unknown[], ReturnType>(
        callback: (...args: Args[]) => ReturnType
    ): Promise<ReturnType> {
        if (this.#isReady) {
            return Promise.resolve<ReturnType>(callback.call(this));
        } else {
            return new Promise<ReturnType>(resolve =>
                this.#queue.push(() => resolve(callback.call(this)))
            );
        }
    }

    async #onReady() {
        this.#isReady = true;
        this.#queue.forEach(callback => callback());
        await this.#prependFooter();
    }

    async #prependFooter() {
        if (!this.#savedFooter) return;
        this.#modal!.getFooter().prepend(await this.#savedFooter);
    }

    async #create(createFn: CoreModalFactory['create']) {
        this.#modal = await createFn(this.#config);
        await this.#onReady();
    }

    show() {
        this.#callWhenReady(() => this.#modal!.show()).catch(console.error);

        return this;
    }

    on(Event: keyof CoreModalEvents, callback: (event: JQuery.Event) => void) {
        this.#callWhenReady(() =>
            this.#modal!.getRoot().on(this.#modalEvents![Event], callback)
        ).catch(console.error);

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
        trigger.addEventListener('click', e => {
            e.preventDefault();
            this.show();
        });

        return this;
    }

    getTitle() {
        return this.#callWhenReady(() => this.#modal!.getTitle());
    }
}
