// types found out by reading the moodle source code
// may be incomplete at some points

export default interface CoreToast {
    addToastRegion(parent: HTMLElement): Promise<void>;
    add(
        this: void,
        message: string | Promise<string>,
        configuration?: {
            type?: 'success' | 'danger' | 'warning' | 'info' | '';
            autohide?: boolean;
            closeButton?: boolean;
            delay?: number;
        } & ({ title?: string } | { title: string; subtitle?: string }) // if a subtitle is provided, a title must be provided as well
    ): Promise<void>;
}
