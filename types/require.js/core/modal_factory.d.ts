// types found out by reading the moodle source code
// may be incomplete at some points
type ModalType = 'ALERT' | 'CANCEL' | 'DEFAULT' | 'SAVE_CANCEL';

type Content = string | Element | Promise<Content>;

type ModalButtons = Record<string, string>;

interface ModalConfig {
    type: ModalType;
    large?: boolean;
    scrollable?: boolean;
    title?: Content;
    body?: Content;
    footer?: Content;
    buttons?: ModalButtons;
    removeOnClose?: boolean;
}

interface MoodleModal {
    show: () => void;
}

export default interface CoreModalFactory {
    create: (config: ModalConfig) => Promise<MoodleModal>;
    types: Record<ModalType, string>;
}
