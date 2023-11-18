/* global JQuery */

// region Types representing the used Objects and functions provided by Moodle
// this does not represent the full M object but only the properties we use
interface M {
    cfg: {
        courseId?: number;
    };
    util: {
        set_user_preference(name: string, value: unknown): void;
    };
}

type MoodleModule = string | keyof MoodleModules;

type RequireParams<Modules extends MoodleModule[]> = Modules extends [
    infer First extends MoodleModule,
    ...infer Rest extends MoodleModule[],
]
    ? [
          First extends keyof MoodleModules ? MoodleModules[First] : unknown,
          ...RequireParams<Rest>,
      ]
    : [];

declare global {
    const M: M;

    const require: <Modules extends MoodleModule[]>(
        modules: Modules,
        callback: (...params: RequireParams<Modules>) => unknown
    ) => void;
}
// endregion

// region The Modules defined by Moodle, used within the userscript
// Multiple times used types are put into next section / region
interface MoodleModules {
    'core/modal_factory': {
        create: (
            modalConfig: unknown,
            triggerElement?: unknown
        ) => Promise<Modal>;
        types: {
            ALERT: string;
            CANCEL: string;
            DEFAULT: string;
            SAVE_CANCEL: string;
        };
    };
    'core/modal_events': {
        bodyRendered: string;
        cancel: string;
        destroyed: string;
        hidden: string;
        outsideclick: string;
        save: string;
        shown: string;
    };

    'core_course/repository': {
        getEnrolledCoursesByTimelineClassification(
            classification: string,
            limit?: number,
            offset?: number,
            sort?: string
        ): Promise<{
            courses: EnrolledCourse[];
            nextoffset: number;
        }>;
    };
}
// endregion

// region Types used multiple times
interface EnrolledCourse {
    id: number;
    fullname: string;
    shortname: string;
    idnumber: string;
    summary: string;
    summaryformat: number;
    startdate: number;
    enddate: number;
    visible: boolean;
    showactivitydates: boolean;
    showcompletionconditions: boolean;
    fullnamedisplay: string;
    viewurl: string;
    courseimage: string;
    progress: number;
    hasprogress: boolean;
    isfavourite: boolean;
    hidden: boolean;
    showshortname: boolean;
    coursecategory: string;
}

interface Modal {
    attachementPoint: HTMLElement;

    body: JQuery<HTMLDivElement>;
    bodyJS?: unknown;
    bodyPromise: Promise<unknown>;

    focusOnClose?: unknown;

    footer: JQuery<HTMLDivElement>;
    footerJS?: unknown;
    footerPromise: Promise<unknown>;

    header: JQuery<HTMLDivElement>;
    headerPromise: Promise<unknown>;

    hiddenSiblings: unknown[];
    isAttached: boolean;

    modal: JQuery<HTMLDivElement>;
    modalCount: number;

    root: JQuery<HTMLDivElement>;

    title: JQuery<HTMLHeadingElement>;
    titlePromise: Promise<unknown>;

    // not all methods are included here, only the ones we use
    getBody(): JQuery<HTMLDivElement>;
    getFooter(): JQuery<HTMLDivElement>;
    getRoot(): JQuery<HTMLDivElement>;
    getTitle(): JQuery<HTMLHeadingElement>;
    show(): void;
}
// endregion

export { EnrolledCourse };
