/**
 * Creates a string that forwards imports from another file
 * @param mod - the module to import from
 * @param imports - an object specifying the imports to forward
 * @returns a valid `JS export {...} from "..."` string
 */
export const createImportExport = (
    mod: string,
    imports: Record<string, string>
) => {
    const importStr = Object.entries(imports)
        .map(([name, nameAs]) => `${name} as ${nameAs}`)
        .join(', ');
    return `export { ${importStr} } from ${JSON.stringify(mod)}`;
};
