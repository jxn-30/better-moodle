export default interface CoreLocalstorage {
    get(key: string): string | false;
    set(key: string, value: string): boolean;
    clean(): void;
}
