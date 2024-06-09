import type {
    default as CoreModalFactory,
    ModalConfig,
    MoodleModal,
} from '../../types/require.js/core/modal_factory';
import { require } from './require.js';
import CoreModalEvents from '../../types/require.js/core/modal_events';

export class Modal {
    readonly #config: ModalConfig;
    readonly #savedFooter: ModalConfig['footer'];

    #modal: MoodleModal | undefined;
    #modalEvents: CoreModalEvents | undefined;

    #queue: CallableFunction[] = [];
    #isReady: boolean = false;

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

            this.#create(create);
        });
    }

    #callWhenReady<Fn extends (...args: any[]) => any>(
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
        this.#prependFooter().then();
    }

    async #prependFooter() {
        if (!this.#savedFooter) return;
        this.#modal!.getFooter().prepend(await this.#savedFooter);
    }

    #create(createFn: CoreModalFactory['create']) {
        createFn(this.#config).then(modal => {
            this.#modal = modal;
            this.#onReady();
        });
    }

    show() {
        this.#callWhenReady(() => this.#modal!.show());

        return this;
    }

    on(Event: keyof CoreModalEvents, callback: (event: JQuery.Event) => void) {
        this.#callWhenReady(() =>
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
