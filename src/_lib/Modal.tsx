import type {
    default as CoreModalFactory,
    ModalConfig,
    MoodleModal,
} from '../../types/require.js/core/modal_factory';
import { require } from './require.js';
import CoreModalEvents from '../../types/require.js/core/modal_events';

export class Modal {
    readonly #config: ModalConfig;

    #modal: MoodleModal | undefined;
    #modalEvents: CoreModalEvents | undefined;

    #queue: CallableFunction[] = [];
    #isReady: boolean = false;

    constructor(config: ModalConfig) {
        this.#config = config;
        require(['core/modal_factory', 'core/modal_events'] as const, (
            { create, types },
            modalEvents
        ) => {
            this.#config.type = types[config.type];
            this.#modalEvents = modalEvents;

            this.#create(create);
        });
    }

    #callWhenReady(callback: CallableFunction) {
        if (this.#isReady) {
            callback();
        } else {
            this.#queue.push(callback);
        }
    }

    #onReady() {
        this.#isReady = true;
        this.#queue.forEach(callback => callback());
    }

    #create(createFn: CoreModalFactory['create']) {
        createFn(this.#config).then(modal => {
            console.log(modal);
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
}
