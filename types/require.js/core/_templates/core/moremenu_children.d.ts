interface Base {
    forceintomoremenu?: boolean;
    isactive?: boolean;
    classes?: string;
    moremenuid?: string;
    title?: string;
    text?: string;
}

interface WithoutChildren {
    haschildren?: false;
    istablist?: boolean;
}

interface WithChildren {
    haschildren: true;
    children: Child[];
}

interface ChildDivider {
    divider: true;
}

interface ChildNotDivider {
    divider?: false;
    url?: string;
    action?: string;
    title?: string;
    text?: string;
}

interface NotActionLink {
    is_action_link?: false;
    isactive?: boolean;
}

interface ActionLink {
    is_action_link: true;
    actionattributes?: {
        name: string;
        value: string;
    };
    action_link_actions?: boolean;
    actions: { event: string; jsfunction: string; jsfunctionargs?: string }[];
}

type Child = ChildDivider | (ChildNotDivider & (NotActionLink | ActionLink));

type CoreMoreMenuChildren = Base &
    (WithChildren | (WithoutChildren & (NotActionLink | ActionLink)));

export default CoreMoreMenuChildren;
