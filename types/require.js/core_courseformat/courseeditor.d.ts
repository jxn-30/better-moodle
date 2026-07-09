import CourseEditor from './local/courseeditor/courseeditor';

export default interface CoreCourseformatCourseeditor {
    getCourseEditor(courseId: number): CourseEditor;
}
