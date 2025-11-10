// types found out by reading the moodle source code
// may be incomplete at some points

export type ToastMessage = string | Promise<string>;

interface ToastConfigurationBasis {
    type?: 'success' | 'danger' | 'warning' | 'info' | '';
    autohide?: boolean;
    closeButton?: boolean;
    delay?: number;
}
type ToastConfiguration = ToastConfigurationBasis &
    ({ title?: string } | { title: string; subtitle?: string }); // if a subtitle is provided, a title must be provided as well

export default interface CoreToast {
    addToastRegion(parent: HTMLElement): Promise<void>;
    add(
        this: void,
        message: ToastMessage,
        configuration?: ToastConfiguration
    ): Promise<void>;
}
