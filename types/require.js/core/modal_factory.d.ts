// deprecated in 403

// types found out by reading the moodle source code
// may be incomplete at some points
import { ModalConfig, default as MoodleModal } from './modal';

type ModalType = 'ALERT' | 'CANCEL' | 'DEFAULT' | 'SAVE_CANCEL';

export interface ModalFactoryConfig extends ModalConfig {
    type: ModalType;
}

export default interface CoreModalFactory {
    create: (config: ModalFactoryConfig) => Promise<MoodleModal>;
    types: Record<ModalType, ModalType>;
}
