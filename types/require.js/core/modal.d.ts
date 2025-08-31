// types found out by reading the moodle source code
// may be incomplete at some points
import { JSX } from 'jsx-dom';

type AwaitedContent = string | JSX.Element;
type Content = AwaitedContent | Promise<AwaitedContent>;

type ModalButtons = Record<string, string>;

export interface ModalConfig {
    large?: boolean;
    scrollable?: boolean;
    title: Content;
    body: Content;
    footer?: Content;
    buttons?: ModalButtons;
    removeOnClose?: boolean;
}

export default interface MoodleModal {
    create: (config: ModalConfig) => Promise<MoodleModal>;

    show: () => void;
    hide: () => void;

    header: JQuery<HTMLDivElement>;

    getRoot: () => JQuery<HTMLDivElement>;
    getTitle: () => JQuery<HTMLHeadingElement>;
    getBody: () => JQuery<HTMLDivElement>;
    getFooter: () => JQuery<HTMLDivElement>;
}
