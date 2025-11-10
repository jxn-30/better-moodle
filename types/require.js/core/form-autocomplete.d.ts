// types found out by reading the moodle source code
// may be incomplete at some points

type EnhanceField = (
    selector: string,
    tags?: boolean,
    ajax?: string,
    placeholder?: string | Promise<string>,
    caseSensitive?: boolean,
    showSuggestions?: boolean,
    noSelectionString?: string | Promise<string>,
    closeSuggestionOnSelect?: boolean,
    templateOverrides?: Partial<
        Record<
            'input' | 'items' | 'layout' | 'selection' | 'suggestions',
            string
        >
    >
) => void;

export default interface CoreFormAutocomplete {
    enhanceField: EnhanceField;
    enhance: JQuery.Promise<ReturnType<EnhanceField>>;
}
