interface ChildDivider {
    divider: true;
}

interface ChildNotDivider {
    divider?: false;
    url: string;
    title?: string;
    attributes?: { key: string; value: string }[];
    text: string;
}

interface Base {
    divider?: false;
    title?: string;
    text: string;
}

interface WithoutChildren {
    haschildren?: false;
    url: string;
}

interface WithChildren {
    haschildren: true;
    children: (ChildDivider | ChildNotDivider)[];
}

type CoreCustomMenuItem = Base & (WithoutChildren | WithChildren);

export default CoreCustomMenuItem;
