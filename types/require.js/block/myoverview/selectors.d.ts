export default interface BlockMyOverviewSelectors {
    courseView: {
        region: string;
        regionContent: string;
    };
    FILTERS: string;
    FILTER_OPTION: string;
    DISPLAY_OPTION: string;
    ACTION_HIDE_COURSE: string;
    ACTION_SHOW_COURSE: string;
    ACTION_ADD_FAVOURITE: string;
    ACTION_REMOVE_FAVOURITE: string;
    FAVOURITE_ICON: string;
    ICON_IS_FAVOURITE: string;
    ICON_NOT_FAVOURITE: string;
    region: {
        selectBlock: string;
        clearIcon: string;
        searchInput: string;
    };
}
