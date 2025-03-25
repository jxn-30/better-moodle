// types found out by reading the moodle source code
// may be incomplete at some points

type HasSuggestionCallbackType = (hasSuggestions: boolean) => void;
type SelectCallbackType = (emoji: string) => void;
type InitEmojiAutoComplete = (
    root: HTMLDivElement,
    textArea: HTMLTextAreaElement,
    hasSuggestionCallback: HasSuggestionCallbackType,
    selectCallback: SelectCallbackType
) => void;
export default InitEmojiAutoComplete;
