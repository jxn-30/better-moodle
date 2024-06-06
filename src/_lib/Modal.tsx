import { ModalConfig } from '../../types/require.js/core/modal_factory';

export class Modal {
    constructor(config: ModalConfig) {
        require(['core/modal_factory', 'core/modal_events'] as const, (
            modalFactory,
            modalEvents
        ) => {
            console.log(config, modalFactory, modalEvents);
        });
    }
}
