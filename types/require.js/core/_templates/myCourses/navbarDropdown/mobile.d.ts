interface Child {
    isactive?: boolean;
    url: string;
    text: string;
    divider?: false;
}

interface MyCoursesNavbarDropdownMobile {
    includeTrigger?: boolean;
    sort: string;
    text: string;
    children: Child[];
}

export default MyCoursesNavbarDropdownMobile;
