declare module 'virtual:speiseplan-canteens' {
    type Canteens = import('./canteens').default;

    const canteens: Canteens;

    export { canteens };
}
declare module 'virtual:speiseplan-parser' {
    type Parser = import('./parsers').default;

    const parse: Parser;

    export { parse };
}
