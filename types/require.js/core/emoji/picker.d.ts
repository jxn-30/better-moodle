// types found out by reading the moodle source code
// may be incomplete at some points

type SelectCallbackType = (emoji: string) => void;
type InitEmojiPicker = (
    root: HTMLDivElement,
    selectCallback: SelectCallbackType
) => void;
export default InitEmojiPicker;
