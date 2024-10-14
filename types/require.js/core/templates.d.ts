// types found out by reading the moodle source code
// may be incomplete at some points

export default interface CoreTemplates {
    renderPix(key: string, component: string, title?: string): Promise<string>;
}
