interface Course {
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

export default interface BlockMyOverviewRepository {
    getEnrolledCoursesByTimeline(args: {
        classification: string;
        customfieldname: string;
        customfieldvalue: string;
        limit: number;
        offset: number;
        sort: string;
    }): Promise<{
        nextoffset: number;
        courses: Course[];
    }>;
}
