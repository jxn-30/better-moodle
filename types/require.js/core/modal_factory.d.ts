// types found out by reading the moodle source code
// may be incomplete at some points
type ModalType = 'ALERT' | 'CANCEL' | 'DEFAULT' | 'SAVE_CANCEL';

type AwaitedContent = string | Element;
type Content = AwaitedContent | Promise<AwaitedContent>;

type ModalButtons = Record<string, string>;

export interface ModalConfig {
    type: ModalType;
    large?: boolean;
    scrollable?: boolean;
    title: Content;
    body: Content;
    footer?: Content;
    buttons?: ModalButtons;
    removeOnClose?: boolean;
}

export interface MoodleModal {
    show: () => void;

    getRoot: () => JQuery<HTMLDivElement>;
    getTitle: () => JQuery<HTMLHeadingElement>;
    getFooter: () => JQuery<HTMLDivElement>;
}

export default interface CoreModalFactory {
    create: (config: ModalConfig) => Promise<MoodleModal>;
    types: Record<ModalType, ModalType>;
}
