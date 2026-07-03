/* eslint-disable jsdoc/require-jsdoc */

export interface State {
    bulk: unknown;
    cm: unknown;
    course: unknown;
    section: unknown;
}

export interface Section {
    title: string;
    id: string;
    sectionurl: string;
    cms: { name: string; visible: boolean; anchor: string; url?: string }[];
}

export interface Course {
    editmode: boolean;
    hassections: boolean;
    highlighted: string;
    sections: Section[];
}

export default class Exporter {
    course(state: State): Course;
}
