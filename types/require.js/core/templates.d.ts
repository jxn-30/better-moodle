// types found out by reading the moodle source code
// may be incomplete at some points

export default interface CoreTemplates {
    renderForPromise(
        templateName: string,
        context?: unknown,
        themeName?: string
    ): Promise<{ html: string; js: string }>;
    renderPix(key: string, component: string, title?: string): Promise<string>;
}
